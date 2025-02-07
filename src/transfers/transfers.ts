import { Sui, USDT, wUSDC, nUSDC, BUCK, BLUE, NS } from "navi-sdk";
import type { CoinInfo } from "navi-sdk/dist/types/index.js";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { getFullnodeUrl, SuiClient, type CoinStruct, type CoinBalance } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";

export const coinInfos: CoinInfo[] = [Sui, USDT, wUSDC, nUSDC, BUCK, BLUE, NS];

export type TransferParams = {
  to: string;
  amount: string;
  symbol: string;
};

export const transfer = async (params: TransferParams, privateKey: string) => {
  try {
    const keypair = Ed25519Keypair.fromSecretKey(privateKey);
    const address = keypair.getPublicKey().toSuiAddress();
    const client: SuiClient = new SuiClient({ url: getFullnodeUrl("mainnet") });
    const coinInfo = coinInfos.find((coin) => coin.symbol === params.symbol);
    if (!coinInfo) {
      throw new Error(`Coin ${params.symbol} not Supported`);
    }

    const { data: coins } = await client.getCoins({
      owner: address,
      coinType: coinInfo.address,
    });
    if (coins.length === 0) {
      console.error('No USDC coins found in your wallet');
      return;
    }
    const adjustedAmount = BigInt(Number(params.amount) * Math.pow(10, coinInfo.decimal));
    
    const tx = new Transaction();
    if (coinInfo.address == "0x2::sui::SUI") {
      const [coinsToTransfer] = tx.splitCoins(tx.gas, [adjustedAmount]);
      tx.transferObjects([coinsToTransfer], params.to);
    } else {
      if (coins.length >= 2) {
        let baseObj = coins[0]!.coinObjectId;
        let allList = coins.slice(1).map(coin => coin.coinObjectId);

        tx.mergeCoins(baseObj, allList);
      }
      let mergedCoin = tx.object(coins[0]!.coinObjectId);
      const [coinsToTransfer] = tx.splitCoins(mergedCoin, [adjustedAmount]);
      tx.transferObjects([coinsToTransfer], params.to);
    }

    const executedTransaction =
      await client.signAndExecuteTransaction({
          signer: keypair,
          transaction: tx,
      });
    console.log("Transfer successful:", executedTransaction.digest);
    return JSON.stringify({
      status: 'success',
      id: executedTransaction.digest,
    });
  } catch (error) {
    return JSON.stringify({
      status: 'failure',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
