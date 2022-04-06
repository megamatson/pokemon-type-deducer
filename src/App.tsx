import EffectivenessInput, { Props as TypeEffectivenessInputProps } from './EffectivenessInput';
import EffectivenessOutput, { Props as EffectivenessOutputProps } from './EffectivenessOutput';
import './App.css';
import MonType from './MonType';
import React from 'react';
import Effectiveness from './Effectiveness';
import Effect from './Effect';
import TypeEffectiveness, { TypeEffectivenessClass } from './TypeEffectiveness';
import FullType from './FullType';
import { all, filter, first, map } from './Iter';
import { isWonderGuardEffectiveness } from './WonderGuard';

export interface Props {}

interface TypeEffectivenessEntry<T extends TypeEffectiveness> {
	effectivenesses: Map<T, Effectiveness>;
	validEffectivenesses: Map<T, Set<Effectiveness>>;
	deducedEffectivenesses: Map<T, Effectiveness>;
}

export interface State {
	type: TypeEffectivenessEntry<MonType>;
	effect: TypeEffectivenessEntry<Effect>;
	potentialTypes: FullType[];
	commonTypes: EffectivenessOutputProps['commonTypes'];

	wonderGuard: {
		has: boolean,
		canHave: boolean,
	};
};

const allTypes = Array.from(FullType.getAllFunctionallyUnique());

function canHaveWonderGuard(
	typeMap: Map<MonType, Effectiveness>,
): boolean {
	return all(typeMap.values(), isWonderGuardEffectiveness);
}

function getDeducedTypeEffectivenesses<T extends TypeEffectiveness>(
	typeEffectivenesses: Map<T, Set<Effectiveness>>,
	currentEffectivenesses: Map<T, Effectiveness>
): Map<T, Effectiveness> {
	return new Map(
		map(
			filter(
				typeEffectivenesses.entries(),
				([te, effectivenesses]) =>
					effectivenesses.size === 1 &&
					(currentEffectivenesses.get(te) ?? Effectiveness.Unknown) === Effectiveness.Unknown
			),
			([te, effectiveness]) => [te, first(effectiveness.values())]
		)
	);
}

function getMatchingTypes(
	types: FullType[],
	te: Map<TypeEffectiveness, Effectiveness>,
	hasWonderGuard?: boolean
): FullType[] {
	if (types.length === 0)
		return [];

	for (let [type, effectiveness] of te.entries()) {
		if (effectiveness === Effectiveness.Unknown)
			continue;

		types = types.filter(fullType =>
			fullType.getEffectivenessOnThis(type, hasWonderGuard) === effectiveness
		);

		if (types.length === 0)
			return [];
	}

	return types;
}

function getPotentialTypes(
	hasWonderGuard?: boolean,
	...typeEffectivenessMaps: Readonly<Map<TypeEffectiveness, Effectiveness>>[]
): FullType[] {
	let ret = allTypes;

	for (let typeEffectivenessMap of typeEffectivenessMaps)
		ret = getMatchingTypes(ret, typeEffectivenessMap, hasWonderGuard);

	return ret;
}

function getPossibleEffectivenesses<T extends TypeEffectiveness>(
	potentialTypes: readonly FullType[],
	typeEffectiveness: T,
	hasWonderGuard?: boolean
): Set<Effectiveness>;
function getPossibleEffectivenesses<T extends TypeEffectiveness>(
	potentialTypes: readonly FullType[],
	TE: TypeEffectivenessClass<T>,
	hasWonderGuard?: boolean
): Map<T, Set<Effectiveness>>;
/**
 * Gets all possible effectivenesses for a given TypeEffectivenessClass for a collection of potential types.
 */
function getPossibleEffectivenesses<T extends TypeEffectiveness>(
	potentialTypes: readonly FullType[],
	te: T | TypeEffectivenessClass<T>,
	hasWonderGuard?: boolean
): Map<T, Set<Effectiveness>> | Set<Effectiveness>
{
	if ('getAll' in te) {
		const ret: Map<T, Set<Effectiveness>> = new Map();
		te.getAll().forEach(te => {
			ret.set(te, getPossibleEffectivenesses(potentialTypes, te, hasWonderGuard))
		});
		return ret;
	} else {
		const thisPotentialEffectiveness = new Set<Effectiveness>();
		potentialTypes.forEach(fullType => {
			thisPotentialEffectiveness.add(fullType.getEffectivenessOnThis(te, hasWonderGuard));
		});

		return thisPotentialEffectiveness;
	}
}

