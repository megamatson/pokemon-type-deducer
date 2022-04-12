interface Predicate<T> {
	(v: T): boolean;
}

export function any<T>(
	it: Iterable<T>,
	predicate: Predicate<T> = Boolean
): boolean {
	for (let v of it)
		if (predicate(v))
			return true;

	return false;
}

export function all<T>(
	it: Readonly<Iterable<T>>,
	predicate: Predicate<T> = Boolean
) {
	for (const v of it) {
		if (!predicate(v)) {
			return false;
		}
	}

	return true;
}

export function* map<T, U>(it: Iterable<T>, func: (v: T) => U): Generator<U> {
	for (let v of it)
		yield func(v);
}

export function* filter<T>(
	it: Iterable<T>,
	predicate: Predicate<T>
): Generator<T> {
	for (let v of it)
		if (predicate(v))
			yield v;
}

export function first<T>(it: Iterable<T>): T {
	for (let v of it)
		return v;

	throw new Error("Iterator had no elements");
}