// ===================================
// | Working with ipfs.dag.methods() |
// ===================================
// Author : w3Ts0ck3T_eth
// Desclaimer : These functions will work only for ipfs-js module which is depricated as of June 2023

export const putDataIntoDAG = async (ipfsClient) => {
  return await ipfsClient.dag.put({ test: 1 });
};

export const putDataIntoDAGPointingToCIDOfAnotherCID = async (ipfsClient) => {
  let cid = await ipfsClient.dag.put({ test: 1 });
  let cid2 = await ipfsClient.dag.put({ bar: cid });
  return cid2;
};

export const puttingAndGettingDataByPath = async (ipfsClient) => {
  let cid = await ipfs.dag.put({
    my: {
      deep: {
        obj: "is cool",
      },
    },
  });

  console.log(
    await ipfs.dag.get(cid, {
      path: "/my/deep/obj",
    })
  );

  // ========================================[OR]

  cid = await ipfs.dag.put({ foo: "bar" });
  let cid2 = await ipfs.dag.put({
    my: {
      other: cid,
    },
  });

  console.log(
    await ipfs.dag.get(cid2, {
      path: "/my/other/foo",
    })
  );

  // ========================================[OR]

  cid = await ipfs.dag.put({ test: 1 });
  cid2 = await ipfs.dag.put({ bar: cid });
  // your code goes here
  let node = await ipfs.dag.get(cid2, {
    path: "/bar/test",
  });

  return node.value;
};
