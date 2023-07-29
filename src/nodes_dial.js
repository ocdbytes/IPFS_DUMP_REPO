import { createNode } from "../utils/create_node.js";

// Cryptography Functions Imports
import { sha256 } from "multiformats/hashes/sha2";
import { CID } from "multiformats/cid";
import * as raw from "multiformats/codecs/raw";

// Creating two nodes A and B
const node_a = await createNode();
const node_b = await createNode();

// Connecting both the nodes
await node_a.libp2p.dial(node_b.libp2p.getMultiaddrs());

// Create a Block
const input = new TextEncoder().encode("Hello !!! I am from Node A");
const digest = await sha256.digest(input);
const cid = CID.createV1(raw.code, digest);

// Put the block into Node A
await node_a.blockstore.put(cid, input);

// Getting the block into Node B
const block_from_A = await node_b.blockstore.get(cid);
console.log(new TextDecoder().decode(block_from_A));

// Stop the nodes
await node_a.stop();
await node_b.stop();
