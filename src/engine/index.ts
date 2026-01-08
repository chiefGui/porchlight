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
	ComponentRegistrationCallback,
	EntityId,
	QueryDescriptor,
	QueryResult,
	SystemClass,
	SystemInstance,
	SystemOptions,
	TagDescriptor,
	TagMask,
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
	Tag,
	World,
} from "./ecs/index.ts";
export type {
	GameLoopConfig,
	TickCallback,
	TickContext,
} from "./loop/index.ts";
export { GameLoop } from "./loop/index.ts";
export type {
	PersistenceConfig,
	PersistenceStrategy,
	SerializedComponent,
	SerializedEntity,
	SerializedGameState,
	StorageAdapter,
} from "./persistence/index.ts";
export {
	IndexedDBAdapter,
	Persistence,
	Serializer,
} from "./persistence/index.ts";
export type { EngineProviderProps } from "./react/index.ts";
export {
	EngineProvider,
	useComponent,
	useComponentValue,
	useEngineContext,
	useEntity,
	useGameLoop,
	usePersistence,
	useQuery,
	useTick,
	useWorld,
} from "./react/index.ts";
export type { TimerEntry, TimerExpireCallback } from "./timer/index.ts";
export { Timer } from "./timer/index.ts";
