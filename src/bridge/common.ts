import { request } from '../utils';
import { BaseApiPath } from './api';

export enum NetworkType {
  NetworkTypeUnknown = 0,
  NetworkTypeEthereum = 1,
  NetworkTypeStarknet = 2,
  NetworkTypeSolana = 3,
}

export enum BridgeStatus {
  BridgeStatusOk = 0,
  BridgeStatusChainNotFound = -101,
  BridgeStatusChainUnsupported = -102,
  BridgeStatusNoPair = -103,
  BridgeStatusValueOutOfRange = -104,
  BridgeStatusTokenUnsupported = -105,
  BridgeStatusBuildTxError = -106,
  BridgeStatusTxProcessing = -201,
  BridgeStatusTxNotFound = -202,
  BridgeStatusHttpError = -901,
}

export interface ApiStatus {
  code: number;
  message: string;
}

export interface ApiResult {
  status: ApiStatus;
  data: any;
}

export class ApiError extends Error {
  constructor(public readonly status: ApiStatus) {
    super(`api return code = ${status.code}, msg = ${status.message}`);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export async function requestApi(api: string, body?: any) {
  let result: ApiResult = await request(BaseApiPath + api, body);
  if (result.status.code !== 0) {
    throw new ApiError(result.status);
  } else {
    return result.data;
  }
}

export interface BridgePair {
  tokenName: string;
  fromChainName: string;
  toChainName: string;
}

export interface BridgeSrc {
  chainName: string;
  hash: string;
}
