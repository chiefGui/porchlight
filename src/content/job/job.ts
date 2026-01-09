import type { DayPeriod } from "../../game/calendar/index.ts";

export type Job = {
	id: string;
	name: string;
	description?: string;
	hourlyPay: number;
	staminaCost: number;
	hoursPerShift: number;
	schedule: DayPeriod[];
	requirements?: string[];
};

export class JobRegistry {
	private static byId = new Map<string, Job>();

	static register(job: Job): void {
		JobRegistry.byId.set(job.id, job);
	}

	static get(id: string): Job | undefined {
		return JobRegistry.byId.get(id);
	}

	static has(id: string): boolean {
		return JobRegistry.byId.has(id);
	}

	static all(): IterableIterator<Job> {
		return JobRegistry.byId.values();
	}

	static ids(): IterableIterator<string> {
		return JobRegistry.byId.keys();
	}

	static count(): number {
		return JobRegistry.byId.size;
	}

	static reset(): void {
		JobRegistry.byId.clear();
	}
}

export function defineJob(job: Job): Job {
	JobRegistry.register(job);
	return job;
}
