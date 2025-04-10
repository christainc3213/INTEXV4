import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/", // <-- Add this line for correct build paths
  plugins: [react()],
  server: {
    port: 5173,
    headers: {
      "Content-Security-Policy":
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "font-src 'self' https://fonts.gstatic.com data:; " +
        "img-src 'self' data:; " +
        "connect-src 'self' https://cineniche-3-9-f4dje0g7fgfhdafk.eastus-01.azurewebsites.net; " +
        "frame-src 'self'; " +
        "object-src 'none'; " +
        "base-uri 'self'; " +
        "form-action 'self';",
    },
    proxy: {
      "/api": {
        target:
          "https://cineniche-3-9-f4dje0g7fgfhdafk.eastus-01.azurewebsites.net",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
