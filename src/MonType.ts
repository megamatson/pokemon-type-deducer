import Effectiveness from "./Effectiveness";
import TypeEffectiveness, { TypeEffectivenessClass } from './TypeEffectiveness';
import associate, {get} from './Associate';

type EffectivenessCollection = Set<MonType>;

export class MonType extends TypeEffectiveness {
	static readonly allowedEffectiveness = new Set([
		Effectiveness.Normal,
		Effectiveness.Immune,
		Effectiveness.Not,
		Effectiveness.Super,
		Effectiveness.Unknown
	]);

	private static nameMap: Map<string, MonType> = new Map();
	private static typeInstances: Set<MonType> = new Set();

	readonly name: string;

	private superEffectiveAgainst: EffectivenessCollection;
	private notVeryEffectiveAgainst: EffectivenessCollection;
	private noEffectAgainst: EffectivenessCollection;

	private constructor(name: string, ...aliases: string[]) {
		super();
		this.name = name;

		this.superEffectiveAgainst = new Set();
		this.notVeryEffectiveAgainst = new Set();
		this.noEffectAgainst = new Set();

		MonType.typeInstances.add(this);

		MonType.associateName(this.name, this);

		for (let alias of aliases)
			MonType.associateName(alias, this);
	}

	private static associateName(name: string, type: MonType) {
		associate(name, type, MonType.nameMap);
	}

	toString() {
		return this.name;
	}

	getEffectivenessAgainst(type: MonType, hasWonderGuard?: boolean): Effectiveness {
		if (this.superEffectiveAgainst.has(type))
			return Effectiveness.Super;
		
		if (this.notVeryEffectiveAgainst.has(type))
			return hasWonderGuard ? Effectiveness.Immune : Effectiveness.Not;

		if (this.noEffectAgainst.has(type))
			return Effectiveness.Immune;

		return hasWonderGuard ? Effectiveness.Immune : Effectiveness.Normal;
	}

	static isValidEffectiveness(e: Effectiveness) {
		return MonType.allowedEffectiveness.has(e);
	}

	/** @throws {Error} if name does not refer to a type */
	static get(name: string): MonType {
		const ret = get(name, MonType.nameMap);

		if (ret === undefined)
			throw new Error(`${name} is not a valid type`);

		return ret;
	}

	static getAll(): Set<MonType> {
		return this.typeInstances;
	}

	static normal = new MonType('Normal');
	static fire = new MonType('Fire');
	static water = new MonType('Water');
	static grass = new MonType('Grass');
	static electric = new MonType('Electric', 'Lightning', 'Elec', 'Electr');
	static ice = new MonType('Ice');
	static fighting = new MonType('Fighting', 'Fight');
	static poison = new MonType('Poison');
	static ground = new MonType('Ground');
	static flying = new MonType('Flying');
	static psychic = new MonType('Psychic');
	static bug = new MonType('Bug');
	static rock = new MonType('Rock');
	static ghost = new MonType('Ghost');
	static dragon = new MonType('Dragon');
	static dark = new MonType('Dark');
	static steel = new MonType('Steel');
	static fairy = new MonType('Fairy');

	static {
		// Super effective
		const superEffectiveMap = new Map([
			[MonType.fire, [MonType.grass, MonType.ice, MonType.bug, MonType.steel]],
			[MonType.water, [MonType.fire, MonType.ground, MonType.rock]],
			[MonType.grass, [MonType.water, MonType.ground, MonType.rock]],
			[MonType.electric, [MonType.water, MonType.flying]],
			[MonType.ice, [MonType.grass, MonType.ground, MonType.flying, MonType.dragon]],
			[MonType.fighting, [MonType.normal, MonType.ice, MonType.rock, MonType.dark, MonType.steel]],
			[MonType.poison, [MonType.grass, MonType.fairy]],
			[MonType.ground, [MonType.fire, MonType.electric, MonType.poison, MonType.rock, MonType.steel]],
			[MonType.flying, [MonType.grass, MonType.fighting, MonType.bug]],
			[MonType.psychic, [MonType.fighting, MonType.poison]],
			[MonType.bug, [MonType.grass, MonType.psychic, MonType.dark]],
			[MonType.rock, [MonType.fire, MonType.ice, MonType.flying, MonType.bug]],
			[MonType.ghost, [MonType.psychic, MonType.ghost]],
			[MonType.dragon, [MonType.dragon]],
			[MonType.dark, [MonType.psychic, MonType.ghost]],
			[MonType.steel, [MonType.ice, MonType.rock, MonType.fairy]],
			[MonType.fairy, [MonType.fighting, MonType.dragon, MonType.dark]],
		]);

		superEffectiveMap.forEach((types, type) => {
			type.superEffectiveAgainst = new Set(types);
		});

		// Not very effective
		const notVeryEffectiveMap = new Map([
			[MonType.normal, [MonType.rock, MonType.steel]],
			[MonType.fire, [MonType.fire, MonType.water, MonType.rock, MonType.dragon]],
			[MonType.water, [MonType.water, MonType.grass, MonType.dragon]],
			[MonType.grass, [MonType.fire, MonType.grass, MonType.poison, MonType.flying, MonType.bug, MonType.dragon, MonType.steel]],
			[MonType.electric, [MonType.grass, MonType.electric, MonType.dragon]],
			[MonType.ice, [MonType.fire, MonType.water, MonType.ice, MonType.steel]],
			[MonType.fighting, [MonType.poison, MonType.flying, MonType.psychic, MonType.bug, MonType.fairy]],
			[MonType.poison, [MonType.poison, MonType.ground, MonType.rock, MonType.ghost]],
			[MonType.ground, [MonType.grass, MonType.bug]],
			[MonType.flying, [MonType.electric, MonType.rock, MonType.steel]],
			[MonType.psychic, [MonType.psychic, MonType.steel]],
			[MonType.bug, [MonType.fire, MonType.fighting, MonType.poison, MonType.flying, MonType.ghost, MonType.steel, MonType.fairy]],
			[MonType.rock, [MonType.fighting, MonType.ground, MonType.steel]],
			[MonType.ghost, [MonType.dark]],
			[MonType.dragon, [MonType.steel]],
			[MonType.dark, [MonType.fighting, MonType.dark, MonType.fairy]],
			[MonType.steel, [MonType.fire, MonType.water, MonType.electric, MonType.steel]],
			[MonType.fairy, [MonType.fire, MonType.poison, MonType.steel]],
		]);

		notVeryEffectiveMap.forEach((types, type) => {
			type.notVeryEffectiveAgainst = new Set(types);
		});

		// No effect
		const noEffectMap = new Map([
			[MonType.normal, [MonType.ghost]],
			[MonType.electric, [MonType.ground]],
			[MonType.fighting, [MonType.ghost]],
			[MonType.poison, [MonType.steel]],
			[MonType.ground, [MonType.flying]],
			[MonType.psychic, [MonType.dark]],
			[MonType.ghost, [MonType.normal]],
			[MonType.dragon, [MonType.fairy]],
		]);

		noEffectMap.forEach((types, type) => {
			type.noEffectAgainst = new Set(types);
		});
	}
}

// Test that MonType can be used as a TypeEffectivenessClass
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const __test: TypeEffectivenessClass<MonType> = MonType;

export default MonType;