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

  // ========================================[OR]========================================

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

  // ========================================[OR]========================================

  cid = await ipfs.dag.put({ test: 1 });
  cid2 = await ipfs.dag.put({ bar: cid });
  // your code goes here
  let node = await ipfs.dag.get(cid2, {
    path: "/bar/test",
  });

  return node.value;
};

export const linkingMultipleDataIntoDAGs = async (ipfsClient) => {
  // Creating two authors
  const natCid = await ipfsClient.dag.put({ author: "Nat" });
  const samCid = await ipfsClient.dag.put({ author: "Sam" });

  // creating three articles/posts with some tags
  const treePostCid = await ipfsClient.dag.put({
    content: "trees",
    author: samCid,
    tags: ["outdoor", "hobby"],
  });
  const computerPostCid = await ipfsClient.dag.put({
    content: "computers",
    author: natCid,
    tags: ["hobby"],
    prev: treePostCid,
  });
  const dogPostCid = await ipfsClient.dag.put({
    content: "dogs",
    author: samCid,
    tags: ["funny", "hobby"],
    prev: computerPostCid,
  });

  // Generating the CIDs of the tags and linking them with the post
  const outdoorTagCid = await ipfsClient.dag.put({
    tag: "outdoor",
    posts: [treePostCid],
  });
  const hobbyTagCid = await ipfsClient.dag.put({
    tag: "hobby",
    posts: [treePostCid, computerPostCid, dogPostCid],
  });
  const funnyTagCid = await ipfsClient.dag.put({
    tag: "funny",
    posts: [dogPostCid],
  });

  // returning the dog post cid as it is the latest post
  return dogPostCid;
};

export const traversePosts = async (ipfsClient, cid) => {
  // Your code goes here
  const result = [];
  while (cid) {
    result.push(cid);
    const current = await ipfsClient.dag.get(cid);
    const prev = current.value.prev;
    if (prev) {
      cid = prev;
    } else {
      return result;
    }
  }
};
