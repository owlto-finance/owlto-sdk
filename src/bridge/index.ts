
import { ApiError, BridgePair, BridgeStatus } from "./common";
import { FeeInfoManager, GetFeeInfoRequest } from "./fee_info";
import { GetPairInfoRequest, PairInfoManager } from "./pair_info";
import { ReceiptManager } from "./receipt";
import { BuildTxManager, GetBuildTxRequest } from "./build_tx";
import { Sleep } from "../utils";

export interface BridgeOptions {
    channel: number
    chainNameMapping?: Map<string, string>
}


export class Bridge {
    private options: BridgeOptions
    private pairInfoMgr: PairInfoManager
    private feeInfoMgr: FeeInfoManager
    private buildTxMgr: BuildTxManager
    private receiptMgr: ReceiptManager

    constructor(options: BridgeOptions) {

        this.options = options

        this.pairInfoMgr = new PairInfoManager()
        this.feeInfoMgr = new FeeInfoManager()
        this.buildTxMgr = new BuildTxManager()
        this.receiptMgr = new ReceiptManager()
    }

    private GetMappedChainName(userChainName: string) {
        if (this.options && this.options.chainNameMapping) {
            let name = this.options.chainNameMapping.get(userChainName)
            return name ? name : userChainName
        } else {
            return userChainName
        }
    }

    async GetPairInfo(bridgePair: BridgePair) {
        const result = await this.pairInfoMgr.GetPairInfo({
            bridgePair
        })
        return result
    }

    async GetAllPairInfos() {
        const result = await this.pairInfoMgr.GetAllPairsInfos()
        return result
    }

    async GetFeeInfo(bridgePair: BridgePair, uiValue: number) {
        const result = await this.feeInfoMgr.GetFeeInfo({
            bridgePair,
            uiValue
        })
        return result
    }

    async GetBuildTx(tokenName: string, fromChainName: string, toChainName: string,
        uiValue: number, fromAddress: string, toAddress: string) {
        const result = await this.buildTxMgr.GetBuilTx({
            bridgePair: {
                tokenName,
                fromChainName,
                toChainName,
            },
            uiValue,
            fromAddress,
            toAddress,
            channel: this.options.channel
        })
        return result
    }

    async WaitReceipt(chainName: string, hash: string)  {
        const interval = 5000
        let timeout = interval * 20

        while (true) {
            timeout -= interval
            await Sleep(interval);

            try {
                const result = await this.receiptMgr.GetReceipt({
                    chainName: chainName,
                    hash: hash
                })
                return true
            } catch (error) {
                if (error instanceof ApiError) {
                    if (error.status.code == BridgeStatus.BridgeStatusTxProcessing) {
                        continue
                    } else if (error.status.code == BridgeStatus.BridgeStatusTxNotFound) {
                        if (timeout <= 0) {
                            throw error;
                        }
                    } else if (error.status.code == BridgeStatus.BridgeStatusTxFailed) {
                        throw error;
                    }
                } else {
                    throw error
                }
            }
        }
    }

}