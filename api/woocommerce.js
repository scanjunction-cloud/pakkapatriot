/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Vercel serverless function — proxies WooCommerce Store API requests
 * so the frontend fetches from the same origin (no CORS).
 *
 * Supports:
 *   GET  /api/woocommerce?per_page=,…          → List products
 *   GET  /api/woocommerce/cart                 → Get current cart
 *   POST /api/woocommerce/cart/add             → Add item
 *   POST /api/woocommerce/cart/remove          → Remove item
 *   POST /api/woocommerce/cart/update          → Update item quantity
 *   POST /api/woocommerce/checkout             → Process checkout & return payment URL
 *   POST /api/woocommerce/orders               → Create order via REST API (requires auth)
 */

const WOOCOMMERCE_STORE_API  = "https://pakkapatriot.com/wp-json/wc/store/v1";
const WOOCOMMERCE_REST_API   = "https://pakkapatriot.com/wp-json/wc/v3";

/** ─── Router ─────────────────────────────────────────────────────────── */
export default async function handler(req, res) {
  // Set CORS & cache defaults
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Cart-Token, Nonce");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  try {
    // ── Products (GET) ─────────────────────────────────────────────
    if (pathname === "/api/woocommerce" || pathname === "/api/woocommerce/" || pathname === "/api/woocommerce/products") {
      if (req.method !== "GET") return methodNotAllowed(res);
      return await proxyProducts(req, res);
    }

    // ── Cart: GET ──────────────────────────────────────────────────
    if (pathname === "/api/woocommerce/cart") {
      if (req.method === "GET") return await proxyCartGet(req, res);
      return methodNotAllowed(res);
    }

    // ── Cart: Add Item ─────────────────────────────────────────────
    if (pathname === "/api/woocommerce/cart/add") {
      if (req.method !== "POST") return methodNotAllowed(res);
      return await proxyCartAdd(req, res);
    }

    // ── Cart: Remove Item ──────────────────────────────────────────
    if (pathname === "/api/woocommerce/cart/remove") {
      if (req.method !== "POST") return methodNotAllowed(res);
      return await proxyCartRemove(req, res);
    }

    // ── Cart: Update Item ──────────────────────────────────────────
    if (pathname === "/api/woocommerce/cart/update") {
      if (req.method !== "POST") return methodNotAllowed(res);
      return await proxyCartUpdate(req, res);
    }

    // ── Checkout (Store API) ───────────────────────────────────────
    if (pathname === "/api/woocommerce/checkout") {
      if (req.method !== "POST") return methodNotAllowed(res);
      return await proxyCheckout(req, res);
    }

    // ── Create Order (REST API — requires env creds) ───────────────
    if (pathname === "/api/woocommerce/orders") {
      if (req.method !== "POST") return methodNotAllowed(res);
      return await createOrderREST(req, res);
    }

    // Fallback — 404
    return res.status(404).json({ error: "Unknown endpoint" });
  } catch (error) {
    console.error("WooCommerce proxy error:", error);
    return res.status(502).json({ error: "Failed to fetch from WooCommerce API" });
  }
}

/** ─── Helpers ─────────────────────────────────────────────────────────── */

function methodNotAllowed(res) {
  return res.status(405).json({ error: "Method not allowed" });
}

/** Build fetch options, optionally forwarding Cart-Token & Nonce headers. */
function wooOptions(req, extra = {}) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(req.headers["cart-token"] ? { "Cart-Token": req.headers["cart-token"] } : {}),
    ...(req.headers["nonce"]       ? { "Nonce": req.headers["nonce"] } : {}),
  };
  return { headers, ...extra };
}

/** Forward relevant response headers (Cart-Token, Nonce) back to client. */
function forwardHeaders(res, wooResponse) {
  const ct = wooResponse.headers.get("cart-token");
  const nn = wooResponse.headers.get("nonce");
  if (ct) res.setHeader("Cart-Token", ct);
  if (nn) res.setHeader("Nonce", nn);
}

