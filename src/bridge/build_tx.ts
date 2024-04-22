
import { BridgePair, NetworkType, requestApi } from "./common"
import { GetBuildTxPath } from "./api"


export interface GetBuildTxRequest {
    bridgePair: BridgePair
    uiValue: number
    fromAddress: string
    toAddress: string
    channel: number
}

export interface GetBuildTxResponse {
    uiFee: number
    uiMinValue: number
    uiMaxValue: number
    networkType: NetworkType
    txs: any
}

export class BuildTxManager {

    async getBuilTx(req: GetBuildTxRequest): Promise<GetBuildTxResponse> {
        const tx = await requestApi(GetBuildTxPath, req)
        return tx
    }

}