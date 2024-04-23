import { ApiError, BridgeStatus } from './common';
import { FeeInfoManager } from './fee_info';
import { PairInfoManager } from './pair_info';
import { ReceiptManager } from './receipt';
import { BuildTxManager } from './build_tx';
import { sleep } from '../utils';

export interface BridgeOptions {
  channel: number;
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
    toChainName: string
  ) {
    fromChainName = this.getMappedChainName(fromChainName);
    toChainName = this.getMappedChainName(toChainName);
    const result = await this.pairInfoMgr.getPairInfo({
      bridgePair: {
        tokenName: tokenName,
        fromChainName: fromChainName,
        toChainName: toChainName,
      },
    });
    return result;
  }

  async getAllPairInfos() {
    const result = await this.pairInfoMgr.getAllPairInfos({});
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
      bridgePair: {
        tokenName: tokenName,
        fromChainName: fromChainName,
        toChainName: toChainName,
      },
      uiValue,
    });
    return result;
  }

  async getBuildTx(
    tokenName: string,
    fromChainName: string,
    toChainName: string,
    uiValue: number,
    fromAddress: string,
    toAddress: string
  ) {
    fromChainName = this.getMappedChainName(fromChainName);
    toChainName = this.getMappedChainName(toChainName);
    const result = await this.buildTxMgr.getBuilTx({
      bridgePair: {
        tokenName,
        fromChainName,
        toChainName,
      },
      uiValue,
      fromAddress,
      toAddress,
      channel: this.options.channel,
    });
    return result;
  }

  async getReceipt(chainName: string, hash: string) {
    chainName = this.getMappedChainName(chainName);
    const result = await this.receiptMgr.getReceipt({
      chainName: chainName,
      hash: hash,
    });
    return result;
  }

  // wait for the bridge result
  // return the result when bridge done(either ok or failed)
  // throw error if the user transfered hash is not found in timeout
  // throw err if other unexpected error happened
  async waitReceipt(chainName: string, hash: string) {
    chainName = this.getMappedChainName(chainName);
    const interval = 5000;
    let srcWaitTime = interval * 20;
    while (true) {
      await sleep(interval);
      srcWaitTime -= interval;
      try {
        const result = await this.receiptMgr.getReceipt({
          chainName: chainName,
          hash: hash,
        });
        if (result.processing()) {
          continue;
        }
        return result;
      } catch (error) {
        if (
          error instanceof ApiError &&
          error.status.code === BridgeStatus.BridgeStatusTxNotFound &&
          srcWaitTime > 0
        ) {
          continue;
        }
        throw error;
      }
    }
  }
}
