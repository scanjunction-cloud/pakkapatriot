// ============================================================
//  Aadu Puli Aatam, Chaturvimshati Koṣṭaka & Vish & Amrit —
//  online room server
//  ------------------------------------------------------------
//  Hosts multiplayer rooms for the Goats & Tigers game, the
//  Twenty-Four Squares game and the Vish & Amrit chase game
//  (gameType: 'aadu' | 'chaturvimshati' | 'vishamrit').
//  The server runs the authoritative game engine and broadcasts
//  state snapshots to both players, mirroring the same protocol
//  the Chaukabaara online mode uses (host/join/rejoin/start/
//  move/rematch/leave).
//
//  Run:   node server.js            (port 8377)
//         PORT=9000 node server.js  (custom port)
//  Also serves the static game files from ./public, so you can
//  point a browser at http://localhost:8377/aadupuliatam/ and
//  play instantly. For production set VITE_AP_SERVER when
//  building the React app, e.g. VITE_AP_SERVER=wss://games.example.com
// ============================================================
import { createRequire } from 'module';
import http from 'http';
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';

const require = createRequire(import.meta.url);

/* The engine is a UMD-style file, but this package is "type": "module", so
   require()/import would parse it as ESM and no module.exports would ever be
   set. Evaluate it in a CommonJS sandbox instead. */
function loadEngine(relPath) {
  const code = fs.readFileSync(new URL(relPath, import.meta.url), 'utf8');
  const mod = { exports: {} };
  vm.runInNewContext(code, { module: mod, exports: mod.exports, require, console, process }, { filename: relPath });
  return mod.exports;
}
const R = loadEngine('./public/aadupuliatam/engine.js');
const C = loadEngine('./public/chaturvimshati/engine.js');
const V = loadEngine('./public/vishamrit/engine.js');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 8377;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

/* ================= static file serving ================= */
const server = http.createServer((req, res) => {
  try {
    let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    if (urlPath === '/') urlPath = '/aadupuliatam/index.html';
    let filePath = path.normalize(path.join(PUBLIC_DIR, urlPath));
    if (!filePath.startsWith(PUBLIC_DIR)) { res.writeHead(403); res.end('Forbidden'); return; }
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    if (!fs.existsSync(filePath)) { res.writeHead(404); res.end('Not found'); return; }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } catch (e) {
    res.writeHead(500); res.end('Server error');
  }
});

/* ================= room management ================= */
const rooms = new Map(); // code -> room
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I, O, 0, 1

function genCode() {
  let code;
  do {
    code = '';
    for (let i = 0; i < 4; i++) code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  } while (rooms.has(code));
  return code;
}

function send(ws, obj) {
  if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(obj));
}

function broadcast(room, obj) {
  for (const p of room.players) send(p.ws, obj);
}

function otherSide(side) {
  if (side === 'goats') return 'tigers';
  if (side === 'tigers') return 'goats';
  if (side === 'ivory') return 'crimson';
  if (side === 'crimson') return 'ivory';
  if (side === 'runners') return 'vish';
  if (side === 'vish') return 'runners';
  return 'goats';
}

function findPlayer(room, ws) { return room.players.find(p => p.ws === ws); }
function playerBySide(room, side) { return room.players.find(p => p.side === side); }

/* ================= game flow (server-authoritative) ================= */
function pushLog(room, html, cls) {
  room.log.push({ html, cls: cls || '' });
  if (room.log.length > 60) room.log.shift();   // keep chronicles from growing forever
}

