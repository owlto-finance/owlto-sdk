import { requestApi } from './common';
import { GetFeeInfoPath } from './api';

export interface GetFeeInfoRequest {
  tokenName: string;
  fromChainName: string;
  toChainName: string;
  uiValue: number;
}

export interface GetFeeInfoResponse {
  uiGasFee: number;
  uiBridgeFee: number;
}

export class FeeInfoManager {
  async getFeeInfo(req: GetFeeInfoRequest): Promise<GetFeeInfoResponse> {
    const info = await requestApi(GetFeeInfoPath, req);
    return info;
  }
}
