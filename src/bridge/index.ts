import { ApiError, BridgeStatus } from './common';
import { FeeInfoManager } from './fee_info';
import { PairInfoManager } from './pair_info';
import { ReceiptManager } from './receipt';
import { BuildTxManager } from './build_tx';
import { sleep } from '../utils';

export interface BridgeOptions {
  channel?: number;
  chainNameMapping?: Map<string, string>;
}

export class Bridge {
  readonly options: BridgeOptions;
  readonly pairInfoMgr: PairInfoManager;
  readonly feeInfoMgr: FeeInfoManager;
  readonly buildTxMgr: BuildTxManager;
  readonly receiptMgr: ReceiptManager;

  constructor(options: BridgeOptions) {
    this.options = options;

    this.pairInfoMgr = new PairInfoManager();
    this.feeInfoMgr = new FeeInfoManager();
    this.buildTxMgr = new BuildTxManager();
    this.receiptMgr = new ReceiptManager();
  }

  private getMappedChainName(userChainName: string) {
    if (this.options && this.options.chainNameMapping) {
      let name = this.options.chainNameMapping.get(userChainName);
      return name ? name : userChainName;
    } else {
      return userChainName;
    }
  }

  async getPairInfo(
    tokenName: string,
    fromChainName: string,
    toChainName: string,
    valueIncludeGasFee: boolean = false
  ) {
    fromChainName = this.getMappedChainName(fromChainName);
    toChainName = this.getMappedChainName(toChainName);
    const result = await this.pairInfoMgr.getPairInfo({
      tokenName: tokenName,
      fromChainName: fromChainName,
      toChainName: toChainName,
      valueIncludeGasFee: valueIncludeGasFee,
    });
    return result;
  }

  async getAllPairInfos(
    category?: string,
    valueIncludeGasFee: boolean = false
  ) {
    const result = await this.pairInfoMgr.getAllPairInfos({
      category: category ? category : '',
      valueIncludeGasFee: valueIncludeGasFee,
    });
    return result;
  }

  async getFeeInfo(
    tokenName: string,
    fromChainName: string,
    toChainName: string,
    uiValue: number
  ) {
    fromChainName = this.getMappedChainName(fromChainName);
    toChainName = this.getMappedChainName(toChainName);
    const result = await this.feeInfoMgr.getFeeInfo({
      tokenName: tokenName,
      fromChainName: fromChainName,
      toChainName: toChainName,

      uiValue,
    });
    return result;
  }

  async getBuildTx(
    tokenName: string,
    fromChainName: string,
    toChainName: string,
    uiValue: string,
    fromAddress: string,
    toAddress: string,
    valueIncludeGasFee: boolean = false
  ) {
    fromChainName = this.getMappedChainName(fromChainName);
    toChainName = this.getMappedChainName(toChainName);
    const result = await this.buildTxMgr.getBuilTx({
      tokenName,
      fromChainName,
      toChainName,
      uiValue,
      fromAddress,
      toAddress,
      channel: this.options.channel ?? 0 ,
      valueIncludeGasFee: valueIncludeGasFee,
    });
    return result;
  }

  async getReceipt(fromChainHash: string) {
    const result = await this.receiptMgr.getReceipt({
      fromChainHash: fromChainHash,
    });
    return result;
  }

  // wait for the bridge result
  async waitReceipt(fromChainHash: string) {
    const interval = 5000;
    let srcWaitTime = interval * 20;
    while (true) {
      await sleep(interval);
      srcWaitTime -= interval;
      try {
        const result = await this.receiptMgr.getReceipt({
          fromChainHash: fromChainHash,
        });
        return result;
      } catch (error) {
        if (error instanceof ApiError) {
          if (
            error.status.code === BridgeStatus.BridgeStatusTxNotFound &&
            srcWaitTime > 0
          ) {
            continue;
          }

          if (error.status.code === BridgeStatus.BridgeStatusBridgeProcessing) {
            continue;
          }
        }

        throw error;
      }
    }
  }
}
