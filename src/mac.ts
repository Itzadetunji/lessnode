import { exec } from "node:child_process";
import { readdir, rm } from "node:fs/promises";
import os from "node:os";
import { promisify } from "node:util";
import { confirm, multiselect } from "@clack/prompts";
import pc from "picocolors";
import type { ModuleFolder } from "./types";

const LESSNODE_ASCII = String.raw`
 _     _____ ____ ____  _   _  ___  ____  _____
| |   | ____/ ___/ ___|| \ | |/ _ \|  _ \| ____|
| |   |  _| \___ \___ \|  \| | | | | | | |  _|
| |___| |___ ___) |__) | |\  | |_| | |_| | |___
|_____|_____|____/____/|_| \_|\___/|____/|_____|
`;

export async function lessNodeMac() {
	console.log(pc.cyanBright(pc.bold(LESSNODE_ASCII)));
	const rootFolders = await selectRootFolders();
	const moduleFolders = await selectModuleFolders(rootFolders);

	// console.log("Click to go to the folder");

	const selectedModules =
		(await multiselect({
			message: "Select your modules",
			options: moduleFolders,
		})) ?? [];

	console.log(pc.greenBright(pc.bold(`Deleting these modules 👇\n`)));

	for (const module of selectedModules as unknown as ModuleFolder[]) {
		console.log(pc.greenBright(pc.bold(module.label)));
	}

	console.log("\n");

	const confirmDelete = await confirm({
		message: "Are you sure you want to delete the modules?",
	});

	if (confirmDelete) {
		for (const module of selectedModules as unknown as ModuleFolder[]) {
			await deleteModule(module.value);
		}
	} else {
		console.log(pc.yellowBright(pc.bold("\nCancelled node cleanup")));
		process.exit(0);
	}
}

const selectRootFolders = async (): Promise<string[]> => {
	const home = os.homedir();
	const entries = await readdir(home, { withFileTypes: true });
	const rootFolders = entries
		.filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
		.map((entry) => {
			return {
				label: entry.name,
				value: `${entry.parentPath}/${entry.name}`,
			};
		})
		.sort((a, b) => a.label.localeCompare(b.label));

	const rootFoldersSelect =
		(await multiselect({
			message: "Select your root folders",
			options: rootFolders,
		})) ?? [];

	return rootFoldersSelect as string[];
};

const selectModuleFolders = async (
	folders: string[],
): Promise<ModuleFolder[]> => {
	const entries = await readdir(folders[0], { withFileTypes: true });
	const stack: string[] = [];
	const moduleFolders: ModuleFolder[] = [];

	entries.forEach((entry) => {
		if (!entry.isDirectory() || entry.name.endsWith(".app")) return;
		stack.push(`${entry.parentPath}/${entry.name}`);
		// console.log(`${entry.parentPath}/${entry.name}`);
	});
	console.log("\n");
	console.log(pc.greenBright(pc.bold(`Stack: ${stack.join(", ")}`)));

	for (const folder of stack) {
		await getfolders(folder);
	}

	async function getfolders(folder: string): Promise<ModuleFolder[]> {
		const entries = await readdir(folder, { withFileTypes: true });

		for (const entry of entries) {
			if (!entry.isDirectory() || entry.name.endsWith(".app")) continue;
			const path = `${entry.parentPath}/${entry.name}`;

			if (entry.name === "node_modules") {
				moduleFolders.push({ label: await path, value: path });
				continue;
			}
			await getfolders(path);
		}
		return [];
	}

	console.log(
		pc.greenBright(pc.bold(`${moduleFolders.length} module folders found`)),
	);

	return moduleFolders;
};

const deleteModule = async (module: string): Promise<void> => {
	console.log(pc.greenBright(pc.bold(`Deleting module: ${module}`)));
	await rm(module, { recursive: true });
};

async function _getFolderSize(path: string): Promise<string> {
	const { stdout } = await promisify(exec)(`du -sh "${path}"`);
	return stdout.trim();
}