function getValidEffectivenesses(
	typeMap: Map<MonType, Effectiveness>,
	effectMap: Map<Effect, Effectiveness>,
	hasWonderGuard?: boolean
) {
	let ret = {
		type: new Map<MonType, Set<Effectiveness>>(),
		effect: new Map<Effect, Set<Effectiveness>>(),
		potentialTypes: getPotentialTypes(hasWonderGuard, typeMap, effectMap),
	};

	const defaultTypeEffectivenesses = getPossibleEffectivenesses(
		ret.potentialTypes,
		MonType,
		hasWonderGuard
	);

	const defaultEffectEffectivenesses = getPossibleEffectivenesses(
		ret.potentialTypes,
		Effect,
		hasWonderGuard
	);

	const typeEffectivenessInformation: [
		Map<TypeEffectiveness, Set<Effectiveness>>,
		Map<TypeEffectiveness, Effectiveness>,
		Map<TypeEffectiveness, Set<Effectiveness>>
	][] = [
		[defaultTypeEffectivenesses, typeMap, ret.type],
		[defaultEffectEffectivenesses, effectMap, ret.effect],
	];

	for (let [defaults, teMap, retSet] of typeEffectivenessInformation) {
		for (let [te, effectiveness] of teMap) {
			if (effectiveness === Effectiveness.Unknown)
				retSet.set(te, defaults.get(te)!);
			else {
				teMap.set(te, Effectiveness.Unknown);
				const types = getPotentialTypes(hasWonderGuard, typeMap, effectMap);
				teMap.set(te, effectiveness);
				retSet.set(te, getPossibleEffectivenesses(types, te, hasWonderGuard));
			}
		}
	}

	return ret;
}

function getCommonTypes(fullTypes: readonly FullType[]): [] | [MonType] | [MonType, MonType] {
	if (fullTypes.length === 0)
		return [];

	let ret: ReturnType<typeof getCommonTypes> = fullTypes[0].toArray();

	for (const fullType of fullTypes) {
		if (ret.length === 0)
			return ret;
		ret = ret.filter(type => fullType.has(type)) as ReturnType<typeof getCommonTypes>;
	}

	return ret;
}

function mapUnion<K, V>(...maps: readonly (Map<K, V>|undefined|null)[]): Map<K, V> {
	let ret = new Map<K, V>();
	for (const map of maps) {
		if (map === undefined || map === null)
			continue;

		map.forEach((v, k) => ret.set(k, v));
	}

	return ret;
}

class App extends React.Component<Props, State> {
	static readonly effectPrefix = 'E_';
	static readonly typePrefix = 'T_';
	static readonly wonderGuardParameter = 'WG';
	static readonly wonderGuardParameterSet = 'T';

	constructor(props: Props) {
		super(props);

		const query = window.location.search;
		this.state = App.getInitialState(query);
	}

	static getInitialState(query: string): State {
		const querySearcher = new URLSearchParams(query);
		const typeMap: Map<MonType, Effectiveness> = this.getInitialTypes(querySearcher);
		const effectMap: Map<Effect, Effectiveness> = this.getInitialEffects(querySearcher);
		const hasWonderGuard = this.getInitialWonderGuard(querySearcher);
		const {
			effect: validEffectEffectivenesses,
			potentialTypes,
			type: validTypeEffectiveness
		} = getValidEffectivenesses(typeMap, effectMap, hasWonderGuard);

		return {
			type: {
				effectivenesses: typeMap,
				validEffectivenesses: validTypeEffectiveness,
				deducedEffectivenesses: getDeducedTypeEffectivenesses(validTypeEffectiveness, typeMap),
			},
			effect: {
				effectivenesses: effectMap,
				validEffectivenesses: validEffectEffectivenesses,
				deducedEffectivenesses: getDeducedTypeEffectivenesses(validEffectEffectivenesses, effectMap),
			},
			wonderGuard: {
				has: hasWonderGuard,
				canHave: canHaveWonderGuard(typeMap),
			},
			potentialTypes: potentialTypes,
			commonTypes: getCommonTypes(potentialTypes),
		};
	}

	static getInitialWonderGuard(params: URLSearchParams) {
		const value = params.get(this.wonderGuardParameter)
		if (value && value === App.wonderGuardParameterSet)
			return true;
		return false;
	}

	static getInitialTypes(params: URLSearchParams) {
		return this.getInitial(params, App.typePrefix, MonType);
	}

	static getInitialEffects(params: URLSearchParams) {
		return this.getInitial<Effect>(params, App.effectPrefix, Effect);
	}

	static getInitial<T extends TypeEffectiveness>(
		params: URLSearchParams,
		paramPrefix: string,
		TypeEffectiveness: TypeEffectivenessClass<T>
	): Map<T, Effectiveness> {
		const initialMap = new Map();
		for (let [key, value] of params) {
			if (!key.startsWith(paramPrefix))
				continue;

			key = key.slice(paramPrefix.length);

			try {
				const te = TypeEffectiveness.get(key);
				let effectiveness = Effectiveness.get(value);

				if (!TypeEffectiveness.isValidEffectiveness(effectiveness))
					effectiveness = Effectiveness.Unknown;

				initialMap.set(te, effectiveness);
			} catch (e) {}
		}

		const ret = new Map(
			Array.from(TypeEffectiveness.getAll())
			.map(te => [te, initialMap.get(te) ?? Effectiveness.Unknown])
		);

		return ret;
	}

