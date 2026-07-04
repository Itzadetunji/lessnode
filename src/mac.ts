import {
	intro,
	select,
	multiselect,
	isCancel,
	cancel,
	outro,
} from "@clack/prompts";
import { readdir } from "fs/promises";
import pc from "picocolors";
import os from "node:os";


export async function lessNodeMac () {
  const rootFolders = await selectRootFolders()
  // console.log(rootFolders)
  const moduleFolders = await selectModuleFolders(rootFolders)

  
  console.log("Click to go to the folder")
  const selectedModules = await multiselect({
    message: "Select your modules",
    options: moduleFolders.map((folder) => ({ label: folder, value: folder }))
  }) ?? [];

  // console.log(pc.green(pc.bold(files.join("\n"))));
}

const selectRootFolders = async (): Promise<string[]> =>{
  const home  = os.homedir();
  const entries = await readdir(home, { withFileTypes: true });
  const rootFolders = entries.filter((entry) => entry.isDirectory() && !entry.name. startsWith(".")).map((entry) => {
    return {
      label: entry.name,
      value: entry.parentPath + "/" + entry.name,
    }
  }).sort((a, b) => a.label.localeCompare(b.label));
  
  const rootFoldersSelect = await multiselect({
    message: "Select your root folders",
    options: rootFolders
  }) ?? [];

  return rootFoldersSelect as string[];
}

const selectModuleFolders = async (folders: string[]): Promise<string[]> =>{
  const entries = await readdir(folders[0], { withFileTypes: true });
  const stack: string[] = [];
  let moduleFolders: string[] = [];

  entries.forEach((entry) => {
    if (!entry.isDirectory() || entry.name.endsWith(".app")) return;
    stack.push(entry.parentPath + "/" + entry.name);
    console.log(entry.parentPath + "/" + entry.name);
  })
  console.log("\n")
  console.log(pc.greenBright(pc.bold(`Stack: ${stack.join(", ")}`)));

  for (const folder of stack) {
    await getfolders(folder);
  }

  async function getfolders (folder:string): Promise<void> {
    const entries = await readdir(folder, { withFileTypes: true });
  
    for(const entry of entries) {
      if (!entry.isDirectory() || entry.name.endsWith(".app")) continue;
      const path = entry.parentPath + "/" + entry.name;
      
      if(entry.name === ("node_modules")) {
        moduleFolders.push(path) ;
        continue;
      }
      await getfolders(path);
    }
    return;
  }

  console.log(pc.greenBright(pc.bold(`${moduleFolders.length} module folders found`)));
  return moduleFolders;
}

