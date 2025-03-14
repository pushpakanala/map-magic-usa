
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  base: "./", // Ensures relative paths for assets
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    (mode === "dev" || mode === "development" || mode === "web") && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  esbuild: {
    loader: "tsx",
    include: /src\/.*\.[tj]sx?$/,
    exclude: /node_modules/,
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name].[hash][extname]",
        chunkFileNames: "assets/[name].[hash].js",
        entryFileNames: "assets/[name].[hash].js",
      },
    },
  },
  optimizeDeps: {
    include: [
      "@radix-ui/react-avatar",
      "@radix-ui/react-toast",
      "@radix-ui/react-dialog",
      "@radix-ui/react-slot",
      // Add other Radix UI packages used in your project
    ],
  },
}));
