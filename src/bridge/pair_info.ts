import { BridgeValue, requestApi } from './common';
import { GetAllPairInfosPath, GetPairInfoPath } from './api';

export interface PairInfo {
  tokenName: string;
  fromChainName: string;
  toChainName: string;
  fromChainId: string;
  toChainId: string;
  fromTokenAddress: string;
  toTokenAddress: string;
  fromTokenDecimals: number;
  toTokenDecimals: number;
  minValue: BridgeValue;
  maxValue: BridgeValue;
  contractAddress: string;
}

export interface GetPairInfoRequest {
  tokenName: string;
  fromChainName: string;
  toChainName: string;
  valueIncludeGasFee: boolean;
}

export interface GetAllPairInfosRequest {
  category: string;
  valueIncludeGasFee: boolean;
}

export interface GetAllPairInfosResponse {
  pairInfos: PairInfo[];
}

export class PairInfoManager {
  async getPairInfo(req: GetPairInfoRequest): Promise<PairInfo> {
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
