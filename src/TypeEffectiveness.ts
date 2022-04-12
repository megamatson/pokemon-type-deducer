import getCssClass from "./CssClass";
import { Effectiveness } from "./Effectiveness";
import MonType from "./MonType";

export type TypeEffectivenessClass<T extends TypeEffectiveness> = {
	allowedEffectiveness: Set<Effectiveness>;
	get(name: string): T;
	getAll(): Set<T>;
	isValidEffectiveness(e: Effectiveness): boolean;
} & Function

abstract class TypeEffectiveness {
	static readonly allowedEffectiveness: Set<Effectiveness>;
	abstract readonly name: string;
	abstract getEffectivenessAgainst(
		type: MonType,
		hasWonderGuard?: boolean
	): Effectiveness;
	abstract toString(): string;

	static get(name: string): TypeEffectiveness {
		throw new Error("Unimplemented");
	}

	static getAll(): Set<TypeEffectiveness> {
		throw new Error("Unimplemented");
	}

	static isValidEffectiveness(e: Effectiveness): boolean {
		throw new Error("Unimplemented");
	}

	getCssClass() {
		return getCssClass(this.name);
	}
}

export function testIfIsTypeEffectivenessClass<T extends TypeEffectiveness>(
	t: TypeEffectivenessClass<T>
) {
	// left intentionally blank
}

testIfIsTypeEffectivenessClass(TypeEffectiveness);


export default TypeEffectiveness;