import { spawn } from 'child_process';
import WebSocket from 'ws';

// End-to-end integration test for the Aadu Puli Aatam online room server.
// Simulates two players: host -> join -> start -> moves -> immediate capture
// -> illegal moves rejected -> rejoin (refresh recovery) -> rematch.
//
// Run:   node aadupuliatam-server.test.mjs   (uses PORT from env or 8483)
const PORT = Number(process.env.TEST_PORT) || 8483;
const ROOT = new URL('.', import.meta.url).pathname;

function runOnce() {
  return new Promise((resolve) => {
    const proc = spawn('node', ['server.js'], { env: { ...process.env, PORT: String(PORT) }, cwd: ROOT, stdio: 'pipe' });
    const wait = ms => new Promise(r => setTimeout(r, ms));
    let out = '';
    proc.stdout.on('data', d => out += d);
    proc.stderr.on('data', d => out += d);

    const results = [];
    const ok = (name, cond, extra) => { results.push({ name, pass: !!cond }); if (!cond) console.log('FAIL:', name, extra || ''); };

    function client() {
      const ws = new WebSocket('ws://localhost:' + PORT);
      const msgHandlers = [];
      ws.on('message', d => { let m; try { m = JSON.parse(d.toString()); } catch { return; } msgHandlers.push(m); });
      return {
        ws,
        next: (type, timeout = 4000) => new Promise((res2, rej) => {
          const t0 = Date.now();
          const iv = setInterval(() => {
            const i = msgHandlers.findIndex(m => m.type === type);
            if (i >= 0) { const m = msgHandlers.splice(i, 1)[0]; clearInterval(iv); res2(m); }
            else if (Date.now() - t0 > timeout) { clearInterval(iv); rej(new Error('timeout waiting for ' + type + '; got ' + JSON.stringify(msgHandlers.map(h => h.type)))); }
          }, 20);
        }),
        send: o => ws.send(JSON.stringify(o)),
        close: () => ws.close()
      };
    }

    (async () => {
      try {
        await wait(700);
        const A = client();
        await new Promise(r => A.ws.on('open', r));
        const B = client();
        await new Promise(r => B.ws.on('open', r));

        // host
        A.send({ type: 'host', name: 'Alpha', side: 'goats' });
        const lobbyA = await A.next('lobby');
        ok('host gets lobby with room code', /^[A-Z2-9]{4}$/.test(lobbyA.room), lobbyA.room);
        ok('host seat 0', lobbyA.seat === 0);
        ok('host players 1', lobbyA.players.length === 1);

        // join
        B.send({ type: 'join', code: lobbyA.room, name: 'Beta' });
        const lobbyB = await B.next('lobby');
        await A.next('lobby');
        ok('joiner seat 1', lobbyB.seat === 1);
        ok('joiner side tigers', lobbyB.players.find(p => p.seat === 1).side === 'tigers');

        // bad join
        B.send({ type: 'join', code: 'ZZZZ', name: 'C' });
        const errBad = await B.next('err');
        ok('unknown room errors', /not found/.test(errBad.msg));

        // start
        A.send({ type: 'start' });
        const stA = await A.next('state');
        const stB = await B.next('state');
        ok('start: goats turn first', stA.turn === 'goat');
        ok('A is goats', stA.mySide === 'goats');
        ok('B is tigers', stB.mySide === 'tigers');
        ok('tigers start apex+inner', JSON.stringify(stA.tigers) === '[0,3,4]');

        // wrong-side move rejected
        B.send({ type: 'move', move: { type: 'move', tiger: 0, from: 0, to: 5 } });
        const errTurn = await B.next('err');
        ok('tigers cannot act on goat turn', /not the goats/.test(errTurn.msg));

        // illegal goat move rejected
        A.send({ type: 'move', move: { type: 'place', to: 0 } });
        const errIllegal = await A.next('err');
        ok('illegal goat placement rejected', /Illegal/.test(errIllegal.msg));

        // legal place at 2 -> immediate capture (apex tiger jumps to 8)
        A.send({ type: 'move', move: { type: 'place', to: 2 } });
        const capA = await A.next('state');
        const capB = await B.next('state');
        ok('immediate capture applied (captures=1)', capA.captures === 1 && capB.captures === 1, 'captures=' + capA.captures);
        ok('apex tiger jumped to 8', capA.tigers[0] === 8, JSON.stringify(capA.tigers));
        ok('captured goat removed', capA.goats.indexOf(2) === -1);
        ok('lastAction icapture', capA.lastAction && capA.lastAction.type === 'icapture');
        ok('turn returns to goats after capture', capA.turn === 'goat');

        // safe placement -> tigers turn
        A.send({ type: 'move', move: { type: 'place', to: 1 } });
        const p2a = await A.next('state');
        const p2b = await B.next('state');
        ok('safe placement ok', p2a.goats.indexOf(1) !== -1);
        ok('turn now tigers', p2a.turn === 'tiger');

        // tiger moves 8 -> 9
        B.send({ type: 'move', move: { type: 'move', tiger: 0, from: 8, to: 9 } });
        const tm = await B.next('state');
        const tm2 = await A.next('state');
        ok('tiger moved to 9', tm.tigers[0] === 9);
        ok('turn back to goats', tm.turn === 'goat');
        ok('both clients consistent', JSON.stringify(tm.tigers) === JSON.stringify(tm2.tigers));

        // A (goats) tries a tiger move while it is the goats' turn -> some err
        A.send({ type: 'move', move: { type: 'move', tiger: 0, from: 9, to: 10 } });
        const errT = await A.next('err');
        ok('cross-turn tiger move rejected with err', !!errT && typeof errT.msg === 'string', errT.msg);

        // rejoin while B is still connected (simulates a page refresh:
        // a NEW socket B2 claims Beta's seat — the old B socket is orphaned
        // exactly as a refreshed tab would leave its dead socket behind)
        const B2 = client();
        await new Promise(r => B2.ws.on('open', r));
        B2.send({ type: 'rejoin', code: lobbyA.room, name: 'Beta' });
        const rj = await B2.next('state');
        ok('rejoin restores seat + state', rj.seat === 1 && rj.mySide === 'tigers' && rj.captures === 1);
        B.close();                      // old tab closes
        await wait(150);                // let the server notice

        // rematch — the active Beta seat is B2 now
        A.send({ type: 'rematch' });
        const rm = await A.next('state');
        const rm2 = await B2.next('state');
        ok('rematch resets game', rm.captures === 0 && rm.turn === 'goat' && rm.goatsPlaced === 0);
        ok('rematch broadcast to both active seats', rm2.goatsPlaced === 0);

        // host refresh: a NEW socket A2 claims Alpha's seat; the old A socket
        // is orphaned and closed. The refreshed host must KEEP host rights
        // (hostWs reassigned on rejoin) so A2 can trigger the next rematch.
        const A2 = client();
        await new Promise(r => A2.ws.on('open', r));
        A2.send({ type: 'rejoin', code: lobbyA.room, name: 'Alpha' });
        const hr = await A2.next('state');
        ok('host refresh restores seat 0 + goats', hr.seat === 0 && hr.mySide === 'goats');
        A.close();
        await wait(150);

        A2.send({ type: 'rematch' });   // must work — host rights survived refresh
        const hr2 = await A2.next('state');
        const hr3 = await B2.next('state');
        ok('refreshed host can rematch', hr2.captures === 0 && hr2.turn === 'goat');
        ok('rematch reaches refreshed opponent', hr3.goatsPlaced === 0);

        A2.close(); B2.close();
      } catch (e) {
        console.log('EXCEPTION:', e.message);
        console.log('SERVER OUT tail:', out.slice(-1500));
        results.push({ name: 'no exception', pass: false });
      } finally {
        await wait(300);
        proc.kill();
      }
      const failed = results.filter(r => !r.pass);
      console.log('---- ' + (results.length - failed.length) + '/' + results.length + ' passed ----');
      resolve(failed.length ? 1 : 0);
    })();
  });
}

const code1 = await runOnce();
const code2 = await runOnce();
console.log('RUN1 exit=' + code1 + ' RUN2 exit=' + code2);
process.exit(code1 || code2);
