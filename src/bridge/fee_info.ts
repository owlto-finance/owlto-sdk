
import { BridgePair, RequestApi } from "./common"
import { getFeeInfoPath } from "./api"


export interface GetFeeInfoRequest {
    bridgePair: BridgePair
    uiValue: number
}

export interface GetFeeInfoResponse {
    uiFee: number
}

export class FeeInfoManager {

    async GetFeeInfo(req: GetFeeInfoRequest): Promise<GetFeeInfoResponse> {

        const info = await RequestApi(getFeeInfoPath, req)

        return info
    }


}