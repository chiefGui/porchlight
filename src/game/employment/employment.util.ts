import type { EntityId } from "../../engine/index.ts";
import { World } from "../../engine/index.ts";
import { JobRegistry, type Job } from "../../content/job/index.ts";
import { Employment } from "./employment.component.ts";

export class EmploymentUtil {
	static getJobId(entity: EntityId): string | null {
		return World.getComponent(entity, Employment)?.jobId ?? null;
	}

	static getJob(entity: EntityId): Job | undefined {
		const jobId = EmploymentUtil.getJobId(entity);
		if (!jobId) return undefined;
		return JobRegistry.get(jobId);
	}

	static isEmployed(entity: EntityId): boolean {
		return EmploymentUtil.getJobId(entity) !== null;
	}

	static hire(entity: EntityId, jobId: string): boolean {
		const employment = World.getComponent(entity, Employment);
		if (!employment) return false;

		if (!JobRegistry.has(jobId)) return false;

		employment.jobId = jobId;
		return true;
	}

	static quit(entity: EntityId): void {
		const employment = World.getComponent(entity, Employment);
		if (!employment) return;
		employment.jobId = null;
	}
}
