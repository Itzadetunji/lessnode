#!/usr/bin/env node

import os from "node:os";
import { intro, outro } from "@clack/prompts";
import pc from "picocolors";
import { lessNodeMac } from "./mac.js";
import { type OsType, osTypes } from "./types.js";

intro(pc.bgCyan(pc.white("lessnode")));

const osDetails = os.type() as OsType;
const detectedOs = osTypes[osDetails];

console.log(pc.green(pc.bold(`Detected OS: ${detectedOs}`)));

if (detectedOs === "Windows") {
	console.log(pc.green(pc.bold("Windows detected")));
} else if (detectedOs === "Mac") {
	await lessNodeMac();
} else if (detectedOs === "Linux") {
	console.log(pc.green(pc.bold("Linux detected")));
}

// then run your scan function here...
outro(pc.green("Done."));
