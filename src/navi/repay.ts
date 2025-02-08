import { NAVISDKClient } from 'navi-sdk'
import { coinInfos } from "../constants"

export type RepayDebtParams = {
  symbol: string;
  amount: string;
};

export const repayDebt = async (
  params: RepayDebtParams,
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
    const result = await account.repay(coinInfo, Number(adjustedAmount));
    console.log("Repay to navi successful:", result.digest);
    // Return the transaction ID
    return JSON.stringify({
      status: 'success',
      id: result.digest,
    });
  } catch (error) {
    console.log("Repay to navi failed:", error instanceof Error ? error.message : 'Unknown error');
    return JSON.stringify({
      status: 'failure',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};