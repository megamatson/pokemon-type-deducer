import React from "react";
import FullType from "./FullType";
import TypeEffectivenessComponent from "./TypeEffectivenessComponent";

export interface Props {
	type: FullType
}

class FullTypeComponent extends React.Component<Props> {
	render() {
		return <span>
			<TypeEffectivenessComponent
				key='1'
				typeEffectiveness={this.props.type.type1}
			/>
			{
				this.props.type.type2 ?
					[
						", ",
						<TypeEffectivenessComponent
							key='2'
							typeEffectiveness={this.props.type.type2}
						/>
					] :
					null
			}
		</span>;
	}
}

export default FullTypeComponent;