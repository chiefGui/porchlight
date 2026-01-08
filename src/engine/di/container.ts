import "reflect-metadata";
import {
	type Constructor,
	INJECT_METADATA_KEY,
	INJECTABLE_METADATA_KEY,
	type Provider,
	type Token,
} from "./types.ts";

export class Container {
	private static instances = new Map<Token, unknown>();
	private static providers = new Map<Token, Provider>();

	static register<T>(provider: Provider<T>): void {
		Container.providers.set(provider.token, provider as Provider);
	}

	static registerClass<T>(target: Constructor<T>): void {
		Container.providers.set(target, { token: target, useClass: target });
	}

	static registerValue<T>(token: Token<T>, value: T): void {
		Container.instances.set(token, value);
	}

	static resolve<T>(token: Token<T>): T {
		if (Container.instances.has(token)) {
			return Container.instances.get(token) as T;
		}

		const provider = Container.providers.get(token);

		if (!provider) {
			if (typeof token === "function") {
				return Container.createInstance(token as Constructor<T>);
			}
			throw new Error(`No provider found for token: ${String(token)}`);
		}

		let instance: T;

		if (provider.useValue !== undefined) {
			instance = provider.useValue as T;
		} else if (provider.useFactory) {
			instance = provider.useFactory() as T;
		} else if (provider.useClass) {
			instance = Container.createInstance(provider.useClass as Constructor<T>);
		} else {
			throw new Error(
				`Invalid provider configuration for token: ${String(token)}`,
			);
		}

		Container.instances.set(token, instance);
		return instance;
	}

	static has(token: Token): boolean {
		return Container.instances.has(token) || Container.providers.has(token);
	}

	static clear(): void {
		Container.instances.clear();
		Container.providers.clear();
	}

	private static createInstance<T>(target: Constructor<T>): T {
		const paramTypes: Constructor[] =
			Reflect.getMetadata("design:paramtypes", target) || [];

		const injections: Map<number, Token> =
			Reflect.getMetadata(INJECT_METADATA_KEY, target) || new Map();

		const dependencies = paramTypes.map((paramType, index) => {
			const injectedToken = injections.get(index);
			const token = injectedToken ?? paramType;

			if (token === undefined || token === Object) {
				throw new Error(
					`Cannot resolve dependency at index ${index} for ${target.name}. ` +
						"Use @Inject() to specify the token explicitly.",
				);
			}

			return Container.resolve(token);
		});

		return new target(...(dependencies as never[]));
	}

	static isInjectable(target: Constructor): boolean {
		return Reflect.getMetadata(INJECTABLE_METADATA_KEY, target) === true;
	}
}
