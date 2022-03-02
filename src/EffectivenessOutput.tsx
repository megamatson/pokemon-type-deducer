import React from "react";
import Effect from "./Effect";
import Effectiveness from "./Effectiveness";
import './EffectivenessOutput.css';
import FullType from "./FullType";
import FullTypeComponent from "./FullTypeComponent";
import { map } from "./Iter";
import MonType from './MonType';
import { en_pluralize } from "./Pluralize";
import TypeEffectiveness from "./TypeEffectiveness";

interface TypeEffectivenessEntry<T extends TypeEffectiveness> {
	effectiveness: Map<T, Effectiveness>,
	deducedEffectiveness?: Map<T, Effectiveness>
}

export interface Props {
	effect?: TypeEffectivenessEntry<Effect>
	type?: TypeEffectivenessEntry<MonType>
	potentialTypes?: FullType[],
	commonTypes?: [] | [MonType] | [MonType, MonType],
};

class EffectivenessOutput extends React.Component<Props> {
	render(): React.ReactNode {
		if (this.props.potentialTypes?.length === 0)
			return "No valid types";
		
		if (this.props.potentialTypes?.length === 1)
			return (<div key='type found'>
				<span>Type: </span>
				<FullTypeComponent type={this.props.potentialTypes[0]}/>
			</div>);

		const contents: React.ReactElement[] = [];

		if (this.props.commonTypes !== undefined && this.props.commonTypes.length !== 0)
			contents.push(<div key='common types'>
				<span>Common {en_pluralize(this.props.commonTypes.length, 'Type')}: </span>
				<FullTypeComponent type={new FullType(this.props.commonTypes[0], this.props.commonTypes[1])}/>
			</div>);

		type TypeEffectivenessEntry<T extends TypeEffectiveness> = [
			string,
			Map<T, Effectiveness> | undefined
		]
		const typeEffectivenessEntries: [
			TypeEffectivenessEntry<MonType>,
			TypeEffectivenessEntry<Effect>
		] = [
			['type', this.props.type?.deducedEffectiveness],
			['effect', this.props.effect?.deducedEffectiveness],
		];

		for (const [title, mapping] of typeEffectivenessEntries) {
			if (!mapping || mapping.size <= 0)
				continue;

			contents.push(<div key={`deduced ${title} effectiveness`}>
				<span>
					Deduced {title} {en_pluralize(mapping.size, 'effectiveness', 'es')} found:
				</span>
				<ul>{
					Array.from(map<[MonType|Effect, Effectiveness], React.ReactElement>(
						mapping.entries(),
						([te, effectiveness]) => <li key={te.name}>{[
							te instanceof MonType ?
								<FullTypeComponent key={te.name} type={new FullType(te)}/> :
								<span key={te.name}>{te.name}</span>,
							<span key=':'>: </span>,
							<span key={effectiveness.name}>{effectiveness.name}</span>,
						]}</li>)
					)
				}</ul>
			</div>)
		}

		if (this.props.potentialTypes) {
			contents.push(<span key='potential types'>{this.props.potentialTypes.length} potential types</span>);
			contents.push(<ul key='potential types list'>{
				this.props.potentialTypes
					.map(fullType => <li key={fullType.toString()}>
						<FullTypeComponent type={fullType}/>
					</li>)
			}</ul>);
		}

		return <div>{contents}</div>;
	}
}

export default EffectivenessOutput;