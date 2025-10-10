#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const SRC = path.resolve("src");
const DIST = path.resolve("dist");

function ensure(p) {
  fs.mkdirSync(p, { recursive: true });
}
function copyFile(src, dest) {
  ensure(path.dirname(dest));
  fs.copyFileSync(src, dest);
}
function walk(dir, fn) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, fn);
    else fn(full);
  }
}

function copyAll() {
  // public/
  walk(path.join(SRC, "public"), (p) => copyFile(p, p.replace(SRC, DIST)));
  // pages/
  walk(path.join(SRC, "pages"), (p) => {
    if (p.endsWith(".html")) copyFile(p, p.replace(SRC, DIST));
  });
  // JS
  walk(path.join(SRC, "scripts"), (p) => {
    if (p.endsWith(".js"))
      copyFile(p, p.replace(SRC, path.join(DIST, "assets/js")));
  });
  // .nojekyll
  copyFile(".nojekyll", path.join(DIST, ".nojekyll"));
}

copyAll();
