import { AbiItem } from "web3-utils";

export interface Artifact {
  _format: string;
  contractName: string;
  sourceName: string;
  abi: AbiItem[];
  bytecode: string;
  deployedBytecode: string;
  linkReferences: {};
  deployedLinkReferences: {};
}
