# owlto-sdk

Owlto-Sdk is a library used to bridge token between multiple chains

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
Map your chain names to Owlto chain names.

For example, if you named Base Mainnet as "Base", you can set `chainNameMapping["Base"] = "BaseMainnet"`.

Then you can use "Base" as chain name in every function of bridge.


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
TODO

#### 3.Solana
TODO


## Get receipt

1. `bridge.waitReceipt(fromChainHash: string)`

2. `bridge.getReceipt(fromChainHash: string)`

hash is the transfer transaction hash previously describe.

waitReceipt wait for the bridge process to be done. Throw error if the hash is not found for 1 minute or failed

getReceipt get the bridge process status, Throw error if hash is not found, bridge in progress or failed.

## Get pair info

1. `bridge.getPairInfo(tokenName: string, fromChainName: string, toChainName: string)`

2. `bridge.getAllPairInfos()`

A pair consists of three component: `token name`, `from chain name`, `to chain name`.

You can only bridge supported pairs


## Http Api Documentation

Please visit: https://owlto.finance/bridge_api/v1/swagger/index.html .


## Q&A

### How do I know which token can be bridged between which chains?
You can simply called the `bridge.getAllPairInfos()` function(`get_all_pair_infos` Http Api) 

it will return a list of bridgeable pairs for each supported token


### What does build tx do?
The `bridge.getBuildTx()` function(`get_build_tx` Http Api) will return all the transactions needed when bridging.

For example, if you bridge USDC from Base to Scroll for the first time, it will return two transactions in the txs field

1. txs.approveBody, this will let you make an approve to Owlto contract first.(Will be null if the allowance is enough)

2. txs.transferBody, this will actually transfer the USDC token to the Owlto contract on Base chain.

The transactions are in ETH JSON format and are ready to be sent by library like "Ethers".


### Why get receipt return error code?
The `bridge.getReceipt()` function(`get_receipt` Http Api) will return the status of the bridge process.

When it return non zero code, there are typically three cases

1. The hash you request is not found, maybe the user failed to send the txs.transferBody or there is a delay.

2. The hash you request is found, but the bridge process is still ongoing, you should try again later.

3. The hash you request is found, but the bridge process failed due to reasons like value out of range.