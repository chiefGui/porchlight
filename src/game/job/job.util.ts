import type { EntityId } from "../../engine/index.ts";
import { World } from "../../engine/index.ts";
import { JobRegistry, type Job } from "../../content/job/index.ts";
import { CharacterJob } from "./job.component.ts";

export class JobUtil {
	static getId(entity: EntityId): string | null {
		return World.getComponent(entity, CharacterJob)?.id ?? null;
	}

	static get(entity: EntityId): Job | undefined {
		const id = JobUtil.getId(entity);
		if (!id) return undefined;
		return JobRegistry.get(id);
	}

	static isEmployed(entity: EntityId): boolean {
		return JobUtil.getId(entity) !== null;
	}

	static hire(entity: EntityId, jobId: string): boolean {
		const job = World.getComponent(entity, CharacterJob);
		if (!job) return false;
		if (!JobRegistry.has(jobId)) return false;
		job.id = jobId;
		return true;
	}

	static quit(entity: EntityId): void {
		const job = World.getComponent(entity, CharacterJob);
		if (!job) return;
		job.id = null;
	}
}
