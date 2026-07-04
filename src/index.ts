export interface LessnodeOptions {
	prefix?: string;
}

export function greet(name: string, options: LessnodeOptions = {}): string {
	const prefix = options.prefix ?? "Hello";
	return `${prefix}, ${name}!`;
}
