import { assertStrictEquals } from "https://deno.land/std@0.158.0/testing/asserts.ts";
import { binaryNode, compileNode, constantNode, executeNode, NodeType, stringifyNode } from "./expressions.ts";

Deno.test("Expression tree test", () => {
    let node = binaryNode(
        NodeType.Divide,
        binaryNode(
            NodeType.Add,
            constantNode(7),
            binaryNode(
                NodeType.Multiply,
                binaryNode(
                    NodeType.Subtract,
                    constantNode(3),
                    constantNode(2),
                ),
                constantNode(5),
            ),
        ),
        constantNode(6),
    );

    const expectedDisplay = "((7 + ((3 - 2) x 5)) ÷ 6)";
    let display = stringifyNode(node);
    assertStrictEquals(display, expectedDisplay, "String representation doesn't match.");

    // the same but using shortcut factories
    const [a, c, d, m, s] = [
        binaryNode.bind(undefined, NodeType.Add),
        constantNode,
        binaryNode.bind(undefined, NodeType.Divide),
        binaryNode.bind(undefined, NodeType.Multiply),
        binaryNode.bind(undefined, NodeType.Subtract),
    ];
    node = d(a(c(7), m(s(c(3), c(2)), c(5))), c(6)); // hard to read but very compact
    display = stringifyNode(node);
    assertStrictEquals(display, expectedDisplay, "String representation doesn't match.");

    const expectedResult = 2;
    let result = executeNode(node);
    assertStrictEquals(result, expectedResult, "Result doesn't match.");

    const func = compileNode(node);
    result = func();
    assertStrictEquals(result, expectedResult, "Result doesn't match.");
});
