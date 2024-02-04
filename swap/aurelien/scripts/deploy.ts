import fs from "fs";
import Web3 from "web3";
import { Artifact } from "./models";

const RPC = "http://127.0.0.1:8545/";
const PK = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const provider = new Web3(RPC);
const wallet = provider.eth.accounts.privateKeyToAccount(PK);
const artifact = JSON.parse(
  String(fs.readFileSync("artifacts/contracts/myContract.sol/CTR.json"))
) as Artifact;

let contractAddress = "";

main();

async function main() {
  await deploy();
  await callContract();
}

async function callContract() {
  const CTR = new provider.eth.Contract(artifact.abi, contractAddress);
  // const data = await CTR.methods.number().call();
  const data = await provider.eth.call({
    to: contractAddress,
    data: Web3.utils.sha3("number()")?.slice(0, 10),
  });
  console.log(
    "This is response",
    provider.eth.abi.decodeParameter("uint256", data)
  );
}

async function getNonce(): Promise<number> {
  return provider.eth.getTransactionCount(wallet.address);
}

async function deploy() {
  console.log(`wallet address: ${wallet.address}`);
  console.log("artifact", artifact);
  const signedTx = await wallet.signTransaction({
    nonce: await getNonce(),
    gas: 500_000,
    gasPrice: Web3.utils.toWei("5", "Gwei"),
    data: artifact.bytecode,
  });

  const receipt = await provider.eth.sendSignedTransaction(
    signedTx.rawTransaction || ""
  );

  contractAddress = receipt.contractAddress as string;
}
