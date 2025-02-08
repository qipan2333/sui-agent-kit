import { NAVISDKClient } from 'navi-sdk'
import { coinInfos } from "../constants"

export type SupplyCollateralParams = {
  amount: string;
  symbol: string;
};

export const supplyCollateral = async (
  params: SupplyCollateralParams,
  privateKey: string,
) => {
  try {
    const client = new NAVISDKClient({privateKeyList: [privateKey], networkType: "mainnet"});
    const account = client.accounts[0];
    const coinInfo = coinInfos.find((coin) => coin.symbol === params.symbol);
    if (!coinInfo) {
      throw new Error(`Coin ${params.symbol} not Supported`);
    }
    const adjustedAmount = BigInt(Number(params.amount) * Math.pow(10, coinInfo.decimal));
    const result = await account.depositToNavi(coinInfo, Number(adjustedAmount));
    console.log("Supply to navi successful:", result.digest);
    return JSON.stringify({
      status: 'success',
      id: result.digest,
    });
  } catch (error) {
    console.log("Supply to navi failed:", error instanceof Error ? error.message : 'Unknown error');
    return JSON.stringify({
      status: 'failure',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};