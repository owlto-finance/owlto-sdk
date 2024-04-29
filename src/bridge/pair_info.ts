import { requestApi } from './common';
import { GetAllPairInfosPath, GetPairInfoPath } from './api';

export interface GetPairInfoRequest {
  tokenName: string;
  fromChainName: string;
  toChainName: string;
}

export interface GetPairInfoResponse {
  uiMinValue: number;
  uiMaxValue: number;
}

export interface GetAllPairInfosRequest {
  category: string;
}

export interface GetAllPairInfosResponse {
  pairInfos: {
    tokenName: string;
    fromChainName: string;
    toChainName: string;
    fromChainId: string;
    toChainId: string;
    fromTokenAddress: string;
    toTokenAddress: string;
    fromTokenDecimals: number;
    toTokenDecimals: number;
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
