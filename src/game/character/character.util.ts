import type { EntityId } from "../../engine/index.ts";
import { World } from "../../engine/index.ts";
import { GameCalendar, type GameDate } from "../calendar/index.ts";
import { CharacterIdentity, type Gender } from "./identity.ts";

export class CharacterUtil {
	static get(entity: EntityId): CharacterIdentity | undefined {
		return World.getComponent(entity, CharacterIdentity);
	}

	static getFullName(entity: EntityId): string | null {
		const identity = CharacterUtil.get(entity);
		if (!identity) return null;
		return `${identity.firstName} ${identity.lastName}`;
	}

	static getAge(entity: EntityId, currentDate: GameDate): number | null {
		const identity = CharacterUtil.get(entity);
		if (!identity) return null;
		return GameCalendar.age({ birthDate: identity.birthDate, currentDate });
	}

	static getDisplayName(entity: EntityId): string | null {
		const identity = CharacterUtil.get(entity);
		if (!identity) return null;
		return identity.firstName;
	}

	static getGender(entity: EntityId): Gender | null {
		return CharacterUtil.get(entity)?.gender ?? null;
	}

	static getCulture(entity: EntityId): string | null {
		return CharacterUtil.get(entity)?.culture ?? null;
	}

	static getBirthDate(entity: EntityId): GameDate | null {
		return CharacterUtil.get(entity)?.birthDate ?? null;
	}
}
