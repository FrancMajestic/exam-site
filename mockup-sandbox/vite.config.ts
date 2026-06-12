import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { mockupPreviewPlugin } from "./mockupPreviewPlugin";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss(), mockupPreviewPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
