
import { BridgePair, RequestApi } from "./common"
import { getAllPairInfosPath, getPairInfoPath } from "./api"


export interface GetPairInfoRequest {
    bridgePair: BridgePair
}

export interface GetPairInfoResponse {
    uiMinValue: number
    uiMaxValue: number
}

export interface GetAllPairInfosResponse {
    pairInfos : { bridgePair: BridgePair, uiMinValue: number, uiMaxValue: number }[]
}


export class PairInfoManager {

    async GetPairInfo(req: GetPairInfoRequest): Promise<GetPairInfoResponse> {

        const info = await RequestApi(getPairInfoPath, req)

        return info
    }

    async GetAllPairsInfos(): Promise<GetAllPairInfosResponse> {

        const info = await RequestApi(getAllPairInfosPath, {})

        return info
    }


}