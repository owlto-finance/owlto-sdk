
import { BridgePair, NetworkType, RequestApi } from "./common"
import { getBuildTxPath } from "./api"


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

    async GetBuilTx(req: GetBuildTxRequest): Promise<GetBuildTxResponse> {

        const tx = await RequestApi(getBuildTxPath, req)

        return tx
    }


}