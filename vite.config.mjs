import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      external: ["path"],
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "app-icon.png",
        "favicon.ico",
        "apple-touch-icon.png",
        "masked-icon.svg",
      ],
      manifest: {
        background_color: "#FFFBF5",
        description: "An opinionated day planner",
        display: "standalone",
        icons: [
          { src: "app-icon.png", sizes: "192x192", type: "image/png" },
          {
            src: "app-icon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
        name: "Dexter Day Planner",
        short_name: "Dexter",
        theme_color: "#553E33",
      },
    }),
  ],
});
