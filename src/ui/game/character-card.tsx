import type { EntityId } from "../../engine/index.ts";

export type CharacterData = {
	entityId: EntityId;
	firstName: string;
	lastName: string;
	gender: string;
	culture: string;
	age: number;
	birthDate: string;
	traits: string[];
};

type CharacterCardProps = {
	character: CharacterData;
};

export function CharacterCard({
	character,
}: CharacterCardProps): React.ReactElement {
	return (
		<div className="bg-card text-card-foreground rounded-xl border border-border p-6 w-full max-w-md">
			<div className="space-y-4">
				<div className="text-center">
					<h2 className="text-2xl font-bold">
						{character.firstName} {character.lastName}
					</h2>
					<p className="text-muted-foreground capitalize">
						{character.gender} · {character.culture}
					</p>
				</div>

				<div className="grid grid-cols-2 gap-4 text-sm">
					<div className="space-y-1">
						<p className="text-muted-foreground">Age</p>
						<p className="font-medium">{character.age} years old</p>
					</div>
					<div className="space-y-1">
						<p className="text-muted-foreground">Birthday</p>
						<p className="font-medium">{character.birthDate}</p>
					</div>
				</div>

				{character.traits.length > 0 && (
					<div className="space-y-2">
						<p className="text-muted-foreground text-sm">Traits</p>
						<div className="flex flex-wrap gap-2">
							{character.traits.map((trait) => (
								<span
									key={trait}
									className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm capitalize"
								>
									{trait}
								</span>
							))}
						</div>
					</div>
				)}

				<div className="pt-2 border-t border-border">
					<p className="text-xs text-muted-foreground">
						Entity ID: {character.entityId}
					</p>
				</div>
			</div>
		</div>
	);
}
