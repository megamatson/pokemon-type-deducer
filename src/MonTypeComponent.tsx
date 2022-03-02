import React from "react";
import MonType from "./MonType";

export interface Props {
	type: MonType
}

class MonTypeComponent extends React.Component<Props> {
	render(): React.ReactNode {
		return <span>{this.props.type.name}</span>
	}
}

export default MonTypeComponent;