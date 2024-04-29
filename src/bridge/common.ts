import { request } from '../utils';
import { BaseApiPath } from './api';
import { snakeToCamel, camelToSnake } from '../utils/common';

export enum NetworkType {
  NetworkTypeUnknown = 0,
  NetworkTypeEthereum = 1,
  NetworkTypeStarknet = 2,
  NetworkTypeSolana = 3,
  NetworkTypeBitcoin = 4,
}

export enum BridgeStatus {
  BridgeStatusOk = 0,
  BridgeStatusChainNotFound = 901,
  BridgeStatusChainUnsupported = 902,
  BridgeStatusNoPair = 903,
  BridgeStatusValueOutOfRange = 904,
  BridgeStatusTokenUnsupported = 905,
  BridgeStatusBuildTxError = 906,
  BridgeStatusTxNotFound = 907,
  BridgeStatusBridgeProcessing = 908,
  BridgeStatusBridgeFailed = 909,
  BridgeStatusHttpError = 999,
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
  if (body) {
    body = camelToSnake(body);
  }
  let result: ApiResult = await request(BaseApiPath + api, body);
  if (result) {
    result = snakeToCamel(result);
  }
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
