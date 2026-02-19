import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@tabler/icons-react": path.resolve(
        __dirname,
        "./node_modules/@tabler/icons-react/dist/cjs/tabler-icons-react.cjs"
      ),
    },
  },
}));