function startGame(room) {
  room.started = true;
  room.lastAction = null;
  if (room.gameType === 'chaturvimshati') {
    const ivory = room.players.find(p => p.side === 'ivory');
    const crimson = room.players.find(p => p.side === 'crimson');
    room.game = C.createGame({ names: [ivory ? ivory.name : 'Ivory', crimson ? crimson.name : 'Crimson'], opts: {} });
    room.log = [{ html: 'The twenty-four squares are set — <b>8 ivory</b> face <b>8 crimson</b>.', cls: 'gold' }];
    return;
  }
  if (room.gameType === 'vishamrit') {
    const runners = room.players.find(p => p.side === 'runners');
    const vish = room.players.find(p => p.side === 'vish');
    room.game = V.createGame({ names: [runners ? runners.name : 'Runners', vish ? vish.name : 'Vish'], opts: {} });
    room.log = [{ html: 'The poison awakens — <b>1 Vish</b> hunts <b>3 runners</b>.', cls: 'gold' }];
    return;
  }
  const goats = playerBySide(room, 'goats');
  const tigers = playerBySide(room, 'tigers');
  room.game = R.createGame({ names: [goats.name, tigers.name], opts: {} });
  room.log = [{ html: 'The hunt begins — <b>3 tigers</b> await <b>15 goats</b>.', cls: 'gold' }];
}

function lobbyMsg(room, seat) {
  const me = room.players.find(p => p.seat === seat) || room.players[0];
  return {
    type: 'lobby',
    room: room.code,
    seat,
    host: !!me && me.ws === room.hostWs,
    players: room.players.map(p => ({ seat: p.seat, name: p.name, side: p.side, connected: !!p.ws })),
    started: room.started,
    playerCount: 2
  };
}

function snapshotMsg(room, seat) {
  const g = room.game;
  const me = room.players.find(p => p.seat === seat);
  if (room.gameType === 'chaturvimshati') {
    return {
      type: 'state',
      room: room.code,
      seat,
      host: !!me && me.ws === room.hostWs,
      players: room.players.map(p => ({ seat: p.seat, name: p.name, side: p.side })),
      started: true,
      names: g.names,
      mySide: me ? me.side : null,
      pieces: [g.pieces[0].slice(), g.pieces[1].slice()],
      turn: g.turn,
      over: g.over,
      winner: g.winner,
      rounds: g.rounds,
      lastAction: room.lastAction || null,
      log: room.log
    };
  }
  if (room.gameType === 'vishamrit') {
    return {
      type: 'state',
      room: room.code,
      seat,
      host: !!me && me.ws === room.hostWs,
      players: room.players.map(p => ({ seat: p.seat, name: p.name, side: p.side })),
      started: true,
      names: g.names,
      mySide: me ? me.side : null,
      vish: g.vish,
      runners: g.runners.map(r => ({ cell: r.cell, statue: r.statue })),
      turn: g.turn,
      round: g.round,
      over: g.over,
      winner: g.winner,
      lastAction: room.lastAction || null,
      log: room.log
    };
  }
  return {
    type: 'state',
    room: room.code,
    seat,
    host: !!me && me.ws === room.hostWs,
    players: room.players.map(p => ({ seat: p.seat, name: p.name, side: p.side })),
    started: true,
    names: g.names,
    mySide: me ? me.side : null,
    tigers: g.tigers.slice(),
    goats: Array.from(g.goats),
    goatsPlaced: g.goatsPlaced,
    phase: g.phase,
    turn: g.turn,
    captures: g.captures,
    rounds: g.rounds,
    over: g.over,
    winner: g.winner,
    lastAction: room.lastAction || null,
    log: room.log
  };
}

function broadcastState(room) {
  for (const p of room.players) {
    if (p.ws) send(p.ws, snapshotMsg(room, p.seat));
  }
}

function broadcastLobby(room) {
  for (const p of room.players) {
    if (p.ws) send(p.ws, lobbyMsg(room, p.seat));
  }
}

/* ---- move validation helpers ---- */
function chmMoveKey(m) {
  return (m.type || '') + '|' + (m.piece !== undefined ? m.piece : '') + '|' + (m.from !== undefined ? m.from : '') + '|' + (m.to !== undefined ? m.to : '') +
    '|' + ((m.path || []).join(',')) + '|' + ((m.captures || []).join(','));
}
function goatMoveKey(m) {
  return (m.type || '') + '|' + (m.to !== undefined ? m.to : '') + '|' + (m.goat !== undefined ? m.goat : '');
}
function tigerMoveKey(m) {
  return (m.type || '') + '|' + (m.tiger !== undefined ? m.tiger : '') + '|' + (m.goat !== undefined ? m.goat : '') + '|' + (m.to !== undefined ? m.to : '');
}
function vamMoveKey(m) {
  return (m.type || '') + '|' + (m.idx !== undefined ? m.idx : '') + '|' + (m.from !== undefined ? m.from : '') + '|' + (m.to !== undefined ? m.to : '');
}

