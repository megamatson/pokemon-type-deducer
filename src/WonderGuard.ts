import Effectiveness from "./Effectiveness";

function keep<T>(value: T): [T, T] {
	return [value, value];
}

function immune<T>(value: T): [T, Effectiveness] {
	return [value, Effectiveness.Immune];
}

const wonderGuardEffectivenesses = new Map([
	keep(Effectiveness.Immune),
	keep(Effectiveness.Super),
	keep(Effectiveness.Unknown),
	immune(Effectiveness.Normal),
	immune(Effectiveness.Not),
]);

export function isWonderGuardEffectiveness(
	effectiveness: Effectiveness
): boolean {
	return wonderGuardEffectivenesses.get(effectiveness) === effectiveness;
}

export function toWonderGuardEffectiveness(
	effectiveness: Effectiveness
): Effectiveness {
	return wonderGuardEffectivenesses.get(effectiveness) ?? Effectiveness.Unknown;
}