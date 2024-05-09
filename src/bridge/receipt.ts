import { BridgeValue, requestApi } from './common';
import { GetReceiptPath } from './api';

export interface GetReceiptRequest {
  fromChainHash: string;
}

export interface GetReceiptResponse {
  toChainHash: string;
  userSendValue: BridgeValue;
  userReceiveValue: BridgeValue;
  fromChainTokenAddress: string;
  toChainTokenAddress: string;
}

export class ReceiptManager {
  async getReceipt(req: GetReceiptRequest): Promise<GetReceiptResponse> {
    const info = await requestApi(GetReceiptPath, req);
    return info;
  }
}