function isLegalGoatMove(g, move) {
  return R.getGoatMoves(g).some(m => goatMoveKey(m) === goatMoveKey(move));
}
function isLegalTigerMove(g, move) {
  return R.getTigerMoves(g).some(m => tigerMoveKey(m) === tigerMoveKey(move));
}

/* If no goat can move during the move phase, the goats pass
   (turn rolls to the tigers). Also handles the goats-win case. */
function maybeGoatPass(room) {
  const g = room.game;
  if (g.phase === 'move' && g.turn === 'goat' && R.getGoatMoves(g).length === 0) {
    g.turn = 'tiger';
    room.lastAction = { type: 'pass' };
    pushLog(room, '🐐 No goat can move — the goats pass.', 'gold');
    if (R.checkGoatsWin(g)) {
      pushLog(room, '🐐 The goats surround the tigers — none can move!', 'gold');
    }
  }
}

/* A goat act has happened (place or move). Resolve the immediate-capture
   rule, then hand the turn to the tigers (or back to the goats if the
   goat was eaten). */
function handleGoatMove(room, move) {
  const g = room.game;
  R.applyGoatMove(g, move);

  if (move.type === 'place') {
    room.lastAction = { type: 'place', to: move.to };
    pushLog(room, '🐐 A goat steps onto point ' + move.to + '.');
  } else {
    room.lastAction = { type: 'move', kind: 'goat', from: move.goat, to: move.to };
    pushLog(room, '🐐 A goat steps from point ' + move.goat + ' to ' + move.to + '.');
  }

  const placedPt = move.type === 'place' ? move.to : null;
  const ic = R.immediateCapture(g, placedPt);
  if (ic) {
    // the placed goat sits in a tiger's jaws — eaten at once
    room.lastAction = { type: 'icapture', place: { to: move.to }, capture: ic };
    R.applyTigerMove(g, ic);
    pushLog(room, '🐅 A tiger pounces on the careless goat! (' + g.captures + '/5)', 'gold');
    if (g.over) { broadcastState(room); return; }      // tigers reached 5
    g.turn = 'goat';
    g.rounds++;
    maybeGoatPass(room);
    broadcastState(room);
    return;
  }

  g.turn = 'tiger';
  // goats win the moment none of the tigers can move
  if (R.checkGoatsWin(g)) {
    pushLog(room, '🐐 The goats surround the tigers — none can move!', 'gold');
  }
  broadcastState(room);
}

function handleTigerMove(room, move) {
  const g = room.game;
  R.applyTigerMove(g, move);
  if (move.type === 'capture') {
    room.lastAction = { type: 'capture', tiger: move.tiger, from: move.from, goat: move.goat, to: move.to };
    pushLog(room, '🐅 A tiger leaps and eats a goat! (' + g.captures + '/5)');
  } else {
    room.lastAction = { type: 'move', kind: 'tiger', from: move.from, to: move.to };
    pushLog(room, '🐅 A tiger prowls to point ' + move.to + '.');
  }
  if (g.over) { broadcastState(room); return; }        // tigers reached 5
  g.turn = 'goat';
  g.rounds++;
  maybeGoatPass(room);
  broadcastState(room);
}

