export type Constructor<T = object> = new (...args: never[]) => T;

export type Token<T = unknown> = Constructor<T> | string | symbol;

export type Provider<T = unknown> = {
	token: Token<T>;
	useClass?: Constructor<T>;
	useValue?: T;
	useFactory?: () => T;
};

export const INJECTABLE_METADATA_KEY = Symbol("di:injectable");
export const INJECT_METADATA_KEY = Symbol("di:inject");
