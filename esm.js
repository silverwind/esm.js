#!/usr/bin/env node
const {readFileSync, writeFileSync} = require("node:fs");

const replace = (_, p1, p2) => {
  if (p2 === ".") {
    p2 = "./index.js";
  } else if (p2.startsWith(".") && !p2.endsWith(".js") && !p2.endsWith(".json")) {
    p2 += ".js";
  }
  return `import ${p1} from "${p2}";`;
}

for (const file of process.argv.slice(2)) {
  let text = readFileSync(file, "utf8");

  text = text.replace(/^module\.exports\./gm, "export const ");
  text = text.replace(/module\.exports\./gm, "");
  text = text.replace(/^const (.*) = require\("(.+)"\);/gm, replace);
  text = text.replace(/^const ({[\s\S]+?) = require\("(.+)"\);$/gm, replace);
  text = text.replace(/^import (.*) from "(.+)";/gm, replace);
  text = text.replace(/^import ({[\s\S]+?) from "(.+)";$/gm, replace);
  text = text.replace(/^"use strict".*$/gm, "");
  text = text.replace(/^\n+/, "");

  writeFileSync(file, text);
}
