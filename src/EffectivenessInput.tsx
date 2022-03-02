import React from "react";
import TypeEffectivenessInput from "./TypeEffectivenessInput";
import MonType from "./MonType";
import Effectiveness from "./Effectiveness";
import Effect from "./Effect";
import TypeEffectiveness, { TypeEffectivenessClass } from "./TypeEffectiveness";

interface TypeEffectivenessInputProps<T extends TypeEffectiveness> {
	/**
	 * A map from T to it's current effectiveness.
	 */
	effectivenesses: Map<T, Effectiveness>;

	/**
	 * A setter for an element of T to it's new effectiveness.
	 * If provided, this will act as a selector.
	 */
	setEffectiveness?(type: T, effectiveness: Effectiveness): void;

	/**
	 * A setter for all elements in T to their new effectivenesses.
	 * If provided, a "Reset All" button will appear.
	 */
	setEffectivenesses?(typeEffectiveness: Map<T, Effectiveness>): void;

	/**
	 * A map for an elemnt of T to valid effectivenesses for that T.
	 * If ommitted, all effectivenesses will be valid.
	 */
	validEffectivenesses?: Map<T, Set<Effectiveness>>;
}

export interface Props {
	/**
	 * If provided, will display the types selected.
	 **/
	type?: TypeEffectivenessInputProps<MonType>;

	/**
	 * If provided, will display the effects selected.
	 */
	effect?: TypeEffectivenessInputProps<Effect>;

	/**
	 * If provided, a "Reset All" button will appear
	 */
	setParameters?(parameters: {
		wonderGuard?: boolean,
		typeEffectiveness?: Map<MonType, Effectiveness>,
		effectEffectiveness?: Map<Effect, Effectiveness>
	}): void;

	wonderGuard?: {
		has: boolean,

		/** Disable if target cannot have wonder guard
		 * e.g. if there is a normally effective type against the target
		 **/
		canBeTrue?: boolean,
		setWonderGuard?(newValue: boolean): void;
	}
};

function separate(contents: React.ReactElement[]): React.ReactElement[];
function separate(contents: React.ReactChild[]): React.ReactChild[];
function separate(contents: React.ReactNode[]): React.ReactNode[];
function separate(contents: any[]): any[] {
	if (contents.length <= 1)
		return contents;
	
	const ret = [contents[0]];

	for (let i = 1; i < contents.length; i++) {
		ret.push(<hr key={`hr-${i}`}/>);
		ret.push(contents[i]);
	}

	return ret;
}

class EffectivenessInput extends React.Component<Props> {
	render = (): React.ReactNode => {
		const wonderGuardID = 'wonder-guard-input';
		const contents: React.ReactElement[] = [];

		type TypeEffectivenessEntry = [
			string,
			TypeEffectivenessClass<TypeEffectiveness>,
			TypeEffectivenessInputProps<TypeEffectiveness>?
		];
		const typeEffectivenessEntries: TypeEffectivenessEntry[] = [
			['Type', MonType, this.props.type ],
			['Effect', Effect, this.props.effect ],
		];

		for (const [name, Type, props] of typeEffectivenessEntries) {
			if (props)
				contents.push(<TypeEffectivenessInput
					name={name}
					allEffectivenesses={Array.from(Type.allowedEffectiveness)}
					typeEffectiveness={props.effectivenesses}
					setTypeEffectiveness={props.setEffectiveness}
					setTypeEffectivenesses={props.setEffectivenesses}
					validEffectivenesses={props.validEffectivenesses}
					key={name}
				/>);
		}

		if (this.props.wonderGuard)
			contents.push(<div key="wonder guard">
				<label htmlFor={wonderGuardID}>Wonder Guard</label>
				<input
					id={wonderGuardID}
					name='wonder guard'
					type='checkbox'
					checked={this.props.wonderGuard.has}
					disabled={
						(!this.props.wonderGuard.canBeTrue && !this.props.wonderGuard.has)
					}
					onClick={() => this.toggleWonderGuard()}
					readOnly={true}
				/>
			</div>)

		if (this.props.setParameters)
			contents.push(<button key='reset button' onClick={this.resetAll}>Reset All</button>);

		return <div>
			{separate(contents)}
		</div>;
	}

	resetAll = () => {
		if (this.props.setParameters)
			this.props.setParameters({
				typeEffectiveness: new Map(Array.from(MonType.getAll()).map(type => [type, Effectiveness.Unknown])),
				effectEffectiveness: new Map(Array.from(Effect.getAll()).map(effect => [effect, Effectiveness.Unknown])),
				wonderGuard: false,
			});
	}

	toggleWonderGuard = () => {
		if (!this.props.wonderGuard?.setWonderGuard)
			return;

		this.props.wonderGuard.setWonderGuard(!this.props.wonderGuard.has);
	}
}

export default EffectivenessInput;