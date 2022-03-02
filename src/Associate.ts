export function toCaselessKey(s: string) {
	return s.toLowerCase().trim().split(/\s+/g).join('');
}

function associate<T>(
	name: string,
	obj: T,
	nameMap: Map<string, T>
) {
	const key = toCaselessKey(name);
	{
		const mappedObj = nameMap.get(key);
		if (mappedObj !== undefined) {
			if (mappedObj === obj)
				return;
			
			throw new Error(`${name} already associated with ${mappedObj}`);
		}
	}

	nameMap.set(key, obj);
}

export function get<T>(name: string, nameMap: Map<string, T>) {
	return nameMap.get(toCaselessKey(name));
}

export default associate;