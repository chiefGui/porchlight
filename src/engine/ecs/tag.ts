import { Entity, type EntityId } from "./entity.ts";

export type TagMask = bigint;

export type TagDescriptor = {
	all?: string[];
	any?: string[];
	none?: string[];
};

export class Tag {
	private static nextBit = 0;
	private static registry = new Map<string, number>();
	private static reverseRegistry = new Map<number, string>();
	private static entityMasks = new Map<EntityId, TagMask>();
	private static tagEntities = new Map<string, Set<EntityId>>();
	private static dirty = false;

	static register(tag: string): number {
		if (Tag.registry.has(tag)) {
			return Tag.registry.get(tag) as number;
		}

		const bit = Tag.nextBit++;
		Tag.registry.set(tag, bit);
		Tag.reverseRegistry.set(bit, tag);
		Tag.tagEntities.set(tag, new Set());

		return bit;
	}

	static getBit(tag: string): number {
		const bit = Tag.registry.get(tag);
		if (bit === undefined) {
			return Tag.register(tag);
		}
		return bit;
	}

	static getMask(tags: string[]): TagMask {
		let mask = 0n;
		for (const tag of tags) {
			mask |= 1n << BigInt(Tag.getBit(tag));
		}
		return mask;
	}

	static add(entityId: EntityId, ...tags: string[]): void {
		if (!Entity.isAlive(entityId)) {
			return;
		}

		const currentMask = Tag.entityMasks.get(entityId) ?? 0n;
		let newMask = currentMask;

		for (const tag of tags) {
			const bit = Tag.getBit(tag);
			newMask |= 1n << BigInt(bit);

			let entities = Tag.tagEntities.get(tag);
			if (!entities) {
				entities = new Set();
				Tag.tagEntities.set(tag, entities);
			}
			entities.add(entityId);
		}

		Tag.entityMasks.set(entityId, newMask);
		Tag.dirty = true;
	}

	static remove(entityId: EntityId, ...tags: string[]): void {
		const currentMask = Tag.entityMasks.get(entityId);
		if (currentMask === undefined) {
			return;
		}

		let newMask = currentMask;

		for (const tag of tags) {
			const bit = Tag.registry.get(tag);
			if (bit !== undefined) {
				newMask &= ~(1n << BigInt(bit));
				Tag.tagEntities.get(tag)?.delete(entityId);
			}
		}

		if (newMask === 0n) {
			Tag.entityMasks.delete(entityId);
		} else {
			Tag.entityMasks.set(entityId, newMask);
		}

		Tag.dirty = true;
	}

	static has(entityId: EntityId, tag: string): boolean {
		const bit = Tag.registry.get(tag);
		if (bit === undefined) {
			return false;
		}

		const mask = Tag.entityMasks.get(entityId) ?? 0n;
		return (mask & (1n << BigInt(bit))) !== 0n;
	}

	static hasAll(entityId: EntityId, ...tags: string[]): boolean {
		const entityMask = Tag.entityMasks.get(entityId) ?? 0n;
		const requiredMask = Tag.getMask(tags);
		return (entityMask & requiredMask) === requiredMask;
	}

	static hasAny(entityId: EntityId, ...tags: string[]): boolean {
		const entityMask = Tag.entityMasks.get(entityId) ?? 0n;
		const checkMask = Tag.getMask(tags);
		return (entityMask & checkMask) !== 0n;
	}

	static all(entityId: EntityId): string[] {
		const mask = Tag.entityMasks.get(entityId) ?? 0n;
		if (mask === 0n) {
			return [];
		}

		const tags: string[] = [];
		for (const [tag, bit] of Tag.registry) {
			if ((mask & (1n << BigInt(bit))) !== 0n) {
				tags.push(tag);
			}
		}
		return tags;
	}

	static getEntityMask(entityId: EntityId): TagMask {
		return Tag.entityMasks.get(entityId) ?? 0n;
	}

	static getEntities(tag: string): ReadonlySet<EntityId> {
		return Tag.tagEntities.get(tag) ?? new Set();
	}

	static matchesDescriptor(
		entityId: EntityId,
		descriptor: TagDescriptor,
	): boolean {
		const entityMask = Tag.entityMasks.get(entityId) ?? 0n;

		if (descriptor.all && descriptor.all.length > 0) {
			const allMask = Tag.getMask(descriptor.all);
			if ((entityMask & allMask) !== allMask) {
				return false;
			}
		}

		if (descriptor.any && descriptor.any.length > 0) {
			const anyMask = Tag.getMask(descriptor.any);
			if ((entityMask & anyMask) === 0n) {
				return false;
			}
		}

		if (descriptor.none && descriptor.none.length > 0) {
			const noneMask = Tag.getMask(descriptor.none);
			if ((entityMask & noneMask) !== 0n) {
				return false;
			}
		}

		return true;
	}

	static removeAllFromEntity(entityId: EntityId): void {
		const mask = Tag.entityMasks.get(entityId);
		if (mask === undefined) {
			return;
		}

		for (const [tag, bit] of Tag.registry) {
			if ((mask & (1n << BigInt(bit))) !== 0n) {
				Tag.tagEntities.get(tag)?.delete(entityId);
			}
		}

		Tag.entityMasks.delete(entityId);
		Tag.dirty = true;
	}

	static isDirty(): boolean {
		return Tag.dirty;
	}

	static clearDirty(): void {
		Tag.dirty = false;
	}

	static getRegisteredTags(): string[] {
		return [...Tag.registry.keys()];
	}

	static reset(): void {
		Tag.nextBit = 0;
		Tag.registry.clear();
		Tag.reverseRegistry.clear();
		Tag.entityMasks.clear();
		Tag.tagEntities.clear();
		Tag.dirty = false;
	}
}
