

import * as owlto from "owlto-sdk";
import * as ethers from "ethers";

async function main() {
    const options: owlto.BridgeOptions = {}

    let bridge = new owlto.Bridge(options);

    try {
        const result = await bridge.getBuildTx(
            "USDC", //token name
            "BaseMainnet", //from chain name
            "ScrollMainnet",// to chain name
            "1.2", // value
            "0xa5E56D455BF247C475D752721Ba35A0c85Df81Dc", // from address
            "0xa5E56D455BF247C475D752721Ba35A0c85Df81Dc", // to address
        );

        console.log(result);

        const provider = ethers.getDefaultProvider("https://mainnet.base.org");

        // Your private key (make sure to keep it secure)
        const privateKey = "YOUR_PRIVATE_KEY";

        // Create a wallet instance
        const wallet = new ethers.Wallet(privateKey, provider);

        // type of the from chain, only ethereum is supported
        if (result.networkType != owlto.NetworkType.NetworkTypeEthereum) {
            return
        }

        // if need approve, Send approve transaction first
        if (result.txs.approveBody) {
            console.log("find approve");
            const tx = await wallet.sendTransaction(result.txs.approveBody as ethers.TransactionRequest);
            console.log("Approve Transaction hash:", tx.hash);
            await tx.wait(); // Wait for the transaction to be mined
            console.log("Approve Transaction confirmed!");
        }

        // Send the transfer transaction
        const tx = await wallet.sendTransaction(result.txs.transferBody as ethers.TransactionRequest);
        console.log("Transfer Transaction hash:", tx.hash);
        await tx.wait(); // Wait for the transaction to be mined
        console.log("Transfer Transaction confirmed!");

        const receipt = await bridge.waitReceipt(tx.hash)
        console.log("cross chain done : ", receipt);

    } catch (error) {
        console.log(error);
    }
}
main();