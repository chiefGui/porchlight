import "reflect-metadata";
import {
	type Constructor,
	Container,
	INJECT_METADATA_KEY,
	INJECTABLE_METADATA_KEY,
	type Token,
} from "./container.ts";

export function Injectable(): ClassDecorator {
	return (target) => {
		Reflect.defineMetadata(INJECTABLE_METADATA_KEY, true, target);
		Container.registerClass(target as unknown as Constructor);
	};
}

export function Inject(token: Token): ParameterDecorator {
	return (target, _propertyKey, parameterIndex) => {
		const existingInjections: Map<number, Token> =
			Reflect.getMetadata(INJECT_METADATA_KEY, target) || new Map();

		existingInjections.set(parameterIndex, token);
		Reflect.defineMetadata(INJECT_METADATA_KEY, existingInjections, target);
	};
}
