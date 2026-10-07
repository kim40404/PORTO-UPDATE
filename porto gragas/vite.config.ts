import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Multi-file build for Vercel: hashed, cacheable assets instead of one inlined HTML.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  build: {
    target: "es2022",
    rollupOptions: {
      output: {
        manualChunks: { gsap: ["gsap", "gsap/ScrollTrigger"], lenis: ["lenis"] },
      },
    },
  },
});
