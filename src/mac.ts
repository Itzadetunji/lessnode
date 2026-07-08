import { exec } from "node:child_process";
import { readdir, rm } from "node:fs/promises";
import os from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { cancel, confirm, isCancel, multiselect, outro } from "@clack/prompts";
import pc from "picocolors";
import type { ModuleFolder } from "./types.js";

export async function lessNodeMac() {
	const rootFolders = await selectRootFolders();
	if (rootFolders.length === 0) {
		exitCancelled("No root folder selected.");
	}

	const moduleFolders = await selectModuleFolders(rootFolders);
	if (moduleFolders.length === 0) {
		exitCancelled("No node_modules folders found.");
	}

	// console.log("Click to go to the folder");

	const selectedModulesInput = await multiselect({
		message: "Select your modules",
		options: moduleFolders,
	});
	if (isCancel(selectedModulesInput)) {
		exitCancelled("Module selection cancelled.");
	}
	const selectedModules = selectedModulesInput ?? [];

	console.log(pc.greenBright(pc.bold(`Deleting these modules 👇\n`)));

	for (const module of selectedModules as unknown as ModuleFolder[]) {
		console.log(pc.greenBright(pc.bold(module.label)));
	}

	console.log("\n");

	const confirmDelete = await confirm({
		message: "Are you sure you want to delete the modules?",
	});

	if (isCancel(confirmDelete) || !confirmDelete) {
		exitCancelled("Cancelled node cleanup.");
	}

	if (confirmDelete) {
		for (const module of selectedModules as unknown as ModuleFolder[]) {
			await deleteModule(module.value);
		}
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
				value: join(entry.parentPath, entry.name),
			};
		})
		.sort((a, b) => a.label.localeCompare(b.label));

	const rootFoldersSelect = await multiselect({
		message: "Select your root folders",
		options: rootFolders,
	});
	if (isCancel(rootFoldersSelect)) {
		exitCancelled("Root folder selection cancelled.");
	}

	return (rootFoldersSelect ?? []) as string[];
};

const selectModuleFolders = async (
	folders: string[],
): Promise<ModuleFolder[]> => {
	if (folders.length === 0) {
		return [];
	}

	const entries = await readdir(folders[0], { withFileTypes: true });
	const stack: string[] = [];
	const moduleFolders: ModuleFolder[] = [];

	entries.forEach((entry) => {
		if (!entry.isDirectory() || entry.name.endsWith(".app")) return;
		stack.push(join(entry.parentPath, entry.name));
		// console.log(`${entry.parentPath}/${entry.name}`);
	});
	console.log("\n");
	// console.log(pc.greenBright(pc.bold(`Stack: ${stack.join(", ")}`)));

	for (const folder of stack) {
		await getfolders(folder);
	}

	async function getfolders(folder: string): Promise<void> {
		const entries = await readdir(folder, { withFileTypes: true });

		for (const entry of entries) {
			if (!entry.isDirectory() || entry.name.endsWith(".app")) continue;
			const path = join(entry.parentPath, entry.name);

			if (entry.name === "node_modules") {
				moduleFolders.push({ label: await path, value: path });
				continue;
			}
			await getfolders(path);
		}
		return;
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

function exitCancelled(message: string): never {
	cancel(message);
	outro(pc.yellow(pc.bold("Exiting lessnode. No changes were made.")));
	process.exit(0);
}
