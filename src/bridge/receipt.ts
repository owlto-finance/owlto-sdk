import { requestApi } from './common';
import { GetReceiptPath } from './api';

export interface GetReceiptRequest {
  fromChainName: string;
  fromChainHash: string;
}

export interface GetReceiptResponse {
  toChainHash: string;
}

export class ReceiptManager {
  async getReceipt(req: GetReceiptRequest): Promise<GetReceiptResponse> {
    const info = await requestApi(GetReceiptPath, req);
    return info;
  }
}
