import "reflect-metadata";

export type { Constructor, Provider, Token } from "./di/index.ts";
export {
	Container,
	Inject,
	Injectable,
} from "./di/index.ts";
export type {
	ComponentClass,
	ComponentInstance,
	ComponentMask,
	EntityId,
	QueryDescriptor,
	QueryResult,
	SystemClass,
	SystemInstance,
	SystemOptions,
} from "./ecs/index.ts";
export {
	Component,
	ComponentDecorator,
	Entity,
	NULL_ENTITY,
	Query,
	QueryDecorator,
	System,
	SystemDecorator,
	World,
} from "./ecs/index.ts";
export type {
	GameLoopConfig,
	TickCallback,
	TickContext,
} from "./loop/index.ts";
export { GameLoop } from "./loop/index.ts";
