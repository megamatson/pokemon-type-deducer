import React from "react";
import Effectiveness from "./Effectiveness";
import { map } from "./Iter";
import TypeEffectiveness from "./TypeEffectiveness";
import TypeEffectivenessSelectorRow from "./TypeEffectivenessSelectorRow";

export interface Props<T extends TypeEffectiveness> {
	/**
	 * The name of the TypeEffectiveness you are setting.
	 * This will be used in the header
	 * @example 'Effect', 'Type'
	 * */
	name: string,

	/** All the effectivenesses that are valid for this T */
	allEffectivenesses: Effectiveness[],

	/** A map of a type's effectiveness vs a target. */
	typeEffectiveness: Map<T, Effectiveness>,

	/** A setter for a type's effectiveness */
	setTypeEffectiveness?(
		typeEffectiveness: T,
		effectiveness: Effectiveness
	): void,

	/**
	 * Optional setter for all types.
	 * If excluded, it will use setTypeEffectiveness multiple times,
	 * which can be slow
	 * */
	setTypeEffectivenesses?(typeEffectivenesses: Map<T, Effectiveness>): void,

	validEffectivenesses?: Map<T, Set<Effectiveness>>,
}

class TypeEffectivenessInput<
	T extends TypeEffectiveness
> extends React.Component<Props<T>> {
	render() {
		const effectivenesses = Array.from(this.props.allEffectivenesses);

		const typeInputRows = Array.from(this.props.typeEffectiveness.entries())
			.map(
				([typeEffectiveness, effectiveness]) =>
					<TypeEffectivenessSelectorRow
						key={typeEffectiveness.name}
						typeEffectiveness={typeEffectiveness}
						effectiveness={effectiveness}
						setEffectiveness={this.props.setTypeEffectiveness}
						allEffectivenesses={this.props.allEffectivenesses}
						validEffectivenesses={
							this.props.validEffectivenesses?.get(typeEffectiveness)
						}
					/>
		);

		return (<div>
			<form action="" onSubmit={(...args) => {
				console.log(this.props.name, "submitted");
				console.log(args);
				console.log(args[0]);
				return false;
			}}>
				<table>
					<thead>
						<tr><th>{this.props.name}</th>{effectivenesses.map(e =>
							<th key={e.symbol} title={e.name}>{e.symbol}</th>
						)}</tr>
					</thead>
					<tbody>
						{typeInputRows}
					</tbody>
				</table>
			</form>
			{
				this.props.setTypeEffectivenesses || this.props.setTypeEffectiveness ?
					<button onClick={this.reset}>Reset</button> :
					null
			}
		</div>);
	}

	reset = () => {
		if (this.props.setTypeEffectivenesses) {
			this.props.setTypeEffectivenesses(
				new Map(map(
					this.props.typeEffectiveness.keys(),
					type => [type, Effectiveness.Unknown]
				))
			);
		} else if (this.props.setTypeEffectiveness) {
			this.props.typeEffectiveness.forEach((_, typeEffectiveness) => {
				this.props.setTypeEffectiveness!(
					typeEffectiveness,
					Effectiveness.Unknown
				);
			});
		}
	};
}

export default TypeEffectivenessInput;