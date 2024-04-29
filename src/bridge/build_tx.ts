import { NetworkType, requestApi } from './common';
import { GetBuildTxPath } from './api';

export interface GetBuildTxRequest {
  tokenName: string;
  fromChainName: string;
  toChainName: string;
  uiValue: number;
  fromAddress: string;
  toAddress: string;
  channel: number;
}

export interface GetBuildTxResponse {
  tokenName: string;
  fromChainName: string;
  toChainName: string;
  uiInputValue: number;
  uiSendValue: number;
  uiReceiveValue: number;
  uiGasFee: number;
  uiBridgeFee: number;
  uiMinValue: number;
  uiMaxValue: number;
  networkType: NetworkType;
  txs: any;
}

export class BuildTxManager {
  async getBuilTx(req: GetBuildTxRequest): Promise<GetBuildTxResponse> {
    const tx = await requestApi(GetBuildTxPath, req);
    return tx;
  }
}
