import {
	component,
	GameLoop,
	type Query,
	query,
	system,
	World,
} from "./engine/index.ts";

@component()
class Position {
	x = 0;
	y = 0;
}

@component()
class Health {
	current = 100;
	max = 100;
}

@system({ phase: "combat" })
class DamageSystem {
	constructor(@query(Health) private readonly targets: Query<[Health]>) {}

	tick(): void {
		for (const [entityId, health] of this.targets) {
			console.log(
				`[DamageSystem] Entity ${entityId} has ${health.current}/${health.max} HP`,
			);
		}
	}
}

@system({ phase: "movement" })
class MovementSystem {
	constructor(@query(Position) private readonly movers: Query<[Position]>) {}

	tick(): void {
		for (const [entityId, position] of this.movers) {
			console.log(
				`[MovementSystem] Entity ${entityId} at (${position.x}, ${position.y})`,
			);
		}
	}
}

const player = World.createEntity();
World.addComponent(player, Position, { x: 10, y: 20 });
World.addComponent(player, Health, { current: 80, max: 100 });

const enemy = World.createEntity();
World.addComponent(enemy, Position, { x: 5, y: 5 });
World.addComponent(enemy, Health, { current: 50, max: 50 });

console.log("=== Porchlight Engine Demo ===");
console.log(`Created ${World.entityCount()} entities`);
console.log("");

console.log("--- Running Movement Phase ---");
GameLoop.runPhase("movement");
console.log("");

console.log("--- Running Combat Phase ---");
GameLoop.runPhase("combat");
console.log("");

console.log("--- Running Specific Systems ---");
GameLoop.run(MovementSystem, DamageSystem);
console.log("");

console.log(`Total ticks: ${GameLoop.getTickCount()}`);
