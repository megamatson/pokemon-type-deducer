import Effectiveness from "./Effectiveness";
import MonType from "./MonType";
import TypeEffectiveness, { TypeEffectivenessClass } from "./TypeEffectiveness";
import associate, { get } from "./Associate";

class Effect extends TypeEffectiveness {
	static readonly allowedEffectiveness = new Set([Effectiveness.Normal, Effectiveness.Immune, Effectiveness.Unknown]);
	private static nameMap: Map<string, Effect> = new Map();
	private static effectInstances: Set<Effect> = new Set();

	readonly name: string;

	readonly immuneTypes: Set<MonType>;

	private constructor(name: string, extraInfo: { aliases?: string[] | string, immuneTypes?: Set<MonType> | MonType } = {}) {
		super();
		this.name = name;
		
		if (extraInfo.immuneTypes) {
			if (extraInfo.immuneTypes instanceof Set)
				this.immuneTypes = extraInfo.immuneTypes;
			else
				this.immuneTypes = new Set([extraInfo.immuneTypes]);
		} else
			this.immuneTypes = new Set();

		Effect.effectInstances.add(this);
		Effect.associateName(name, this);

		if (extraInfo.aliases === undefined)
			return;

		if (typeof extraInfo.aliases === 'string')
			Effect.associateName(extraInfo.aliases, this);
		else
			for (const alias of extraInfo.aliases)
				Effect.associateName(alias, this);
	}

	private static associateName(name: string, effect: Effect) {
		associate(name, effect, Effect.nameMap);
	}

	getEffectivenessAgainst(type: MonType): Effectiveness {
		return this.immuneTypes.has(type) ? Effectiveness.Immune : Effectiveness.Normal;
	}

	static get(name: string): Effect {
		const ret = get(name, this.nameMap);

		if (ret === undefined)
			throw new Error(`${name} is not a valid type`);

		return ret;
	}

	static isValidEffectiveness(e: Effectiveness): boolean {
		return this.allowedEffectiveness.has(e);
	}

	static getAll(): Set<Effect> {
		return Effect.effectInstances;
	}

	toString(): string {
		return this.name;
	}

	private static immuneToPoisonVariantsTypes = new Set([MonType.poison, MonType.steel]);

	static readonly hail = new Effect('Hail', { immuneTypes: MonType.ice });
	static readonly leechSeed = new Effect('Leech Seed', { immuneTypes: MonType.grass });
	static readonly poison = new Effect('Poison', { immuneTypes: this.immuneToPoisonVariantsTypes });
	static readonly sandstorm = new Effect('Sandstorm', { immuneTypes: new Set([MonType.ground, MonType.rock, MonType.steel])});
	static readonly toxic = new Effect('Toxic', { immuneTypes: this.immuneToPoisonVariantsTypes });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const __test: TypeEffectivenessClass<Effect> = Effect;

export default Effect;