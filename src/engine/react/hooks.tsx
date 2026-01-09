import {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
	useSyncExternalStore,
} from "react";
import {
	type ComponentClass,
	type ComponentInstance,
	type EntityId,
	GameLoop,
	Persistence,
	Query,
	type TimerEntry,
	World,
} from "../index.ts";
import type { TickContext } from "../loop/index.ts";

type EngineContextValue = {
	initialized: boolean;
	tickCount: number;
};

const EngineContext = createContext<EngineContextValue | null>(null);

export function useEngineContext(): EngineContextValue {
	const context = useContext(EngineContext);
	if (!context) {
		throw new Error("useEngineContext must be used within an EngineProvider");
	}
	return context;
}

export type EngineProviderProps = {
	children: React.ReactNode;
	onInitialize?: () => void | Promise<void>;
};

export function EngineProvider({
	children,
	onInitialize,
}: EngineProviderProps): React.ReactElement {
	const [initialized, setInitialized] = useState(false);
	const [tickCount, setTickCount] = useState(0);

	useEffect(() => {
		const init = async () => {
			if (onInitialize) {
				await onInitialize();
			}
			setInitialized(true);
		};

		init();
	}, [onInitialize]);

	useEffect(() => {
		const unsubscribe = GameLoop.onAfterTick((ctx) => {
			setTickCount(ctx.tick);
		});

		return unsubscribe;
	}, []);

	return (
		<EngineContext.Provider value={{ initialized, tickCount }}>
			{children}
		</EngineContext.Provider>
	);
}

type QueryResult = Array<[EntityId, ...ComponentInstance[]]>;

type QuerySubscription = {
	subscribe: (callback: () => void) => () => void;
	getSnapshot: () => QueryResult;
};

function createQuerySubscription(
	...componentClasses: ComponentClass[]
): QuerySubscription {
	let cachedResult: QueryResult = [];
	let lastTickCount = -1;
	const listeners = new Set<() => void>();

	const query = Query.create(...componentClasses);

	const subscribe = (callback: () => void) => {
		listeners.add(callback);

		const unsubscribeTick = GameLoop.onAfterTick(() => {
			cachedResult = [];
			lastTickCount = -1;
			for (const listener of listeners) {
				listener();
			}
		});

		return () => {
			listeners.delete(callback);
			if (listeners.size === 0) {
				unsubscribeTick();
			}
		};
	};

	const getSnapshot = (): QueryResult => {
		const currentTick = GameLoop.getTickCount();
		if (cachedResult.length === 0 || lastTickCount !== currentTick) {
			cachedResult = query.toArray() as QueryResult;
			lastTickCount = currentTick;
		}
		return cachedResult;
	};

	return { subscribe, getSnapshot };
}

export function useQuery<C extends ComponentClass[]>(
	...componentClasses: C
): QueryResult {
	const subscriptionRef = useRef<QuerySubscription | null>(null);

	if (!subscriptionRef.current) {
		subscriptionRef.current = createQuerySubscription(...componentClasses);
	}

	const subscription = subscriptionRef.current;

	return useSyncExternalStore(subscription.subscribe, subscription.getSnapshot);
}

export function useEntity(entityId: EntityId): {
	isAlive: boolean;
	getComponent: <T extends ComponentInstance>(
		componentClass: ComponentClass<T>,
	) => T | undefined;
	hasComponent: (componentClass: ComponentClass) => boolean;
	hasTag: (tag: string) => boolean;
	hasAllTags: (...tags: string[]) => boolean;
	hasAnyTag: (...tags: string[]) => boolean;
	getTags: () => string[];
	getTimer: (key: string) => number | undefined;
	hasTimer: (key: string) => boolean;
	getTimers: () => TimerEntry[];
} {
	const { tickCount } = useEngineContext();

	const isAlive = World.isAlive(entityId);

	const getComponent = <T extends ComponentInstance>(
		componentClass: ComponentClass<T>,
	): T | undefined => {
		return World.getComponent(entityId, componentClass);
	};

	const hasComponent = (componentClass: ComponentClass): boolean => {
		return World.hasComponent(entityId, componentClass);
	};

	const hasTag = (tag: string): boolean => {
		return World.hasTag(entityId, tag);
	};

	const hasAllTags = (...tags: string[]): boolean => {
		return World.hasAllTags(entityId, ...tags);
	};

	const hasAnyTag = (...tags: string[]): boolean => {
		return World.hasAnyTag(entityId, ...tags);
	};

	const getTags = (): string[] => {
		return World.getTags(entityId);
	};

	const getTimer = (key: string): number | undefined => {
		return World.getTimer(entityId, key);
	};

	const hasTimer = (key: string): boolean => {
		return World.hasTimer(entityId, key);
	};

	const getTimers = (): TimerEntry[] => {
		return World.getTimers(entityId);
	};

	// tickCount ensures component re-renders on each game tick
	void tickCount;

	return {
		isAlive,
		getComponent,
		hasComponent,
		hasTag,
		hasAllTags,
		hasAnyTag,
		getTags,
		getTimer,
		hasTimer,
		getTimers,
	};
}

