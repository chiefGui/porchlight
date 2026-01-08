import "reflect-metadata";
import { type Constructor, Container } from "../di/index.ts";
import type { ComponentClass } from "./component.ts";
import { QUERY_METADATA_KEY, Query } from "./query.ts";

export type SystemOptions = {
	phase?: string;
};

export type SystemInstance = {
	tick(): void;
};

export type SystemClass = Constructor<SystemInstance>;

export const SYSTEM_METADATA_KEY = Symbol("ecs:system");

export class System {
	private static registry = new Map<SystemClass, SystemOptions>();
	private static instances = new Map<SystemClass, SystemInstance>();
	private static phases = new Map<string, Set<SystemClass>>();

	static register(systemClass: SystemClass, options: SystemOptions = {}): void {
		System.registry.set(systemClass, options);

		const phase = options.phase ?? "default";
		if (!System.phases.has(phase)) {
			System.phases.set(phase, new Set());
		}
		System.phases.get(phase)?.add(systemClass);
	}

	static resolve<T extends SystemInstance>(systemClass: Constructor<T>): T {
		if (System.instances.has(systemClass as SystemClass)) {
			return System.instances.get(systemClass as SystemClass) as T;
		}

		const instance = System.createInstance(systemClass);
		System.instances.set(systemClass as SystemClass, instance);
		return instance;
	}

	private static createInstance<T extends SystemInstance>(
		systemClass: Constructor<T>,
	): T {
		const paramTypes: Constructor[] =
			Reflect.getMetadata("design:paramtypes", systemClass) || [];

		const queryMetadata: Map<number, ComponentClass[]> =
			Reflect.getMetadata(QUERY_METADATA_KEY, systemClass) || new Map();

		const dependencies = paramTypes.map((paramType, index) => {
			const queryComponents = queryMetadata.get(index);

			if (queryComponents) {
				return Query.create(...queryComponents);
			}

			if ((paramType as unknown) === Query) {
				throw new Error(
					`Query parameter at index ${index} in ${systemClass.name} requires @Query() decorator`,
				);
			}

			return Container.resolve(paramType);
		});

		return new systemClass(...(dependencies as never[]));
	}

	static run(...systemClasses: SystemClass[]): void {
		for (const systemClass of systemClasses) {
			const instance = System.resolve(systemClass);
			instance.tick();
		}
	}

	static runPhase(phase: string): void {
		const systems = System.phases.get(phase);
		if (!systems) {
			return;
		}

		for (const systemClass of systems) {
			const instance = System.resolve(systemClass);
			instance.tick();
		}
	}

	static getPhases(): string[] {
		return [...System.phases.keys()];
	}

	static getSystemsInPhase(phase: string): SystemClass[] {
		return [...(System.phases.get(phase) ?? [])];
	}

	static isRegistered(systemClass: SystemClass): boolean {
		return System.registry.has(systemClass);
	}

	static reset(): void {
		System.registry.clear();
		System.instances.clear();
		System.phases.clear();
	}
}

export function SystemDecorator(options: SystemOptions = {}): ClassDecorator {
	return (target) => {
		Reflect.defineMetadata(SYSTEM_METADATA_KEY, options, target);
		System.register(target as unknown as SystemClass, options);
	};
}
