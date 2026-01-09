export type WeightedOption<T> = {
	value: T;
	weight: number;
};

export class Random {
	private static currentSeed = Date.now();
	private static state = Random.currentSeed;

	static seed(value: number): void {
		Random.currentSeed = value >>> 0;
		Random.state = Random.currentSeed;
	}

	static getSeed(): number {
		return Random.currentSeed;
	}

	static getState(): number {
		return Random.state;
	}

	static setState(value: number): void {
		Random.state = value >>> 0;
	}

	private static next(): number {
		// Mulberry32 PRNG - fast, simple, good distribution
		Random.state += 0x6d2b79f5;
		let t = Random.state;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	}

	static float(min = 0, max = 1): number {
		return min + Random.next() * (max - min);
	}

	static int(min: number, max: number): number {
		const minInt = Math.ceil(min);
		const maxInt = Math.floor(max);
		return Math.floor(Random.next() * (maxInt - minInt + 1)) + minInt;
	}

	static bool(probability = 0.5): boolean {
		return Random.next() < probability;
	}

	static pick<T>(array: readonly T[]): T | undefined {
		if (array.length === 0) {
			return undefined;
		}
		return array[Random.int(0, array.length - 1)];
	}

	static pickMany<T>(array: readonly T[], count: number): T[] {
		if (count >= array.length) {
			return Random.shuffled(array);
		}

		const copy = [...array];
		const result: T[] = [];

		for (let i = 0; i < count; i++) {
			const index = Random.int(0, copy.length - 1);
			result.push(copy[index]);
			copy.splice(index, 1);
		}

		return result;
	}

	static shuffle<T>(array: T[]): T[] {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Random.int(0, i);
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	static shuffled<T>(array: readonly T[]): T[] {
		return Random.shuffle([...array]);
	}

	static weighted<T>(options: readonly WeightedOption<T>[]): T | undefined {
		if (options.length === 0) {
			return undefined;
		}

		const totalWeight = options.reduce((sum, opt) => sum + opt.weight, 0);

		if (totalWeight <= 0) {
			return undefined;
		}

		let roll = Random.float(0, totalWeight);

		for (const option of options) {
			roll -= option.weight;
			if (roll <= 0) {
				return option.value;
			}
		}

		return options[options.length - 1].value;
	}

	static dice(sides: number): number;
	static dice(count: number, sides: number): number;
	static dice(countOrSides: number, sides?: number): number {
		if (sides === undefined) {
			return Random.int(1, countOrSides);
		}

		let total = 0;
		for (let i = 0; i < countOrSides; i++) {
			total += Random.int(1, sides);
		}
		return total;
	}

	static diceRolls(count: number, sides: number): number[] {
		const rolls: number[] = [];
		for (let i = 0; i < count; i++) {
			rolls.push(Random.int(1, sides));
		}
		return rolls;
	}

	static chance(percent: number): boolean {
		return Random.float(0, 100) < percent;
	}

	static sign(): -1 | 1 {
		return Random.bool() ? 1 : -1;
	}

	static angle(): number {
		return Random.float(0, Math.PI * 2);
	}

	static gaussian(mean = 0, standardDeviation = 1): number {
		// Box-Muller transform
		const u1 = Random.next();
		const u2 = Random.next();
		const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
		return mean + z * standardDeviation;
	}

	static uuid(): string {
		const hex = () => Random.int(0, 15).toString(16);
		const segment = (length: number) => Array.from({ length }, hex).join("");

		return [
			segment(8),
			segment(4),
			`4${segment(3)}`,
			`${(8 + Random.int(0, 3)).toString(16)}${segment(3)}`,
			segment(12),
		].join("-");
	}

	static reset(): void {
		Random.currentSeed = Date.now();
		Random.state = Random.currentSeed;
	}
}
