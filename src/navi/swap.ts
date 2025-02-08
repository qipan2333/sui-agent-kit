import { NAVISDKClient } from 'navi-sdk'
import { coinInfos } from "../constants"

export type SwapExactInputParams = {
  fromAmount: string;
  toAmount: string;
  fromSymbol: string;
  toSymbol: string;
};

export const swapExactInput = async (
  params: SwapExactInputParams,
  privateKey: string,
) => {
  try {

    const client = new NAVISDKClient({privateKeyList: [privateKey], networkType: "mainnet"});
    const account = client.accounts[0];
    const fromCoinInfo = coinInfos.find((coin) => coin.symbol === params.fromSymbol);
    if (!fromCoinInfo) {
      throw new Error(`Coin ${params.fromSymbol} not Supported`);
    }
    const toCoinInfo = coinInfos.find((coin) => coin.symbol === params.toSymbol);
    if (!toCoinInfo) {
      throw new Error(`Coin ${params.toSymbol} not Supported`);
    }
    const fromAmount = BigInt(Number(params.fromAmount) * Math.pow(10, fromCoinInfo.decimal));
    const toAmount = BigInt(Number(params.toAmount) * Math.pow(10, toCoinInfo.decimal));
    const result = await account.swap(fromCoinInfo.address, toCoinInfo.address, Number(fromAmount), Number(toAmount));
    console.log("swap on navi successful:", result.digest);
    // Return the transaction ID
    return JSON.stringify({
      status: 'success',
      id: result.digest,
    });
  } catch (error) {
    console.log("swap on navi failed:", error instanceof Error ? error.message : 'Unknown error');
    return JSON.stringify({
      status: 'failure',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};