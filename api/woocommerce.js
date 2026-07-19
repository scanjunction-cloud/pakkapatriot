/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Vercel serverless function — proxies WooCommerce Store API requests
 * so the frontend fetches from the same origin (no CORS).
 */

const WOOCOMMERCE_API_BASE = "https://pakkapatriot.com/wp-json/wc/store/v1";

export default async function handler(req, res) {
  // Only allow GET
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Forward query params (e.g. per_page, page, search)
  const queryString = new URL(req.url, `http://${req.headers.host}`).searchParams.toString();
  const targetUrl = `${WOOCOMMERCE_API_BASE}/products${queryString ? `?${queryString}` : ""}`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `WooCommerce API returned ${response.status}`,
      });
    }

    const data = await response.json();

    // Forward important headers
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=60");

    return res.status(200).json(data);
  } catch (error) {
    console.error("WooCommerce proxy error:", error);
    return res.status(502).json({ error: "Failed to fetch from WooCommerce API" });
  }
}
