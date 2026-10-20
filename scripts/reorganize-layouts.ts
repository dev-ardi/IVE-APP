import fs from "fs";
import path from "path";

const appDir = path.resolve(__dirname, "../src/app");
const publicDir = path.join(appDir, "(public)");
const authDir = path.join(appDir, "(auth)");

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true });

const publicItems = ["explore", "lab", "learn", "my-learning", "quiz", "search", "page.tsx"];
for (const item of publicItems) {
  const src = path.join(appDir, item);
  const dest = path.join(publicDir, item);
  if (fs.existsSync(src)) {
    fs.renameSync(src, dest);
    console.log(`Moved ${item} to (public)/${item}`);
  }
}

const authItems = ["login"];
for (const item of authItems) {
  const src = path.join(appDir, item);
  const dest = path.join(authDir, item);
  if (fs.existsSync(src)) {
    fs.renameSync(src, dest);
    console.log(`Moved ${item} to (auth)/${item}`);
  }
}

console.log("Reorganization complete.");
