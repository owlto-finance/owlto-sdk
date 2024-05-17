# Owlto SDK

If you are Aggregators, Cross-Chain Swap, DEX, etc., you can choose to install Owlto-SDK as your underlying solution to achieve cross-chain functionality between different networks.

## Install
```bash
# Use yarn
yarn add owlto-sdk

# Or use npm
npm install owlto-sdk --save
```


## Quickstart

For example, to bridge USDC from Base to Scroll
```TypeScript
import * as owlto from "owlto-sdk";

const options: owlto.BridgeOptions = {}
let bridge = new owlto.Bridge(options);

const result = await bridge.getBuildTx(
    "USDC", //token name
    "BaseMainnet", //from chain name
    "ScrollMainnet",// to chain name
    "1", // value
    "0xa5E56D455BF247C475D752721Ba35A0c85Df81Dc", // from address
    "0xa5E56D455BF247C475D752721Ba35A0c85Df81Dc", // to address
);

//initialize your wallet
//...

if (result.txs.approveBody) {
    const tx = await wallet.sendTransaction(result.txs.approveBody as ethers.TransactionRequest);
    await tx.wait(); 
}

const tx = await wallet.sendTransaction(result.txs.transferBody as ethers.TransactionRequest);
await tx.wait(); 

const receipt = await bridge.waitReceipt(tx.hash)
console.log(receipt)
```
For more details, check the example/bridge_usdc folder.


## Bridge options

### 1.chainNameMapping (Map<string, string> | optional) 
Map your the chain names from your protocol with Owlto.

For example, if the chain name of Base Mainnet on your protocol is "Base", you can set  `chainNameMapping["Base"] = "BaseMainnet"`.

Then you can run functions with chain name as "Base" in order to proceed with a bridge.


## Get build tx
```typescript
const result = await bridge.getBuildTx(
    "USDC", //token name
    "BaseMainnet", //from chain name
    "ScrollMainnet",// to chain name
    "1", // value
    "0xa5E56D455BF247C475D752721Ba35A0c85Df81Dc", // from address
    "0xa5E56D455BF247C475D752721Ba35A0c85Df81Dc", // to address
);

//result:
{
 ...
  networkType: 1; //
  txs: any; //actual transactions need to be sent to from chain, see the following details
}
```
The txs contains the transactions user should send to `from chain` when bridging.

#### 1.Evm
- ##### txs.approveBody 
    The approve transaction, if any, should be sent first.
- ##### txs.transferBody
    The actual transfer transaction.

#### 2.Starknet
Coming Soon

#### 3.Solana
Coming Soon


## Get receipt

1. `bridge.waitReceipt(fromChainHash: string)`

2. `bridge.getReceipt(fromChainHash: string)`

`fromChainHash` is the hash value of the transfer transaction.

`waitReceipt` refers to waiting for the bridge process to complete. 

If the bridge process is not completed within 1 minute (usually due to not finding the hash value or failure), error message will be displayed.

`getReceipt` refers to get the status of a bridge process.

If `fromChainHash` is not found, bridge is in progress or failed, error message will be displayed.

## Get pair info

1. `bridge.getPairInfo(tokenName: string, fromChainName: string, toChainName: string)`

2. `bridge.getAllPairInfos()`

A pair consists of three components: `token name`, `from chain name`, `to chain name`.

You can only bridge supported pairs


## HTTP API Documentation
The URL path for API: https://owlto.finance/api/bridge_api/v1/{API}

Please visit for documentation: https://owlto.finance/bridge_api/v1/swagger/index.html .


## Q&A

### How do I know which tokens can be bridged between selected chains?
You can simply called the `bridge.getAllPairInfos()` function.(`get_all_pair_infos` HTTP API) 

It will return a list of pairs for each supported tokens can be bridged.


### What does build tx do?
The `bridge.getBuildTx()` function(`get_build_tx` HTTP API) will return all the transactions needed when bridging.

For example, if you bridge USDC from Base to Scroll, it will return two transactions in the txs field.

1. `txs.approveBody`, approve to Owlto smart contract.(will be null if the allowance is enough)

2. `txs.transferBody`, transfer the USDC token to Owlto smart contract on Base chain.

The transactions are in ETH JSON format and are ready to be sent by library like "Ethers".


### Why getReceipt () returns error?
The `bridge.getReceipt()` function(`get_receipt` HTTP API) will return the status of the bridge process.

When it return non zero code, there are typically three cases

1. The hash you request is not found, maybe the user failed to send the txs.transferBody or there is a delay.

2. The hash you request is found, but the bridge process is still ongoing, you should try again later.

3. The hash you request is found, but the bridge process failed due to reasons like value out of range.