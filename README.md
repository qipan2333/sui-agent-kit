# sui-agent-kit
## Overview
sui-agent-kit is a powerful library designed for interacting with sui assets through an AI agent. 
This library integrates seamlessly into existing Node.js projects , 
enabling users to perform a variety of operations like transferring assets, swapping assets, 
supplying, and borrowing—all through natural language commands. 
The library leverages OpenAI and other AI models to enable intuitive and efficient sui asset management.  

All the sui operations mentioned above are implemented using the [Navi SDK](https://github.com/naviprotocol/navi-sdk).


## Getting Started

```bash
npm install sui-agent-kit
```

You will need two things:

- A Sui wallet private key
- An OpenAI or Gemini or Anthropic API key

```ts
import { SuiAgent } from 'sui-agent-kit'

const agent = new SuiAgent({
  model: 'gpt-4o-mini',
  openAiApiKey: process.env.OPENAI_API_KEY,
  walletPrivateKey: process.env.SUI_WALLET_PRIVATE_KEY,
});
// Get balance
await agent.execute("Tell me the balance of Sui in my wallet");

// Transfer asset
await agent.execute("Send 0.1 Sui to 0x9f1b1dbda249722fecd7cf8884928c019c64c56e3c3b9362e2867f8d80e16e16");
await agent.execute("give 0x9f1b1dbda249722fecd7cf8884928c019c64c56e3c3b9362e2867f8d80e16e16 0.1 Sui");

// Lend asset on navi
await agent.execute("Supply 0.1 Sui as Collateral");

// Borrow asset on navi
await agent.execute("Borrow 0.1 USDT");

// Repay debt on navi
await agent.execute("Repay 0.1 USDT");

// Swap assets 
await agent.execute("Swap 0.1 Sui for at least 0.2 USDT");
```