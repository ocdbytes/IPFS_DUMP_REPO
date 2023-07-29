// ===============================
// | IPFS                        |
// | Inter Planetary File System |
// ===============================

// Helia Config Imports
import { MemoryBlockstore } from "blockstore-core";
import { MemoryDatastore } from "datastore-core";
import { createHelia } from "helia";
import { createLibp2p } from "libp2p";
import { tcp } from "@libp2p/tcp";
import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";
import { identifyService } from "libp2p/identify";
import { unixfs } from "@helia/unixfs";

// Cryptography Functions Imports
import { sha256 } from "multiformats/hashes/sha2";
import { CID } from "multiformats/cid";
import * as raw from "multiformats/codecs/raw";

// Temp imports
// import last from "it-last";

const main = async () => {
  // Blockstore : the blockstore is where we store the blocks that make up files
  // Datastore : application-specific data lives in the datastore
  // Libp2p : libp2p is the networking layer that underpins Helia

  const blockstore = new MemoryBlockstore();
  const datastore = new MemoryDatastore();

  const libp2p = await createLibp2p({
    addresses: {
      listen: ["/ip4/127.0.0.1/tcp/0"],
    },
    transports: [tcp()],
    connectionEncryption: [noise()],
    streamMuxers: [yamux()],
    datastore,
    services: {
      identify: identifyService(),
    },
  });

  const ipfsClient = await createHelia({
    libp2p,
    blockstore,
    datastore,
  });

  console.log("PEERS : \n----------");
  console.log(ipfsClient.libp2p.getPeers());

  // Text Encoder to encode the strings
  const textEncoder = new TextEncoder();
  const textDecoder = new TextDecoder();

  // File system instance from unixfs with ipfs helia client
  const fs = unixfs(ipfsClient);

  const ipfs_add_output = await fs.addBytes(
    textEncoder.encode("Hello !!! I am from IPFS"),
    ipfsClient.blockstore
  );

  console.log("CID : ", ipfs_add_output.toString());
  const cid = ipfs_add_output.toString();

  let text = "";

  for await (const chunk of fs.cat(cid)) {
    text += textDecoder.decode(chunk, { stream: true });
  }

  console.log(`Data stored in cid : ${cid} : ${text}`);

  console.log("File Stats : ", await fs.stat(cid));

  ipfsClient.stop();
  /*
  Eg O/p
  ------

  CID :  bafkreicwbat3xkt2xedhzk4uzfm5ketqsll2kdhlri572vdjlto3bjpzgi
  Data stored in cid : bafkreicwbat3xkt2xedhzk4uzfm5ketqsll2kdhlri572vdjlto3bjpzgi : Hello !!! I am from IPFS
  */
};

main();
