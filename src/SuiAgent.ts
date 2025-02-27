import {
  transfer as walletTransfer,
  type TransferParams,
} from './transfers/transfers.js';
import {
  supplyCollateral,
  type SupplyCollateralParams,
} from './navi/supply.js';
import { borrowAsset, type BorrowAssetParams } from './navi/borrow.js';
import { repayDebt, type RepayDebtParams } from './navi/repay.js';
import { swapExactInput, type SwapExactInputParams } from './navi/swap.js';
import { getOwnBalance, type GetOwnBalanceParams } from './navi/balance.js';

import { createAgent } from './agent.js';
import type { AgentExecutor } from 'langchain/agents';
import type { modelMapping } from './utils/models.js';

export interface SuiAgentConfig {
  walletPrivateKey: string;
  model: keyof typeof modelMapping;
  apiBaseUrl: string;
  openAiApiKey?: string;
  anthropicApiKey?: string;
  googleGeminiApiKey?: string;
}

export class SuiAgent {
  private walletPrivateKey: string;
  private agentExecutor: AgentExecutor;
  private model: keyof typeof modelMapping;
  private apiBaseUrl: string;
  private openAiApiKey?: string;
  private anthropicApiKey?: string;
  private googleGeminiApiKey?: string;

  constructor(config: SuiAgentConfig) {
    this.walletPrivateKey = config.walletPrivateKey;
    this.model = config.model;
    this.apiBaseUrl = config.apiBaseUrl;
    this.openAiApiKey = config.openAiApiKey;
    this.anthropicApiKey = config.anthropicApiKey;
    this.googleGeminiApiKey = config.googleGeminiApiKey;
    if (!this.walletPrivateKey) {
      throw new Error('Sui wallet private key is required.');
    }

    this.agentExecutor = createAgent(
      this,
      this.model,
      this.apiBaseUrl,
      this.openAiApiKey,
      this.anthropicApiKey,
      this.googleGeminiApiKey,
    );
  }

  getCredentials() {
    return {
      walletPrivateKey: this.walletPrivateKey,
      openAiApiKey: this.openAiApiKey || '',
      anthropicApiKey: this.anthropicApiKey || '',
      googleGeminiApiKey: this.googleGeminiApiKey || '',
    };
  }

  async execute(input: string) {
    const response = await this.agentExecutor.invoke({
      input,
    });

    return response;
  }

  async transfer(params: TransferParams) {
    return await walletTransfer(params, this.walletPrivateKey);
  }

  async supplyCollateral(params: SupplyCollateralParams) {
    return await supplyCollateral(params, this.walletPrivateKey);
  }

  async borrowAsset(params: BorrowAssetParams) {
    return await borrowAsset(params, this.walletPrivateKey);
  }

  async repayDebt(params: RepayDebtParams) {
    return await repayDebt(params, this.walletPrivateKey);
  }

  async swapExactInput(params: SwapExactInputParams) {
    return await swapExactInput(params, this.walletPrivateKey);
  }

  async getOwnBalance(params: GetOwnBalanceParams) {
    return await getOwnBalance(params, this.walletPrivateKey);
  }
}