export function useComponent<T extends ComponentInstance>(
	entityId: EntityId,
	componentClass: ComponentClass<T>,
): T | undefined {
	const { tickCount: _tick } = useEngineContext();
	return World.getComponent(entityId, componentClass);
}

export function useWorld(): {
	createEntity: () => EntityId;
	destroyEntity: (entityId: EntityId) => boolean;
	addComponent: <T extends ComponentInstance>(
		entityId: EntityId,
		componentClass: ComponentClass<T>,
		instance?: T,
	) => T;
	removeComponent: <T extends ComponentInstance>(
		entityId: EntityId,
		componentClass: ComponentClass<T>,
	) => boolean;
	getComponent: <T extends ComponentInstance>(
		entityId: EntityId,
		componentClass: ComponentClass<T>,
	) => T | undefined;
	hasComponent: (entityId: EntityId, componentClass: ComponentClass) => boolean;
	entityCount: () => number;
	addTag: (entityId: EntityId, ...tags: string[]) => void;
	removeTag: (entityId: EntityId, ...tags: string[]) => void;
	hasTag: (entityId: EntityId, tag: string) => boolean;
	hasAllTags: (entityId: EntityId, ...tags: string[]) => boolean;
	hasAnyTag: (entityId: EntityId, ...tags: string[]) => boolean;
	getTags: (entityId: EntityId) => string[];
	setTimer: (entityId: EntityId, key: string, ticks: number) => void;
	getTimer: (entityId: EntityId, key: string) => number | undefined;
	hasTimer: (entityId: EntityId, key: string) => boolean;
	removeTimer: (entityId: EntityId, key: string) => boolean;
	extendTimer: (
		entityId: EntityId,
		key: string,
		additionalTicks: number,
	) => void;
	getTimers: (entityId: EntityId) => TimerEntry[];
} {
	return {
		createEntity: World.createEntity,
		destroyEntity: World.destroyEntity,
		addComponent: World.addComponent,
		removeComponent: World.removeComponent,
		getComponent: World.getComponent,
		hasComponent: World.hasComponent,
		entityCount: World.entityCount,
		addTag: World.addTag,
		removeTag: World.removeTag,
		hasTag: World.hasTag,
		hasAllTags: World.hasAllTags,
		hasAnyTag: World.hasAnyTag,
		getTags: World.getTags,
		setTimer: World.setTimer,
		getTimer: World.getTimer,
		hasTimer: World.hasTimer,
		removeTimer: World.removeTimer,
		extendTimer: World.extendTimer,
		getTimers: World.getTimers,
	};
}

export function useGameLoop(): {
	tick: () => TickContext;
	run: (...systems: Parameters<typeof GameLoop.run>) => TickContext;
	runPhase: (phase: string) => TickContext;
	tickCount: number;
} {
	const { tickCount } = useEngineContext();

	return {
		tick: GameLoop.tick,
		run: GameLoop.run,
		runPhase: GameLoop.runPhase,
		tickCount,
	};
}

export function usePersistence(): {
	save: () => Promise<void>;
	load: () => Promise<boolean>;
	clear: () => Promise<void>;
	setMeta: <T>(key: string, value: T) => void;
	getMeta: <T>(key: string) => T | undefined;
	isInitialized: boolean;
} {
	const [isInitialized] = useState(() => Persistence.isInitialized());

	return {
		save: Persistence.save,
		load: Persistence.load,
		clear: Persistence.clear,
		setMeta: Persistence.setMeta,
		getMeta: Persistence.getMeta,
		isInitialized,
	};
}

export function useTick(callback: (context: TickContext) => void): void {
	const callbackRef = useRef(callback);
	callbackRef.current = callback;

	useEffect(() => {
		const unsubscribe = GameLoop.onAfterTick((ctx) => {
			callbackRef.current(ctx);
		});

		return unsubscribe;
	}, []);
}

export function useComponentValue<
	T extends ComponentInstance,
	K extends keyof T,
>(
	entityId: EntityId,
	componentClass: ComponentClass<T>,
	key: K,
): T[K] | undefined {
	const component = useComponent(entityId, componentClass);
	return component?.[key];
}