function handleChmMove(room, ws, msg) {
  const g = room.game;
  if (!g || g.over) return;
  const p = findPlayer(room, ws);
  if (!p) return;
  const move = msg.move;
  if (!move || typeof move !== 'object') return;
  if (g.turn !== p.seat) { send(ws, { type: 'err', msg: 'It is not your turn.' }); return; }
  const legal = C.getMoves(g).some(m => chmMoveKey(m) === chmMoveKey(move));
  if (!legal) { send(ws, { type: 'err', msg: 'Illegal move.' }); return; }
  const events = C.applyMove(g, move);
  const nCap = events.filter(e => e.type === 'capture').length;
  room.lastAction = move;
  pushLog(room, nCap > 0
    ? '⚔ ' + p.name + ' leaps over ' + nCap + ' piece' + (nCap > 1 ? 's' : '') + '!'
    : '➡ ' + p.name + ' moves.');
  if (C.checkWin(g)) {
    pushLog(room, '👑 ' + g.names[g.winner] + ' wins the Twenty-Four Squares!', 'gold');
    broadcastState(room);
    return;
  }
  g.turn = 1 - g.turn;
  g.rounds++;
  if (C.checkDraw(g)) {
    pushLog(room, '🤝 A truce after ' + g.rounds + ' rounds.', 'gold');
  }
  broadcastState(room);
}

function handleVamMove(room, ws, msg) {
  const g = room.game;
  if (!g || g.over) return;
  const p = findPlayer(room, ws);
  if (!p) return;
  const move = msg.move;
  if (!move || typeof move !== 'object') return;
  if (g.turn !== p.seat) { send(ws, { type: 'err', msg: 'It is not your turn.' }); return; }

  if (move.type === 'runner') {
    if (p.side !== 'runners') { send(ws, { type: 'err', msg: 'You are not the runners.' }); return; }
    if (typeof move.idx !== 'number' || !V.getRunnerMoves(g, move.idx).some(m => vamMoveKey(m) === vamMoveKey(move))) {
      send(ws, { type: 'err', msg: 'Illegal move.' }); return;
    }
    const events = V.applyRunnerMove(g, move);
    const freed = (events[0] && events[0].freed) || [];
    room.lastAction = { type: 'runner', idx: move.idx, from: move.from, to: move.to, freed };
    pushLog(room, freed.length > 0
      ? '✨ <b>' + p.name + '</b> cries “Amrit!” — ' + freed.length + ' statue' + (freed.length > 1 ? 's' : '') + ' freed!'
      : '🏃 <b>' + p.name + '</b> steps to square ' + move.to + '.');
    g.turn = 1;
  } else if (move.type === 'vish') {
    if (p.side !== 'vish') { send(ws, { type: 'err', msg: 'You are not Vish.' }); return; }
    if (!V.getVishMoves(g).some(m => vamMoveKey(m) === vamMoveKey(move))) {
      send(ws, { type: 'err', msg: 'Illegal move.' }); return;
    }
    const vEvents = V.applyVishMove(g, move);
    const captured = (vEvents[0] && vEvents[0].captured !== undefined ? vEvents[0].captured : null);
    room.lastAction = { type: 'vish', from: move.from, to: move.to, captured };
    pushLog(room, (move.captures !== null && move.captures !== undefined)
      ? '🕷️ <b>' + p.name + '</b> touches a runner — <b>Statue!</b>'
      : '🕷️ <b>' + p.name + '</b> prowls to square ' + move.to + '.');
    g.turn = 0;
    g.round++;
  } else {
    send(ws, { type: 'err', msg: 'Illegal move.' }); return;
  }

  if (V.checkWin(g)) {
    pushLog(room, g.winner === 1
      ? '👑 <b>' + g.names[1] + '</b> froze all three runners — <b>Vish wins!</b>'
      : '👑 <b>' + g.names[0] + '</b> survived ' + g.round + ' rounds — <b>Amrit prevails!</b>', 'gold');
  }
  broadcastState(room);
}

