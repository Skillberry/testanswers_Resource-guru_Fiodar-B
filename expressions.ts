// types

export enum NodeType {
    Add,
    Constant,
    Divide,
    Multiply,
    Subtract,
}

export interface BinaryNode {
    left: Node;
    nodeType: Exclude<NodeType, NodeType.Constant>;
    right: Node;
}

export interface ConstantNode {
    nodeType: NodeType.Constant;
    value: number;
}

export type Node = BinaryNode | ConstantNode;


// we go with separate functions as this solution provides good tree shaking

// factory functions

/**
 * Creates binary expression.
 * @param nodeType Type of binary node (operator).
 * @param left Left argument expression.
 * @param right Right argument expression.
 * @returns The binary expression.
 */
export function binaryNode(nodeType: BinaryNode["nodeType"], left: Node, right: Node): BinaryNode {
    return {
        left,
        nodeType,
        right,
    };
}

/**
 * Creates constant expression.
 * @param value Constant value.
 * @returns The constant expression.
 */
export function constantNode(value: number): ConstantNode {
    return {
        nodeType: NodeType.Constant,
        value,
    };
}

// we would implement more explicit factories such as binary add node: binaryAddNode(left: Node, right: Node)
// but we leave it to user (see expressions_test.ts)

// stringify visitor

/**
 * Creates a string representation of the expression.
 * @param node Expression.
 * @returns The string representation of the expression.
 */
export function stringifyNode(node: Node): string {
    if (node.nodeType === NodeType.Constant) {
        return node.value.toString();
    }

    const result = `(${stringifyNode(node.left)} ${stringifyBinaryOperator(node.nodeType)} ${stringifyNode(node.right)})`;
    return result;

    // intentionally hide stringifyBinaryOperator from top scope as it inner implementation of stringifyNode.
    
    // although we could capture outer 'node' inside stringifyBinaryOperator and make it parameterless
    // such solution will create new function every time stringifyNode is called. avoiding it by never
    // reference outside variables within stringifyBinaryOperator
    
    // unfortunately js/ts don't have any pattern matching syntax, so go with 'switch' 
    function stringifyBinaryOperator(nodeType: BinaryNode["nodeType"]) {
        switch (nodeType) {
            case NodeType.Add:
                return "+";
            case NodeType.Divide:
                return "??";
            case NodeType.Multiply:
                return "x";
            case NodeType.Subtract:
                return "-";
            default:
                throw new Error(`Invalid node type: '${nodeType}'.`);
        }
    }
}

// execute visitor

/**
 * Executes the expression.
 * @param node Expression.
 * @returns The result of expression execution.
 */
export function executeNode(node: Node): number {
    if (node.nodeType === NodeType.Constant) {
        return node.value;
    }

    const result = executeBinaryNode(node);
    return result;

    function executeBinaryNode(node: BinaryNode): number {
        const [left, right] = [executeNode(node.left), executeNode(node.right)];

        switch (node.nodeType) {
            case NodeType.Add:
                return left + right;
            case NodeType.Divide:
                return left / right;
            case NodeType.Multiply:
                return left * right;
            case NodeType.Subtract:
                return left - right;
            default:
                throw new Error(`Invalid node type: '${node.nodeType}'.`);
        }
    }
}


// bonus. compile expression into function. executeNode is not efficient at runtime.
// if user need to define expression once but then call it multiple times it is worth
// to compile an expression into function
// the compilation is done using the 'Function' constructor. although it is better than 'eval'
// it still need to be carefully analyzed if it's safe to use in specific circumstances

/**
 * Compiles an expression into function.
 * @param node Expression.
 * @returns The function.
 */
export function compileNode(node: Node): () => number {
    const body = `return ${stringify(node)};`;
    return new Function(body) as () => number;

    function stringify(node: Node): string {
        if (node.nodeType === NodeType.Constant) {
            return node.value.toString();
        }

        const result = `(${stringify(node.left)} ${stringifyBinaryOperator(node.nodeType)} ${stringify(node.right)})`;
        return result;

        function stringifyBinaryOperator(nodeType: BinaryNode["nodeType"]) {
            switch (nodeType) {
                case NodeType.Add:
                    return "+";
                case NodeType.Divide:
                    return "/";
                case NodeType.Multiply:
                    return "*";
                case NodeType.Subtract:
                    return "-";
                default:
                    throw new Error(`Invalid node type: '${nodeType}'.`);
            }
        }
    }
}
