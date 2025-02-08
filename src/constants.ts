import type { CoinInfo } from 'navi-sdk/dist/types';
import { BLUE, BUCK, NS, nUSDC, Sui, USDT, wUSDC } from 'navi-sdk';

export const coinInfos: CoinInfo[] = [Sui, USDT, wUSDC, nUSDC, BUCK, BLUE, NS];
export const DEFAULT_SLIPPAGE = 0.01; // 1%
