import type { Constructor } from "../di/index.ts";

export type EntityId = number;

export const NULL_ENTITY: EntityId = 0;

export type ComponentClass<T = object> = Constructor<T>;

export type ComponentInstance = object;

export type ComponentMask = bigint;

export type QueryDescriptor = {
	all?: ComponentClass[];
	any?: ComponentClass[];
	none?: ComponentClass[];
};

export type QueryResult<T extends ComponentInstance[]> = Iterable<
	[EntityId, ...T]
>;

export const COMPONENT_METADATA_KEY = Symbol("ecs:component");
export const SYSTEM_METADATA_KEY = Symbol("ecs:system");
export const QUERY_METADATA_KEY = Symbol("ecs:query");
