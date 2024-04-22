import { ApiError, BridgePair, BridgeStatus } from './common';
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
  private options: BridgeOptions;
  private pairInfoMgr: PairInfoManager;
  private feeInfoMgr: FeeInfoManager;
  private buildTxMgr: BuildTxManager;
  private receiptMgr: ReceiptManager;

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

  async getPairInfo(bridgePair: BridgePair) {
    const result = await this.pairInfoMgr.getPairInfo({
      bridgePair,
    });
    return result;
  }

  async getAllPairInfos() {
    const result = await this.pairInfoMgr.getAllPairInfos({});
    return result;
  }

  async getFeeInfo(bridgePair: BridgePair, uiValue: number) {
    const result = await this.feeInfoMgr.getFeeInfo({
      bridgePair,
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
    const result = await this.receiptMgr.getReceipt({
      chainName: chainName,
      hash: hash,
    });
    return result;
  }

  async waitReceipt(chainName: string, hash: string) {
    const interval = 5000;
    let timeout = interval * 20;

    while (true) {
      timeout -= interval;
      await sleep(interval);

      try {
        await this.receiptMgr.getReceipt({
          chainName: chainName,
          hash: hash,
        });
        return true;
      } catch (error) {
        if (error instanceof ApiError) {
          if (error.status.code === BridgeStatus.BridgeStatusTxProcessing) {
            continue;
          } else if (
            error.status.code === BridgeStatus.BridgeStatusTxNotFound
          ) {
            if (timeout <= 0) {
              throw error;
            }
          } else if (error.status.code === BridgeStatus.BridgeStatusTxFailed) {
            throw error;
          }
        } else {
          throw error;
        }
      }
    }
  }
}