function handleMove(room, ws, msg) {
  if (room.gameType === 'chaturvimshati') { handleChmMove(room, ws, msg); return; }
  if (room.gameType === 'vishamrit') { handleVamMove(room, ws, msg); return; }
  const g = room.game;
  if (!g || g.over) return;
  const p = findPlayer(room, ws);
  if (!p) return;
  const move = msg.move;
  if (!move || typeof move !== 'object') return;

  if (g.turn === 'goat') {
    if (p.side !== 'goats') { send(ws, { type: 'err', msg: 'It is not the goats\u2019 turn.' }); return; }
    if (move.type === 'pass') {
      if (g.phase === 'move' && R.getGoatMoves(g).length === 0) {
        g.turn = 'tiger';
        room.lastAction = { type: 'pass' };
        pushLog(room, '🐐 No goat can move — the goats pass.', 'gold');
        if (R.checkGoatsWin(g)) {
          pushLog(room, '🐐 The goats surround the tigers — none can move!', 'gold');
        }
        broadcastState(room);
      }
      return;
    }
    if (!isLegalGoatMove(g, move)) { send(ws, { type: 'err', msg: 'Illegal goat move.' }); return; }
    handleGoatMove(room, move);
  } else {
    if (p.side !== 'tigers') { send(ws, { type: 'err', msg: 'It is not the tigers\u2019 turn.' }); return; }
    if (!isLegalTigerMove(g, move)) { send(ws, { type: 'err', msg: 'Illegal tiger move.' }); return; }
    handleTigerMove(room, move);
  }
}

