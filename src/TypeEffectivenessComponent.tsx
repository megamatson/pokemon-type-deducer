import React from "react";
import Effectiveness from "./Effectiveness";
import TypeEffectiveness from "./TypeEffectiveness";

export interface Props {
	typeEffectiveness: TypeEffectiveness,
	effectiveness?: Effectiveness,
}

class TypeEffectivenessComponent extends React.Component<Props> {
	render() {
		return <span className={this.props.effectiveness ? this.props.effectiveness.getCssClass() : ''}>
			{this.props.typeEffectiveness.name}
		</span>
	}
}

export default TypeEffectivenessComponent;