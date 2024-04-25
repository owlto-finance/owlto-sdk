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

//result:
{
  uiFee: 0.1;
  uiMinValue: 1;
  uiMaxValue: 300;
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
Return the bridge result: `token name`, `from chain name`, `to chain name`.

You can only bridge supported pairs, there are two ways to find out supported pair:

1. `bridge.getPairInfo(tokenName: string, fromChainName: string, toChainName: string)`

2. `bridge.getAllPairInfos()`

## Get pair info
A pair consists of three component: `token name`, `from chain name`, `to chain name`.

You can only bridge supported pairs, there are two ways to find out supported pair:

1. `bridge.getPairInfo(tokenName: string, fromChainName: string, toChainName: string)`

2. `bridge.getAllPairInfos()`

## Get fee info
`bridge.getFeeInfo(tokenName: string, fromChainName: string, toChainName: string, uiValue: number) `
Return the fee user need to pay for a give pair and amount.

For example, if user want to bridge 10 USDC from Base to Scroll.

The fee may return 1.5, indicate a total value of 11.5 USDC to transfer in the transaction

## Http Api Example

### Get all pair info
```shell
curl -X POST https://owlto.finance/api/bridge_api/v1/get_all_pair_infos
  -d '{
    # category = "mainnet" | "testnet"
    "category": "mainnet"  
  }'
```

Return data:
```json
{
    "status": {
        "code": 0,
        "message": ""
    },
    "data": {
        "pairInfos": [
            {
                "bridgePair": {
                    "tokenName": "BNB",
                    "fromChainName": "BnbMainnet",
                    "toChainName": "OpbnbMainnet"
                },
                "uiMinValue": 0.0001,
                "uiMaxValue": 1,
                "bridgeFeeRatio": 0
            },
            {
                "bridgePair": {
                    "tokenName": "BNB",
                    "fromChainName": "OpbnbMainnet",
                    "toChainName": "BnbMainnet"
                },
                "uiMinValue": 0.0001,
                "uiMaxValue": 1,
                "bridgeFeeRatio": 0
            }
        ]
    }
}
```

### Get build tx 
```markdown
curl -X POST https://owlto.finance/api/bridge_api/v1/get_build_tx
  -d '{
    "bridgePair": {
      "tokenName": "USDC",
      "fromChainName": "BaseMainnet",
      "toChainName": "ScrollMainnet"
    },
    "uiValue": 1,
    "fromAddress": "0xa5E56D455BF247C475D752721Ba35A0c85Df81Dc",
    "toAddress": "0xa5E56D455BF247C475D752721Ba35A0c85Df81Dc",
    "channel": 12345
  }'
```

Return data:
```json
{
    "status": {
        "code": 0,
        "message": ""
    },
    "data": {
        "uiFee": 1.5,
        "uiMinValue": 1,
        "uiMaxValue": 300,
        "networkType": 1,
        "txs": {
            "approveBody": null,
            "transferBody": {
                "data": "0xfc18063800000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000833589fcd6edb6e08f4c7c32d4f71b54bda029130000000000000000000000005e809a85aa182a9921edd10a4163745bb3e3628400000000000000000000000000000000000000000000000000000000002625a000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000003039000000000000000000000000000000000000000000000000000000000000002a30786135453536443435354246323437433437354437353237323142613335413063383544663831446300000000000000000000000000000000000000000000",
                "from": "0xa5E56D455BF247C475D752721Ba35A0c85Df81Dc",
                "to": "0xC626845BF4E6a5802Ef774dA0B3DfC6707F015F7",
                "value": "0"
            }
        }
    }
}
```

### Get receipt
```markdown
curl -X POST https://owlto.finance/api/bridge_api/v1/get_receipt
  -d '{
    "chainName": "BaseMainnet",
    "hash": "0x00001fd96f18783cd72f2f3682a9cfda652b5eb4258cf5f48d5453df091e003d"
  }'
```

Return data:
```json
{
    "status": {
        "code": 0,
        "message": ""
    },
    "data": {
        "done": true,
        "state": 0
    }
}
```
