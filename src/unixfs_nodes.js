import { createNode } from "../utils/create_node.js";
import { unixfs } from "@helia/unixfs";

// Creating two nodes A and B
const node_a = await createNode();
const node_b = await createNode();

// Connecting both the nodes
await node_a.libp2p.dial(node_b.libp2p.getMultiaddrs());

// Creating and adding the file
const input = new TextEncoder().encode("Hola!!! soy de Node A");
const fileSystemA = unixfs(node_a);
const fileCID = await fileSystemA.addBytes(input);
console.log("File CID : ", fileCID);

// Creating an empty directory
const emptyDirCid = await fileSystemA.addDirectory();
console.log("Empty Directory CID : ", emptyDirCid);

const updatedDirCid = await fileSystemA.cp(fileCID, emptyDirCid, "file.txt");
console.log("Updated Directory CID : ", updatedDirCid);

// Switching to other node
const fileSystemB = unixfs(node_b);

for await (const entry of fileSystemB.ls(updatedDirCid)) {
  console.log("->");
  console.log(entry.name);
  console.log(entry.cid);
}

// Stop the nodes
node_a.stop();
node_b.stop();
