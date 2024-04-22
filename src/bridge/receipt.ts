
import { RequestApi } from "./common"
import { getReceiptPath } from "./api"


export interface GetReceiptRequest {
    chainName: string
    hash: string
}

export interface GetReceiptResponse {

}

export class ReceiptManager {

    async GetReceipt(req: GetReceiptRequest): Promise<GetReceiptResponse> {

        const info = await RequestApi(getReceiptPath, req)

        return info
    }


}