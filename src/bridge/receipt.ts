
import { requestApi } from "./common"
import { GetReceiptPath } from "./api"


export interface GetReceiptRequest {
    chainName: string
    hash: string
}

export interface GetReceiptResponse {

}

export class ReceiptManager {

    async getReceipt(req: GetReceiptRequest): Promise<GetReceiptResponse> {
        const info = await requestApi(GetReceiptPath, req)
        return info
    }


}