	render() {
		const style = {
			display: 'inline-flex',
			margin: '10px'
		};

		return (<div>
			<div style={style}>
				<EffectivenessInput
					type={{
						effectivenesses: this.state.type.effectivenesses,
						setEffectiveness: this.setTypeEffectiveness,
						setEffectivenesses: this.setTypeEffectivenesses,
						validEffectivenesses: this.state.type.validEffectivenesses,
					}}

					effect={{
						effectivenesses: this.state.effect.effectivenesses,
						setEffectiveness: this.setEffectEffectiveness,
						setEffectivenesses: this.setEffectEffectivenesses,
						validEffectivenesses: this.state.effect.validEffectivenesses,
					}}

					wonderGuard={{
						has: this.state.wonderGuard.has,
						canBeTrue: this.state.wonderGuard.canHave,
						set: this.setWonderGuard,
					}}

					setParameters={this.setParameters}
				/>
			</div>
			<div style={style}>
				<EffectivenessOutput
					potentialTypes={this.state.potentialTypes}
					commonTypes={this.state.commonTypes}
					type={{
						effectiveness: this.state.type.effectivenesses,
						deducedEffectiveness: this.state.type.deducedEffectivenesses
					}}
					effect={{
						effectiveness: this.state.effect.effectivenesses,
						deducedEffectiveness: this.state.effect.deducedEffectivenesses,
					}}
				/>
			</div>
		</div>);
	}

	setParameters: NonNullable<TypeEffectivenessInputProps['setParameters']> = (params) => {
		this.setState((prevState) => {
			params.typeEffectiveness = mapUnion(
				prevState.type.effectivenesses,
				params.typeEffectiveness
			);

			params.effectEffectiveness = mapUnion(
				prevState.effect.effectivenesses,
				params.effectEffectiveness
			);

			if (params.wonderGuard === undefined)
				params.wonderGuard = prevState.wonderGuard.has;

			const filledParams = params as Required<typeof params>;

			const {
				type: validTypeEffectiveness,
				effect: validEffectEffectiveness,
				potentialTypes
			} = getValidEffectivenesses(
				filledParams.typeEffectiveness,
				filledParams.effectEffectiveness,
				filledParams.wonderGuard
			);

			return {
				effect: {
					effectivenesses: filledParams.effectEffectiveness,
					validEffectivenesses: validEffectEffectiveness,
					deducedEffectivenesses: getDeducedTypeEffectivenesses(
						validEffectEffectiveness,
						filledParams.effectEffectiveness
					),
				},

				type: {
					effectivenesses: filledParams.typeEffectiveness,
					validEffectivenesses: validTypeEffectiveness,
					deducedEffectivenesses: getDeducedTypeEffectivenesses(
						validTypeEffectiveness,
						filledParams.typeEffectiveness
					),
				},

				wonderGuard: {
					has: filledParams.wonderGuard,
					canHave: canHaveWonderGuard(filledParams.typeEffectiveness),
				},

				potentialTypes: potentialTypes,
				commonTypes: getCommonTypes(potentialTypes),
			}
		});
	}

	setEffectEffectivenesses = (effectiveMap: Map<Effect, Effectiveness>) => {
		this.setParameters({ effectEffectiveness: effectiveMap });
	}

	setEffectEffectiveness = (targetEffect: Effect, newEffectiveness: Effectiveness) => {
		let newEffectivenessMap = new Map([[targetEffect, newEffectiveness]]);
		this.setEffectEffectivenesses(newEffectivenessMap);
	}

	setTypeEffectivenesses = (effectivenessMap: Map<MonType, Effectiveness>) => {
		this.setParameters({ typeEffectiveness: effectivenessMap });
	}

	componentDidUpdate() {
		this.updateURL();
	}

	setTypeEffectiveness = (targetType: MonType, newEffectiveness: Effectiveness) => {
		let newEffectivenessMap = new Map([[targetType, newEffectiveness]]);
		this.setTypeEffectivenesses(newEffectivenessMap);
	}

	setWonderGuard = (newValue: boolean) => {
		this.setParameters({ wonderGuard: newValue });
	}

	updateURL() {
		const params = this.getParams();
		let query = new URLSearchParams(params).toString();

		if (!query.startsWith('?'))
			query = `?${query}`;

		window.history.replaceState({}, '', query);
	}

	getParams() {
		let paramsObject = {
			...this.getTypesObject(),
			...this.getEffectsObject()
		};

		if (this.state.wonderGuard.has)
			paramsObject[App.wonderGuardParameter] = App.wonderGuardParameterSet;
		
		return paramsObject;
	}

	static getObject(map: Map<TypeEffectiveness, Effectiveness>, prefix: string) {
		let typesObject: Record<string, string> = {};

		map.forEach((effectiveness, te) => {
			if (effectiveness !== Effectiveness.Unknown)
				typesObject[prefix + te.name] = effectiveness.symbol;
		});

		return typesObject;
	}

	getTypesObject() {
		return App.getObject(this.state.type.effectivenesses, App.typePrefix);
	}

	getEffectsObject() {
		return App.getObject(this.state.effect.effectivenesses, App.effectPrefix);
	}
}

export default App;

