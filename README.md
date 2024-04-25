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

const options: owlto.BridgeOptions = {
    channel: 910325  // your channel id
}
let bridge = new owlto.Bridge(options);

const result = await bridge.getBuildTx(
    "USDC", //token name
    "BaseMainnet", //from chain name
    "ScrollMainnet",// to chain name
    1, // value
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

const receipt = await bridge.waitReceipt("BaseMainnet", tx.hash)
console.log(receipt.ok())
```
For more details, check the example/bridge_usdc folder.


## Bridge options

### 1.channel (number | required)
Your identification for revenue share.
### 2.chainNameMapping (Map<string, string> | optional) 
Map your chain names to Owlto chain names.

For example, if you named Base Mainnet as "Base", you can set `chainNameMapping["Base"] = "BaseMainnet"`.

Then you can use "Base" as chain name in every function of bridge.

## Get build tx
```typescript
const result = await bridge.getBuildTx(
    "USDC", //token name
    "BaseMainnet", //from chain name
    "ScrollMainnet",// to chain name
    1, // value
    "0xa5E56D455BF247C475D752721Ba35A0c85Df81Dc", // from address
    "0xa5E56D455BF247C475D752721Ba35A0c85Df81Dc", // to address
);
```
Return the transactions user should send to `from chain` when bridging.

#### 1.Evm
- ##### result.approveBody 
    The approve transaction, if any, should be sent first.
- ##### result.transferBody
    The actual transfer transaction.

#### 2.Starknet
TODO

#### 3.Solana
TODO


## Get pair info
A pair consists of three component: `token name`, `from chain name`, `to chain name`.

You can only bridge supported pairs, there are two ways to find out supported pair:

1. `bridge.getPairInfo(tokenName: string, fromChainName: string, toChainName: string)`

2. `bridge.getAllPairInfos()`

## Get fee info
Return the fee user need to pay for a give pair and amount.

For example, if user want to bridge 10 USDC from Base to Scroll.

The fee info may return 1.5, indicate a total value of 11.5 USDC to transfer in the transaction