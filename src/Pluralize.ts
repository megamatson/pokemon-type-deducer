/**
 * A function that pluralizes a word based on conventions of the English
 * language. Returns `singular` if `n` denotes a singular value,
 * otherwise returns `plural`.
 * If `n < 0`, an error will be thrown.
 * `plural` can be omitted, which will cause `plural` to be `${singular}s`.
 * If `plural` is "s" or "es", plural will be `${singular}${plural}`
 */
export function en_pluralize(
	n: number,
	singular: string,
	plural?: string
): string {
	if (n < 0)
		throw new Error(`${n} is negative`);

	if (n === 1)
		return singular;

	if (plural === undefined)
		plural = `${singular}s`;
	else if (plural === 'es' || plural === 's')
		plural = `${singular}${plural}`;

	return plural;
}