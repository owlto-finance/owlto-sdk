import { BridgeValue, NetworkType, requestApi } from './common';
import { GetBuildTxPath } from './api';

export interface GetBuildTxRequest {
  tokenName: string;
  fromChainName: string;
  toChainName: string;
  uiValue: string;
  fromAddress: string;
  toAddress: string;
  channel: number;
  valueIncludeGasFee: boolean;
}

export interface GetBuildTxResponse {
  tokenName: string;
  fromChainName: string;
  toChainName: string;
  inputValue: BridgeValue;
  sendValue: BridgeValue;
  receiveValue: BridgeValue;
  gasFee: BridgeValue;
  bridgeFee: BridgeValue;
  minValue: BridgeValue;
  maxValue: BridgeValue;
  networkType: NetworkType;
  txs: any;
}

export class BuildTxManager {
  async getBuilTx(req: GetBuildTxRequest): Promise<GetBuildTxResponse> {
    const tx = await requestApi(GetBuildTxPath, req);
    return tx;
  }
}
