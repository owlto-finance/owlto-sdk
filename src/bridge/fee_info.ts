import { BridgePair, requestApi } from './common';
import { GetFeeInfoPath } from './api';

export interface GetFeeInfoRequest {
  bridgePair: BridgePair;
  uiValue: number;
}

export interface GetFeeInfoResponse {
  uiFee: number;
}

export class FeeInfoManager {
  async getFeeInfo(req: GetFeeInfoRequest): Promise<GetFeeInfoResponse> {
    const info = await requestApi(GetFeeInfoPath, req);
    return info;
  }
}