/* ================= WebSocket ================= */
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    let msg;
    try { msg = JSON.parse(data.toString()); } catch (e) { return; }
    if (!msg || typeof msg !== 'object') return;

    switch (msg.type) {
      /* ---------------- host ---------------- */
      case 'host': {
        const name = String(msg.name || 'Player 1').slice(0, 16);
        const gameType = msg.game === 'chaturvimshati' ? 'chaturvimshati' : (msg.game === 'vishamrit' ? 'vishamrit' : 'aadu');
        const side = gameType === 'chaturvimshati'
          ? (msg.side === 'crimson' ? 'crimson' : 'ivory')
          : (gameType === 'vishamrit'
              ? (msg.side === 'vish' ? 'vish' : 'runners')
              : (msg.side === 'tigers' ? 'tigers' : 'goats'));
        const code = genCode();
        const room = {
          code,
          gameType,
          hostWs: ws,
          hostName: name,
          started: false,
          game: null,
          lastAction: null,
          log: [],
          players: [{ ws, name, side, seat: (side === 'goats' || side === 'ivory' || side === 'runners') ? 0 : 1, connected: true }]
        };
        rooms.set(code, room);
        send(ws, lobbyMsg(room, room.players[0].seat));
        break;
      }

      /* ---------------- join ---------------- */
      case 'join': {
        const code = String(msg.code || '').toUpperCase().trim();
        const name = String(msg.name || 'Guest').slice(0, 16);
        const room = rooms.get(code);
        if (!room) { send(ws, { type: 'err', msg: 'Room ' + code + ' not found.' }); break; }
        if (room.started) { send(ws, { type: 'err', msg: 'That game has already started.' }); break; }
        if (room.players.length >= 2) { send(ws, { type: 'err', msg: 'Room ' + code + ' is full.' }); break; }
        if (room.players.some(x => x.name === name)) { send(ws, { type: 'err', msg: 'That name is taken in this room.' }); break; }
        const side = otherSide(room.players[0].side);
        room.players.push({ ws, name, side, seat: (side === 'goats' || side === 'ivory' || side === 'runners') ? 0 : 1, connected: true });
        broadcastLobby(room);
        break;
      }

      /* ---------------- rejoin (refresh recovery) ---------------- */
      case 'rejoin': {
        const code = String(msg.code || '').toUpperCase().trim();
        const name = String(msg.name || '').slice(0, 16);
        const room = rooms.get(code);
        if (!room) { send(ws, { type: 'err', msg: 'Room ' + code + ' not found.' }); break; }
        const p = room.players.find(x => x.name === name);
        if (!p) { send(ws, { type: 'err', msg: 'Could not restore your seat — rejoin the room.' }); break; }
        p.ws = ws;
        p.connected = true;
        if (name === room.hostName) room.hostWs = ws;   // host refresh keeps host rights
        if (room.started) {
          send(ws, lobbyMsg(room, p.seat));
          send(ws, snapshotMsg(room, p.seat));
        } else {
          broadcastLobby(room);
        }
        break;
      }

      /* ---------------- start ---------------- */
      case 'start': {
        const room = [...rooms.values()].find(r => r.hostWs === ws);
        if (!room) { send(ws, { type: 'err', msg: 'You are not in a room.' }); break; }
        if (room.players.length < 2) { send(ws, { type: 'err', msg: 'Waiting for a second player\u2026' }); break; }
        startGame(room);
        broadcastLobby(room);
        broadcastState(room);
        break;
      }

      /* ---------------- move / pass ---------------- */
      case 'move': {
        const room = [...rooms.values()].find(r => r.players.some(p => p.ws === ws));
        if (!room) { send(ws, { type: 'err', msg: 'You are not in a room.' }); break; }
        handleMove(room, ws, msg);
        break;
      }
      case 'pass': {
        const room = [...rooms.values()].find(r => r.players.some(p => p.ws === ws));
        if (!room) { send(ws, { type: 'err', msg: 'You are not in a room.' }); break; }
        if (room.gameType === 'chaturvimshati' || room.gameType === 'vishamrit') break;   // no pass in these games
        handleMove(room, ws, { move: { type: 'pass' } });
        break;
      }

      /* ---------------- rematch ---------------- */
      case 'rematch': {
        const room = [...rooms.values()].find(r => r.hostWs === ws);
        if (!room) { send(ws, { type: 'err', msg: 'You are not in a room.' }); break; }
        if (room.players.length < 2) { send(ws, { type: 'err', msg: 'Waiting for a second player\u2026' }); break; }
        startGame(room);
        broadcastState(room);
        break;
      }

      /* ---------------- leave ---------------- */
      case 'leave': {
        const room = [...rooms.values()].find(r => r.players.some(p => p.ws === ws));
        if (!room) break;
        if (!room.started) {
          // lobby leave — remove the player entirely
          room.players = room.players.filter(p => p.ws !== ws);
          if (room.players.length === 0) {
            rooms.delete(room.code);
          } else if (room.hostWs === ws) {
            // host abandoned the lobby — close it
            broadcast(room, { type: 'err', msg: 'The host left the room.' });
            rooms.delete(room.code);
          } else {
            broadcastLobby(room);
          }
        } else {
          // mid-game leave: keep the seat so they can rejoin by refreshing
          const p = room.players.find(x => x.ws === ws);
          if (p) { p.ws = null; p.connected = false; }
          broadcastLobby(room);
          broadcast(room, { type: 'err', msg: (p ? p.name : 'A player') + ' left the game \u2014 they can rejoin by refreshing.' });
        }
        break;
      }

      default:
        break;
    }
  });

  ws.on('close', () => {
    // treat a dropped socket like a leave (seat preserved mid-game)
    const room = [...rooms.values()].find(r => r.players.some(p => p.ws === ws));
    if (!room) return;
    const p = room.players.find(x => x.ws === ws);
    if (p) { p.ws = null; p.connected = false; }
    if (room.players.every(x => !x.ws)) {
      rooms.delete(room.code);
      return;
    }
    if (room.hostWs === ws && !room.started) {
      broadcast(room, { type: 'err', msg: 'The host left the room.' });
      rooms.delete(room.code);
      return;
    }
    broadcastLobby(room);
    if (room.started) {
      broadcast(room, { type: 'err', msg: (p ? p.name : 'Your opponent') + ' disconnected \u2014 they can rejoin by refreshing.' });
    }
  });
});

server.listen(PORT, () => {
  console.log('Game server (Aadu Puli Aatam · Chaturvimshati · Vish & Amrit) listening on port ' + PORT);
  console.log('  Web:    http://localhost:' + PORT + '/aadupuliatam/');
  console.log('  Socket: ws://localhost:' + PORT);
});