/** ─── Product Listing ─────────────────────────────────────────────────── */

async function proxyProducts(req, res) {
  const queryString = new URL(req.url, `http://${req.headers.host}`).searchParams.toString();
  const targetUrl = `${WOOCOMMERCE_STORE_API}/products${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(targetUrl, { headers: { Accept: "application/json" } });
  if (!response.ok) {
    return res.status(response.status).json({ error: `WooCommerce API returned ${response.status}` });
  }

  const data = await response.json();
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=60");
  return res.status(200).json(data);
}

/** ─── Cart: GET ───────────────────────────────────────────────────────── */

async function proxyCartGet(req, res) {
  const response = await fetch(`${WOOCOMMERCE_STORE_API}/cart`, wooOptions(req));
  if (!response.ok) {
    return res.status(response.status).json({ error: `WooCommerce cart error ${response.status}` });
  }
  forwardHeaders(res, response);
  const data = await response.json();
  return res.status(200).json(data);
}

/** ─── Cart: Add Item ──────────────────────────────────────────────────── */

async function proxyCartAdd(req, res) {
  const body = await readJSON(req);
  const response = await fetch(
    `${WOOCOMMERCE_STORE_API}/cart/add-item`,
    wooOptions(req, {
      method: "POST",
      body: JSON.stringify({
        id: body.id,
        quantity: body.quantity ?? 1,
      }),
    })
  );
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    return res.status(response.status).json({ error: err.message || `Cart add failed (${response.status})` });
  }
  forwardHeaders(res, response);
  const data = await response.json();
  return res.status(200).json(data);
}

/** ─── Cart: Remove Item ───────────────────────────────────────────────── */

async function proxyCartRemove(req, res) {
  const body = await readJSON(req);
  const response = await fetch(
    `${WOOCOMMERCE_STORE_API}/cart/remove-item`,
    wooOptions(req, {
      method: "POST",
      body: JSON.stringify({ key: body.key }),
    })
  );
  if (!response.ok) {
    return res.status(response.status).json({ error: `Cart remove error ${response.status}` });
  }
  forwardHeaders(res, response);
  const data = await response.json();
  return res.status(200).json(data);
}

/** ─── Cart: Update Item ───────────────────────────────────────────────── */

async function proxyCartUpdate(req, res) {
  const body = await readJSON(req);
  const response = await fetch(
    `${WOOCOMMERCE_STORE_API}/cart/update-item`,
    wooOptions(req, {
      method: "POST",
      body: JSON.stringify({
        key: body.key,
        quantity: body.quantity,
      }),
    })
  );
  if (!response.ok) {
    return res.status(response.status).json({ error: `Cart update error ${response.status}` });
  }
  forwardHeaders(res, response);
  const data = await response.json();
  return res.status(200).json(data);
}

/** ─── Checkout (Store API) ────────────────────────────────────────────── */

async function proxyCheckout(req, res) {
  const body = await readJSON(req);

  // Build the checkout payload expected by WooCommerce Store API
  const checkoutPayload = {
    billing_address: {
      first_name: body.first_name || "",
      last_name:  body.last_name || "",
      address_1:  body.address_1 || "",
      address_2:  body.address_2 || "",
      city:       body.city || "",
      state:      body.state || "",
      postcode:   body.postcode || "",
      country:    body.country || "IN",
      email:      body.email || "",
      phone:      body.phone || "",
    },
    shipping_address: {
      first_name: body.shipping_first_name || body.first_name || "",
      last_name:  body.shipping_last_name  || body.last_name  || "",
      address_1:  body.shipping_address_1  || body.address_1  || "",
      address_2:  body.shipping_address_2  || body.address_2  || "",
      city:       body.shipping_city       || body.city       || "",
      state:      body.shipping_state      || body.state      || "",
      postcode:   body.shipping_postcode   || body.postcode   || "",
      country:    body.shipping_country    || body.country    || "IN",
    },
    payment_method: body.payment_method || "bacs",
  };

  // Include customer note if provided
  if (body.customer_note) {
    checkoutPayload.customer_note = body.customer_note;
  }

  const response = await fetch(
    `${WOOCOMMERCE_STORE_API}/checkout`,
    wooOptions(req, {
      method: "POST",
      body: JSON.stringify(checkoutPayload),
    })
  );

  forwardHeaders(res, response);
  const data = await response.json();

  if (!response.ok) {
    return res.status(response.status).json({
      error: data.message || data.code || `Checkout failed (${response.status})`,
      details: data,
    });
  }

  return res.status(200).json(data);
}

/** ─── Create Order via REST API (requires env WOOCOMMERCE_CONSUMER_KEY/SECRET) ── */

async function createOrderREST(req, res) {
  const ck = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const cs = process.env.WOOCOMMERCE_CONSUMER_SECRET;

  if (!ck || !cs) {
    return res.status(500).json({
      error: "Order system not configured.",
    });
  }

  const body = await readJSON(req);
  const rawItems = body.line_items || [];

  // ── Convert items to fee_lines ───────────────────────────────────────────
  // WooCommerce REST API rejects product_id: 0 in line_items — they require
  // real product IDs that exist on the store. Since our frontend may show
  // fallback products that don't exist on WooCommerce (hoodies, mugs, etc.),
  // we use fee_lines instead. Fee lines support custom names + totals and
  // show clearly in WooCommerce admin order details.
  const fee_lines = rawItems.map((item) => ({
    name: `${item.quantity || 1} × ${item.name || "Custom Item"}`,
    total: item.total || String(parseFloat(item.price || "0") * (item.quantity || 1)),
    tax_status: "none",
  }));

  // ── Build order payload ────────────────────────────────────────────────
  const orderPayload = {
    payment_method: body.payment_method || "bacs",
    payment_method_title: body.payment_method_title || "Frontend App Order",
    set_paid: false,
    billing: {
      first_name: body.first_name || "",
      last_name:  body.last_name || "",
      address_1:  body.address_1 || "",
      address_2:  body.address_2 || "",
      city:       body.city || "",
      state:      body.state || "",
      postcode:   body.postcode || "",
      country:    body.country || "IN",
      email:      body.email || "",
      phone:      body.phone || "",
    },
    shipping: {
      first_name: body.shipping_first_name || body.first_name || "",
      last_name:  body.shipping_last_name  || body.last_name  || "",
      address_1:  body.shipping_address_1  || body.address_1  || "",
      address_2:  body.shipping_address_2  || body.address_2  || "",
      city:       body.shipping_city       || body.city       || "",
      state:      body.shipping_state      || body.state      || "",
      postcode:   body.shipping_postcode   || body.postcode   || "",
      country:    body.shipping_country    || body.country    || "IN",
    },
    // No line_items — we use fee_lines instead to support custom items
    line_items: [],
    fee_lines,
    customer_note: body.customer_note || "",
    // Store frontend metadata so admins can see where the order came from
    meta_data: [
      {
        key: "_order_source",
        value: "PakkaPatriot.com Frontend App",
      },
    ],
  };

  const auth = Buffer.from(`${ck}:${cs}`).toString("base64");

  const response = await fetch(`${WOOCOMMERCE_REST_API}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
      Accept: "application/json",
    },
    body: JSON.stringify(orderPayload),
  });

  const data = await response.json();

  if (!response.ok) {
    return res.status(response.status).json({
      error: data.message || `Order creation failed (${response.status})`,
      details: data,
    });
  }

  return res.status(200).json({
    order_id: data.id,
    order_key: data.order_key,
    total: data.total,
    currency: data.currency,
    status: data.status,
  });
}

/** ─── Utility ─────────────────────────────────────────────────────────── */

function readJSON(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => (raw += chunk));
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}
