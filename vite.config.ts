import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      // Order matters: more specific routes first
      proxy: {
        // REST API for order creation (requires WooCommerce API credentials)
        '/api/woocommerce/orders': {
          target: 'https://pakkapatriot.com',
          changeOrigin: true,
          auth: process.env.WOOCOMMERCE_CONSUMER_KEY && process.env.WOOCOMMERCE_CONSUMER_SECRET
            ? `${process.env.WOOCOMMERCE_CONSUMER_KEY}:${process.env.WOOCOMMERCE_CONSUMER_SECRET}`
            : undefined,
          rewrite: (pathname) => pathname.replace(/^\/api\/woocommerce/, '/wp-json/wc/v3'),
        },
        // Store API for products, cart, checkout
        '/api/woocommerce': {
          target: 'https://pakkapatriot.com',
          changeOrigin: true,
          rewrite: (pathname) => pathname.replace(/^\/api\/woocommerce/, '/wp-json/wc/store/v1'),
        },
      },
    },
  };
});
