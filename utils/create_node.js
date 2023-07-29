import { MemoryBlockstore } from "blockstore-core";
import { MemoryDatastore } from "datastore-core";
import { createHelia } from "helia";
import { createLibp2p } from "libp2p";
import { tcp } from "@libp2p/tcp";
import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";
import { identifyService } from "libp2p/identify";

export const createNode = async () => {
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

  return ipfsClient;
};
