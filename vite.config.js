import { sync } from "glob";
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "./src",
  build: {
    outDir: "../dist",
    emptyOutDir:true,
    rollupOptions: {
      input:'./src/index.html',
      wishlist:'./src/wishlist/wishlist.html',
    },
  },
});
