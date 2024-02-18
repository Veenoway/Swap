import fs from "fs";
import Web3 from "web3";
import { Artifact } from "./models";

const RPC = "http://127.0.0.1:8545/";
const PK = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const provider = new Web3(RPC);
const wallet = provider.eth.accounts.privateKeyToAccount(PK);
const aritfact = JSON.parse(
  String(fs.readFileSync("artifacts/contracts/myContract.sol/CTR.json"))
) as Artifact;
let contractAddress = "";

main();

async function getNonce(): Promise<number> {
  return provider.eth.getTransactionCount(wallet.address);
}

async function main() {
  await deploy();
  await callContract();
}

async function callContract() {
  const CTR = new provider.eth.Contract(aritfact.abi, contractAddress);
  const data = await CTR.methods.number().call();
  console.log("data", data);
  console.log("payload", CTR.methods.increment(3).encodeABI());
  const signTx = await wallet.signTransaction({
    to: contractAddress,
    gas: 100000,
    data: CTR.methods
      .changeOwnerShip("0x77A89C51f106D655547542ade83FE73cf4459135")
      .encodeABI(),
    nonce: await getNonce(),
    gasPrice: Web3.utils.toWei("5", "Gwei"),
  });

  await provider.eth.sendSignedTransaction(signTx.rawTransaction || "");
  const owner = await CTR.methods.owner().call();
  const data1 = await CTR.methods.number().call();
  //   const hash = Web3.utils.sha3("number()");
  //   const data = await provider.eth.call({
  //     data: hash?.slice(0, 10),
  //     to: contractAddress,
  //   });

  //   const result = provider.eth.abi.decodeParameter("uint256", data);
  console.log("data1", data1);
}

async function deploy() {
  const signTx = await wallet.signTransaction({
    gas: 500_000,
    gasPrice: Web3.utils.toWei("5", "Gwei"),
    nonce: await getNonce(),
    data: aritfact.bytecode,
  });

  const receipt = await provider.eth.sendSignedTransaction(
    signTx.rawTransaction || ""
  );

  contractAddress = receipt.contractAddress || "";
  console.log(receipt);
}
