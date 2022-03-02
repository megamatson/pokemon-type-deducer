import React from "react";
import Effectiveness from "./Effectiveness";
import TypeEffectiveness from "./TypeEffectiveness";
import TypeEffectivenessComponent from "./TypeEffectivenessComponent";

interface Props<T extends TypeEffectiveness> {
	/** The type effectiveness you are setting for */
	typeEffectiveness: T,

	/** The type effectiveness' current effectiveness */
	effectiveness: Effectiveness,

	/**
	 * All effectivenesses for the TypeEffectiveness.
	 * The order will dictate where it appears on the page.
	 * Non-unique entries has undefined behavior.
	 **/
	allEffectivenesses: Effectiveness[],

	/**
	 * All effectivenesses that are valid for this typeEffectiveness.
	 * Omitting it will allow all effectivenesses to be used.
	*/
	validEffectivenesses?: Set<Effectiveness>,

	/** A setter for this type effectiveness to it's new effectiveness */
	setEffectiveness?(typeEffectiveness: T, effectiveness: Effectiveness): void,
}

class TypeEffectivenessSelectorRow<T extends TypeEffectiveness> extends React.Component<Props<T>> {
	render(): React.ReactNode {
		const deducedEffectiveness =
			this.props.validEffectivenesses &&
			this.props.validEffectivenesses.size === 1 &&
			this.props.effectiveness === Effectiveness.Unknown ?
				this.props.validEffectivenesses.values().next().value as Effectiveness :
				undefined
		;

		return (<tr
			className={
				deducedEffectiveness ? 'deduced' : ''
			}
		>
			<td className={this.props.effectiveness.getCssClass()}>
				<TypeEffectivenessComponent
					typeEffectiveness={this.props.typeEffectiveness}
					effectiveness={this.props.effectiveness}
				/>
				{
					/*this.props.validEffectivenesses ? ' ' + Array.from(this.props.validEffectivenesses).map(e => e.symbol).join('') : ''*/
				}
			</td>
			{
				this.props.allEffectivenesses.map(effectiveness =>
				<td key={`${this.props.typeEffectiveness.name}Effectiveness${effectiveness.symbol}`}>
					<input
						type='radio'
						name={`${this.props.typeEffectiveness.name}Effectiveness`}
						checked={effectiveness === (deducedEffectiveness ?? this.props.effectiveness)}
						readOnly={true}
						onClick={
							() =>  this.props.setEffectiveness?.(this.props.typeEffectiveness, effectiveness)
						}
						disabled={
							deducedEffectiveness ?
								effectiveness !== deducedEffectiveness :
								this.props.validEffectivenesses ?
									!this.props.validEffectivenesses.has(effectiveness) && effectiveness !== Effectiveness.Unknown :
									false
						}
					/>
				</td>)
			}
		</tr>);
	}
}

export default TypeEffectivenessSelectorRow;