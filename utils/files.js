// ===================================
// | Working with ipfs.file.methods() |
// ===================================
// Author : w3Ts0ck3T_eth
// Desclaimer : These functions will work only for ipfs-js module which is depricated as of June 2023

import toBuffer from "it-to-buffer";

/**
 * @desc Function to get the stats of the root location of the client
 * @param ipfsClient
 *
 * Function Description :
 * await ipfs.files.stat([path], [options])
 *
 * https://github.com/ipfs/js-ipfs/blob/master/docs/core-api/FILES.md#ipfsfilesstatpath-options
 */
export const getRootFilesStat = async (ipfsClient) => {
  const stats = ipfsClient.files.stat("/");
  return stats;
};

/**
 * @desc Function to write multiple files into the IPFS Mutable File System
 * @param ipfsClient
 * @param files
 *
 * Function Description :
 * await ipfs.files.write(path, content, [options])
 *
 * https://github.com/ipfs/js-ipfs/blob/master/docs/core-api/FILES.md#ipfsfileswritepath-content-options
 */
export const writeFilesToIPFS = async (ipfsClient, files) => {
  for (let file of files) {
    await ipfsClient.files.write("/" + file.name, file, { create: true });
  }
};

/**
 * @desc Function to view the files in a provided filePath
 * @param ipfsClient
 * @param filePath
 * @returns result
 *
 * Function Description :
 * await ipfs.files.ls([path], [options])
 *
 * https://github.com/ipfs/js-ipfs/blob/master/docs/core-api/FILES.md#ipfsfileslspath-options
 */
export const viewContentsOfDir = async (ipfsClient, filePath) => {
  const result = [];

  for await (const resultPart of ipfsClient.files.ls(filePath)) {
    //@ts-ignore
    result.push(resultPart);
  }

  return result;
};

/**
 * @desc Function to create a folder in the provided path
 * @param ipfsClient
 * @param filePath
 * @param _parent : Whether you want to create the parent directories when you provide a nested path
 * Eg : /dir/abc : _parent=true [Needed]
 * Eg : /abc : _parent=false [Not_Needed]
 *
 * Function Description :
 * await ipfs.files.mkdir([path], [options])
 *
 * https://github.com/ipfs/js-ipfs/blob/master/docs/core-api/FILES.md#ipfsfilesmkdirpath-options
 */
export const createDirectory = async (
  ipfsClient,
  filePath,
  _parent = false
) => {
  await ipfsClient.files.mkdir(filePath, { parent: _parent });
};

/**
 * @desc Function to move the directories from a path to a destination path
 * @param ipfsClient
 * @param from_paths
 * @param to_path
 *
 * Function Description
 * await ipfs.files.mv(...from, to, [options])
 *
 * * move a single file into a directory
 * await ipfs.files.mv('/source-file.txt', '/destination-directory')
 *
 * * move a directory into another directory
 * await ipfs.files.mv('/source-directory', '/destination-directory')
 *
 * * overwrite the contents of a destination file with the contents of a source file
 * await ipfs.files.mv('/source-file.txt', '/destination-file.txt')
 *
 * https://github.com/ipfs/js-ipfs/blob/master/docs/core-api/FILES.md#ipfsfilesmvfrom-to-options
 */
export const moveDirectoryOrFiles = async (ipfsClient, from_paths, to_path) => {
  from_paths.map(async (path) => {
    await ipfsClient.files.mv(path, to_path);
  });
};

/**
 * @desc Function to copy the directories from a path to a destination path
 * @param ipfsClient
 * @param from_paths
 * @param to_path
 *
 * Function Description
 * await ipfs.files.cp(...from, to, [options])
 *
 * * copy a single file into a directory
 * await ipfs.files.cp('/source-file.txt', '/destination-directory')
 * await ipfs.files.cp('/ipfs/QmWGeRAEgtsHW3ec7U4qW2CyVy7eA2mFRVbk1nb24jFyks', '/destination-directory')
 *
 * * copy multiple files into a directory (note the two acceptable formats with or without [ ])
 * await ipfs.files.cp('/source-file-1.txt', '/source-file-2.txt', '/destination-directory')
 * await ipfs.files.cp(['/source-file-1.txt', '/source-file-2.txt'], '/destination-directory')
 * await ipfs.files.cp('/ipfs/QmWGeRAEgtsHW3ec7U4qW2CyVy7eA2mFRVbk1nb24jFyks', '/ipfs/QmWGeRAEgtsHW3jk7U4qW2CyVy7eA2mFRVbk1nb24jFyre', '/destination-directory')
 * await ipfs.files.cp(['/ipfs/QmWGeRAEgtsHW3ec7U4qW2CyVy7eA2mFRVbk1nb24jFyks', '/ipfs/QmWGeRAEgtsHW3jk7U4qW2CyVy7eA2mFRVbk1nb24jFyre'], '/destination-directory')
 *
 * * copy a directory into another directory
 *
 * await ipfs.files.cp('/source-directory', '/destination-directory')
 * await ipfs.files.cp('/ipfs/QmWGeRAEgtsHW3ec7U4qW2CyVy7eA2mFRVbk1nb24jFyks', '/destination-directory')
 *
 * https://github.com/ipfs/js-ipfs/blob/master/docs/core-api/FILES.md#ipfsfilescpfrom-to-options
 */
export const copyDirectoryOrFiles = async (ipfsClient, from_paths, to_path) => {
  from_paths.map(async (path) => {
    await ipfsClient.files.mv(path, to_path);
  });
};

/**
 * @desc Function to read a file in the provided path
 * @param ipfsClient
 * @param filePath
 *
 * Function Description :
 * await ipfs.files.read([path], [options])
 *
 * https://github.com/ipfs/js-ipfs/blob/master/docs/core-api/FILES.md#ipfsfilesreadpath-options
 */
export const readFile = async (ipfsClient, filePath) => {
  const bufferedContents = await toBuffer(ipfsClient.files.read(filePath));
  const contents = bufferedContents.toString();
  return contents;
};

/**
 * @desc Function to remove the directories from a path
 * @param ipfsClient
 * @param paths
 * @param _recursive : Whether you want to remove the parent directories when you provide a nested path
 *
 * Function Description
 * await ipfs.files.rm(...paths, [options])
 *
 * * remove a file
 * await ipfs.files.rm('/my/beautiful/file.txt')
 *
 * * remove multiple files (note the two acceptable formats with or without [ ])
 * await ipfs.files.rm('/my/beautiful/file.txt', '/my/other/file.txt')
 * await ipfs.files.rm(['/my/beautiful/file.txt', '/my/other/file.txt'])
 *
 * * remove a directory and its contents
 * await ipfs.files.rm('/my/beautiful/directory', { recursive: true })
 *
 * * remove a directory only if it is empty
 * await ipfs.files.rm('/my/beautiful/directory')
 *
 * https://github.com/ipfs/js-ipfs/blob/master/docs/core-api/FILES.md#ipfsfilesrmpaths-options
 */
export const removeDirectoryOrFiles = async (
  ipfsClient,
  paths,
  _recursive = false
) => {
  paths.map(async (path) => {
    await ipfsClient.files.mv(path, { recursive: _recursive });
  });
};
