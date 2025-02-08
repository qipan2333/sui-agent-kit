import { NAVISDKClient } from 'navi-sdk';
import { coinInfos } from '../constants';
export type GetOwnBalanceParams = {
  symbol: string;
};

export const getOwnBalance = async (
  params: GetOwnBalanceParams,
  privateKey: string,
) => {
  try {
    const client = new NAVISDKClient({privateKeyList: [privateKey], networkType: "mainnet"});
    const account = client.accounts[0];
    const coinInfo = coinInfos.find((coin) => coin.symbol === params.symbol);
    if (!coinInfo) {
      throw new Error(`Coin ${params.symbol} not Supported`);
    }
    const result = await account.getCoins(coinInfo.address);
    let balance = 0;
    result.data.forEach((coin) => {
      balance += Number(coin.balance);
    });
    balance = balance / Math.pow(10, coinInfo.decimal);
    console.log("Get wallet Balance successful: ", balance, coinInfo.symbol);
    return JSON.stringify({
      status: 'success',
    });
  } catch (error) {
    console.log("Get wallet Balance failed: ", error);
    return JSON.stringify({
      status: 'failure',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};