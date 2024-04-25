# owlto-sdk

Owlto-Sdk is a library used to bridge token between multiple chains

## Quickstart

For example, to bridge USDC from Base to Scroll
```TypeScript
// constructor
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

//...
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

