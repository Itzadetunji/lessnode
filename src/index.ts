#!/usr/bin/env node

import os from "node:os";
import { intro, outro } from "@clack/prompts";
import pc from "picocolors";
import { lessNodeExecute } from "./app.js";
import { type OsType, osTypes } from "./types.js";

intro(pc.bgCyan(pc.white("lessnode")));

const osDetails = os.type() as OsType;
const detectedOs = osTypes[osDetails];

console.log(pc.green(pc.bold(`Detected OS: ${detectedOs}`)));

const LESSNODE_ASCII = String.raw`
 _     _____ ____ ____  _   _  ___  ____  _____
| |   | ____/ ___/ ___|| \ | |/ _ \|  _ \| ____|
| |   |  _| \___ \___ \|  \| | | | | | | |  _|
| |___| |___ ___) |__) | |\  | |_| | |_| | |___
|_____|_____|____/____/|_| \_|\___/|____/|_____|

by Adetunji - https://github.com/Itzadetunji
`;

console.log(pc.cyanBright(pc.bold(LESSNODE_ASCII)));

await lessNodeExecute();

// then run your scan function here...
outro(pc.green("Done."));
