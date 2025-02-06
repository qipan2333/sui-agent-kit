import { tool } from '@langchain/core/tools';
import { z } from 'zod';

// Import functions
import { transfer } from './transfers/transfers.js';


// Types
type SuiAgentInterface = {
  getCredentials: () => { walletPrivateKey: string };
};

/**
 * Wraps a function to inject the wallet private key from the agent
 * @param fn - The function to wrap
 * @param agent - The SuiAgent instance containing credentials
 */
const withWalletKey = <T>(
  fn: (params: T, privateKey: string) => Promise<any>,
  agent: SuiAgentInterface,
) => {
  return (params: T) => fn(params, agent.getCredentials().walletPrivateKey);
};

// Schema definitions
const transferSchema = z.object({
  to: z.string().describe('The wallet address to transfer to'),
  amount: z.string().describe('The amount to transfer'),
  symbol: z.string().describe('The asset symbol to transfer. eg. USDC'),
});

const swapSchema = z.object({
  amount: z.string().describe('The amount to swap'),
  fromSymbol: z
    .string()
    .describe('The asset symbol to swap from. eg. USDC'),
  toSymbol: z.string().describe('The asset symbol to swap to. eg. USDC'),
  slippage: z
    .number()
    .optional()
    .describe('Slippage tolerance (default: 0.01 for 1%)'),
});

const supplyCollateralSchema = z.object({
  amount: z.string().describe('The amount to lend'),
  symbol: z.string().describe('The asset symbol to lend. eg. USDC'),
});

const borrowAssetSchema = z.object({
  amount: z.string().describe('The amount to borrow'),
});

const addLiquiditySchema = z.object({
  amount0: z.string().describe('The amount of the first asset to add'),
  asset0Symbol: z.string().describe('The symbol of the first asset'),
  asset1Symbol: z.string().describe('The symbol of the second asset'),
  slippage: z
    .number()
    .optional()
    .describe('Slippage tolerance (default: 0.01 for 1%)'),
});

const getOwnBalanceSchema = z.object({
  symbol: z
    .string()
    .describe('The asset symbol to get the balance of. eg. USDC'),
});

const getBalanceSchema = z.object({
  walletAddress: z
    .string()
    .describe('The wallet address to get the balance of'),
  assetSymbol: z
    .string()
    .describe('The asset symbol to get the balance of. eg. USDC'),
});

/**
 * Creates and returns all tools with injected agent credentials
 */
export const createTools = (agent: SuiAgentInterface) => [
  tool(withWalletKey(transfer, agent), {
    name: 'sui_transfer',
    description: 'Transfer any verified Sui asset to another wallet',
    schema: transferSchema,
  }),
];
