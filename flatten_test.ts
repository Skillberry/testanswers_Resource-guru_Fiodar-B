import { assertEquals, assertStrictEquals } from "https://deno.land/std@0.158.0/testing/asserts.ts";
import { NestedArray, flatten } from "./flatten.ts";

Deno.test("Flattening an array test", () => {
    const input: NestedArray<number> = [1, [12, 23], 6, [17, 102, [22, -8, [42]]]];
    const expectedResult = [1, 12, 23, 6, 17, 102, 22, -8, 42];

    const result = flatten(input);

    assertStrictEquals(result.length, expectedResult.length, "Length doesn't match.");
    assertEquals(result, expectedResult, "Array elements don't match.");
});
