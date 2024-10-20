import { sync } from "glob";
import { resolve } from "path";

export default {
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src/*"),
      "@js":resolve(__dirname,"./src/assets/js/*"),
      "@css": resolve(__dirname, "./src/assets/css/*"),
    },
  },
  root: "./src",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
        input: sync("@/**/*.html".replace(/\\/g, "/")),
    },
  },
};
