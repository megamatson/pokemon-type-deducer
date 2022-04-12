import associate, { get } from "./Associate";
import getCssClass from "./CssClass";

export class Effectiveness {
	readonly symbol: string;
	readonly value: number;
	readonly name: string;

	private static nameMap: Map<string, Effectiveness> = new Map();
	private static numberMap: Map<number, Effectiveness> = new Map();

	private constructor(name: string, value: number, symbol: string) {
		this.name = name;
		this.value = value;
		this.symbol = symbol;

		associate(name, this, Effectiveness.nameMap);
		associate(symbol, this, Effectiveness.nameMap);
		associate(value.toString(), this, Effectiveness.nameMap);

		if (Effectiveness.numberMap.has(value))
			throw new Error(
				'value of ' + value + ' already found on ' +
					Effectiveness.numberMap.get(value)
			);

		Effectiveness.numberMap.set(value, this);
	}

	static get(nameOrValue: string|number) {
		if (typeof nameOrValue === 'number') {
			const value = nameOrValue;
			const effectiveness = Effectiveness.numberMap.get(value);

			if (effectiveness === undefined) {
				if (value === 0)
					return Effectiveness.Immune;

				if (0 < value && value < 1)
					return Effectiveness.Not;

				if (value === 1)
					return Effectiveness.Normal;

				if (value > 1)
					return Effectiveness.Super;

				throw new Error(`No effectiveness associated with ${value}`);
			}

			return effectiveness;
		} else {
			const effectiveness = get(nameOrValue, this.nameMap);

			if (effectiveness === undefined)
				throw new Error(`No effectiveness associated with "${nameOrValue}"`);

			return effectiveness;
		}
	}

	getCssClass() {
		return getCssClass(this.name);
	}

	static readonly Normal = new Effectiveness('Normally effective', 1, '1');
	static readonly Super = new Effectiveness('Super effective', 2, '+');
	static readonly Not = new Effectiveness('Not very effective', 0.5, '-');
	static readonly Immune = new Effectiveness('No effect', 0, '0');

	static readonly Unknown = new Effectiveness(
		'Unknown effectiveness', NaN, '?'
	);
}

export default Effectiveness;