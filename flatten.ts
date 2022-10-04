export type NestedArray<T> = (T | NestedArray<T>)[];

/**
 * Inner implementation. Actually we may make it public and allow users
 * to use it directly for more flexible scenarios.
 * 
 * @param array Input array.
 */
function *iterator<T>(array: NestedArray<T>): Iterable<T> {
    for (const el of array) {
        if (Array.isArray(el)) {
            yield *iterator(el);
        }
        else {
            yield el;
        }
    }
}

/**
 * Flattens array of elements or nested arrays of any level of depth.
 * 
 * @param array Input array of elements or nested arrays of elements (can be any level of depth).
 * @returns Flattened array of elements.
 */
export function flatten<T>(array: NestedArray<T>): T[] {
    return [...iterator(array)];
}
