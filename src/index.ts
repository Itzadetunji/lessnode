import {
	intro,
	select,
	multiselect,
	isCancel,
	cancel,
	outro,
} from "@clack/prompts";
import pc from "picocolors";
import { readFile, writeFile, readdir } from "fs/promises";
import os from "node:os";
import { lessNodeMac } from "./mac";
import { OsType, osTypes } from "./types";

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

// if (isCancel(mode)) {
// 	cancel("No mode selected");
// 	process.exit(0);
// }

// then run your scan function here...
outro(pc.green("Done."));
