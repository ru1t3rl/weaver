import { ContainerNode } from "./container-node/container-node";
import { GroupNode } from "./group-node/group-node";
import { DockerNetworkNode, dockerNetworkNode } from "./network-node/network-node";
import { StackNode } from "./stack-node/stack-node";

export const NodeTypes = {
    containerNode: ContainerNode,
    stackNode: StackNode,
    groupNode: GroupNode,
    dockerNetworkNode: DockerNetworkNode
}