"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const owlto = __importStar(require("owlto-sdk"));
const ethers = __importStar(require("ethers"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            channel: 910325 // your channel id
        };
        let bridge = new owlto.Bridge(options);
        try {
            const result = yield bridge.getBuildTx("USDC", //token name
            "BaseMainnet", //from chain name
            "ScrollMainnet", // to chain name
            1, // value
            "0xa5E56D455BF247C475D752721Ba35A0c85Df81Dc", // from address
            "0xa5E56D455BF247C475D752721Ba35A0c85Df81Dc");
            console.log(result);
            const provider = ethers.getDefaultProvider("https://mainnet.base.org");
            // Your private key (make sure to keep it secure)
            const privateKey = "YOUR_PRIVATE_KEY";
            // Create a wallet instance
            const wallet = new ethers.Wallet(privateKey, provider);
            // type of the from chain, only ethereum is supported
            if (result.networkType != owlto.NetworkType.NetworkTypeEthereum) {
                return;
            }
            // if need approve, Send approve transaction first
            if (result.txs.approveBody) {
                console.log("find approve");
                const tx = yield wallet.sendTransaction(result.txs.approveBody);
                console.log("Approve Transaction hash:", tx.hash);
                yield tx.wait(); // Wait for the transaction to be mined
                console.log("Approve Transaction confirmed!");
            }
            // Send the transfer transaction
            const tx = yield wallet.sendTransaction(result.txs.transferBody);
            console.log("Transfer Transaction hash:", tx.hash);
            yield tx.wait(); // Wait for the transaction to be mined
            console.log("Transfer Transaction confirmed!");
            const receipt = yield bridge.waitReceipt("BaseMainnet", tx.hash);
            if (receipt.ok()) {
                console.log("cross chain done");
            }
            else {
                console.log("cross chain failed:", receipt.state);
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
main();
