import { BridgePair, requestApi } from './common';
import { GetAllPairInfosPath, GetPairInfoPath } from './api';

export interface GetPairInfoRequest {
  bridgePair: BridgePair;
}

export interface GetPairInfoResponse {
  uiMinValue: number;
  uiMaxValue: number;
}

export interface GetAllPairInfosRequest {}

export interface GetAllPairInfosResponse {
  pairInfos: {
    bridgePair: BridgePair;
    uiMinValue: number;
    uiMaxValue: number;
  }[];
}

export class PairInfoManager {
  async getPairInfo(req: GetPairInfoRequest): Promise<GetPairInfoResponse> {
    const info = await requestApi(GetPairInfoPath, req);
    return info;
  }

  async getAllPairInfos(
    req: GetAllPairInfosRequest
  ): Promise<GetAllPairInfosResponse> {
    const info = await requestApi(GetAllPairInfosPath, req);
    return info;
  }
}
