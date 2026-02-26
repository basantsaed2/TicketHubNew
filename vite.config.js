import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  assetsInclude: "**/*.Jsx",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
const config = {
  apiUrl: process.env.REACT_APP_API_URL || "http://localhost:3000",
};
