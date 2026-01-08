import {
	ComponentDecorator,
	GameLoop,
	type Query,
	QueryDecorator,
	SystemDecorator,
	World,
} from "./engine/index.ts";

@ComponentDecorator()
class Position {
	x = 0;
	y = 0;
}

@ComponentDecorator()
class Health {
	current = 100;
	max = 100;
}

@SystemDecorator({ phase: "combat" })
class DamageSystem {
	constructor(
		@QueryDecorator(Health) private readonly targets: Query<[Health]>,
	) {}

	tick(): void {
		for (const [entityId, health] of this.targets) {
			console.log(
				`[DamageSystem] Entity ${entityId} has ${health.current}/${health.max} HP`,
			);
		}
	}
}

@SystemDecorator({ phase: "movement" })
class MovementSystem {
	constructor(
		@QueryDecorator(Position) private readonly movers: Query<[Position]>,
	) {}

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
