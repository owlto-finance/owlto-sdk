import { requestApi } from './common';
import { GetReceiptPath } from './api';

export interface GetReceiptRequest {
  chainName: string;
  hash: string;
}

export class GetReceiptResponse {
  done: boolean; //false: processing, true: done(may be success or error)
  state: number; //0: success, others: error

  constructor(done: boolean, state: number) {
    this.done = done;
    this.state = state;
  }

  processing() {
    return !this.done;
  }

  ok() {
    return !this.processing() && this.state === 0;
  }

  failed() {
    return !this.processing() && this.state !== 0;
  }
}

export class ReceiptManager {
  async getReceipt(req: GetReceiptRequest): Promise<GetReceiptResponse> {
    const info = await requestApi(GetReceiptPath, req);
    return new GetReceiptResponse(info.done, info.state);
  }
}
