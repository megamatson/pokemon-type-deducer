import Effectiveness from "./Effectiveness";
import MonType from "./MonType";
import TypeEffectiveness from "./TypeEffectiveness";
import { toWonderGuardEffectiveness } from "./WonderGuard";

class FullType {
	readonly type1: MonType;
	readonly type2: MonType | null;

	constructor(type1: MonType, type2?: MonType|null) {
		this.type1 = type1;
		this.type2 = type2 !== type1 && type2 ? type2 : null;
	}

	has(type: Readonly<MonType | FullType>): boolean {
		if ('type1' in type)
			return this.has(type.type1) && (type.type2 ? this.has(type.type2) : true);
		else
			return this.type1 === type || this.type2 === type;
	}

	toArray(): [MonType] | [MonType, MonType] {
		return this.type2 ? [this.type1, this.type2] : [this.type1];
	}

	static *getAll() {
		const typeIterator1 = MonType.getAll().keys();
		for (
			let type1Iteration = typeIterator1.next();
			!type1Iteration.done;
			type1Iteration = typeIterator1.next()
		) {
			const type1 = type1Iteration.value;
			yield new FullType(type1);

			const typeIterator2 = MonType.getAll().keys();
			for (
				let type2Iteration = typeIterator2.next();
				!type2Iteration.done;
				type2Iteration = typeIterator2.next()
			) {
				const type2 = type2Iteration.value;
				if (type1 === type2)
					continue;

				yield new FullType(type1, type2);
			}
		}
	}

	static *getAllFunctionallyUnique() {
		const typeIterator = this.getAll();
		
		for (
			let typeIteration = typeIterator.next();
			!typeIteration.done;
			typeIteration = typeIterator.next()
		) {
			const type = typeIteration.value;

			if (type.type2 === null) {
				yield type;
				continue;
			}

			if (type.type2 <= type.type1)
				continue;

			yield type;
		}
	}

	toString() {
		return this.type2 ?
			`${this.type1.name}, ${this.type2.name}` :
			this.type1.name
		;
	}

	getEffectivenessOnThis(
		te: Readonly<TypeEffectiveness>,
		hasWonderGuard?: boolean
	): Effectiveness {
		const ret = Effectiveness.get(
			te.getEffectivenessAgainst(this.type1).value *
			(this.type2 ? te.getEffectivenessAgainst(this.type2).value : 1)
		);

		return hasWonderGuard && te instanceof MonType ?
			toWonderGuardEffectiveness(ret) :
			ret
		;
	}
}

export default FullType;