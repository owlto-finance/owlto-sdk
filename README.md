# owlto-sdk

Owlto-Sdk is a library used to bridge token between multiple chains

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
For more details, check the example/bridge_usdc folder

## Reference
### Bridge options
Bridge can have 2 options:
1. channel (required), user's identification for revenue share
2. chainNameMapping (optional), map user's chain names to Owlto chain names, for example, if user named Base Mainnet as "Base", you can set chainNameMapping["Base"] = "BaseMainnet", then you can use "Base" as chain name in every function of bridge, the bridge internal will convert "Base" to : "BaseMainnet"  which is Owlto's internal name for Base Mainnet, without this mapping, you need to write "BaseMainnet" as chain name

### Get pair info
A pair info consists of three component: token name, from chain name, to chain name.
You can only bridge supported pairs, there are two ways to find out which pairs are supported

1. bridge.getPairInfo(tokenName: string, fromChainName: string, toChainName: string)

2. bridge.getAllPairInfos()
