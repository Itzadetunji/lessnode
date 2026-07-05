export const osTypes = {
	Windows_NT: "Windows",
	Darwin: "Mac",
	Linux: "Linux",
} as const;

export type OsType = keyof typeof osTypes;
export type OsKeys = (typeof osTypes)[OsType];

export interface ModuleFolder {
	label: string;
	value: string;
}
