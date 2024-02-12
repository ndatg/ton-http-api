# ton-http-api

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

The lightweight TON typescript library includes api, subscribers, and clients for interacting with smart contracts.

## Documentation

Go to the [documentation](https://ndatg.github.io/ton-http-api/) for detailed information.

## Migration

If you need an older version of the library, use the [migrate](https://github.com/ndatg/ton-http-api/tree/migrate) branch.

## Components

| Component             | Status                                                                |
| ----------------- | ------------------------------------------------------------------ |
| [Toncenter API V2](https://toncenter.com/api/v2/) | ✅ |
| [Toncenter API V3](https://toncenter.com/api/v3/) | ✅ |
| Client for toncenter API V2 | ✅ |
| Client for toncenter API V3 | ✅ |
| Block subscriber for toncenter API V2 | ✅ |
| Block subscriber for toncenter API V3 | ✅ |


## Installation


```bash
npm install ton-http-api --save
```

## Usage/Examples

Some of the examples can be found in the [examples](https://github.com/ndatg/ton-http-api/tree/main/examples) directory.

Register your API key in the [@tonapibot](https://t.me/tonapibot) to get access with higher limits.

### Api V3

In most cases, I recommend using toncenter `TonHttpApiV3`, this is the new and improved version.

```javascript
import { TonHttpApiV3 } from "ton-http-api";

const api = new TonHttpApiV3({
    endpoint: "https://toncenter.com/",
    apiKey: "" // optional
});

const masterchainInfo = await api.getMasterchainInfo();
console.log(masterchainInfo);

const nftCollections = await api.getNftCollections({
    collection_address: "EQCA14o1-VWhS2efqoh_9M1b_A9DtKTuoqfmkn83AbJzwnPi"
});
console.log(nftCollections);

const nftItems = await api.getNftItems({
    collection_address: "EQCA14o1-VWhS2efqoh_9M1b_A9DtKTuoqfmkn83AbJzwnPi"
});
console.log(nftItems);

const jettonWallets = await api.getJettonWallets({
    jetton_address: "EQBynBO23ywHy_CgarY9NK9FTz0yDsG82PtcbSTQgGoXwiuA"
});
console.log(jettonWallets);
```

### Api V2

You can also use the old toncenter `TonHttpApiV2`.

```javascript
import { TonHttpApiV2 } from "ton-http-api";

const api = new TonHttpApiV2({
    endpoint: "https://toncenter.com/",
    apiKey: "" // optional
});

const data = await api.getMasterchainInfo();
console.log(data);

const data = await api.getTransactions("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N");
console.log(data);
```

### Client V2 / V3

`TonClientV2` and `TonClientV3` provide compatibility with other libraries (e.g. deploy and test smart contracts).

`TonClientV2` works in the same way as `TonClientV3`, but uses `TonHttpApiV2`.

You can use `client.api` to work with api methods.

For example, let's do a highload wallet deploy!

```bash
npm install ton-highload-wallet-contract @ton/crypto @ton/core --save
```

```javascript
import { TonClientV3 } from "ton-http-api";
import { HighloadWalletContractV2 } from "ton-highload-wallet-contract";
import { mnemonicToPrivateKey } from "@ton/crypto";
import { internal } from "@ton/core";

const client = new TonClientV3({
    endpoint: "https://toncenter.com/",
    apiKey: "", // optional
});

const mnemonic = [ /* ... */ ];

// create contract
const key = await mnemonicToPrivateKey(mnemonic);
const contract = client.open(HighloadWalletContractV2.create({ publicKey: key.publicKey, workchain: 0 }));
console.log(`send test coins to the address: ${contract.address}`);

// send transfer
await contract.sendTransfer({
    secretKey: key.secretKey,
    messages: [
        internal({
            to: "EQBYivdc0GAk-nnczaMnYNuSjpeXu2nJS3DZ4KqLjosX5sVC",
            value: "0.2",
            body: "test 1",
            bounce: false,
        }),
        internal({
            to: "EQBYivdc0GAk-nnczaMnYNuSjpeXu2nJS3DZ4KqLjosX5sVC",
            value: "0.2",
            body: "test 2",
            bounce: false,
        })
    ],
});

```

### Subscriber V3

You can use `TonSubscriberV3` to listen blocks in the blockchain, it uses the `TonHttpApiV3`.

The `getTransactionsByMasterchainBlock` method gets transactions from both masterchain and shardchains.

```javascript
import { 
    TonHttpApiV3, TonSubscriberV3, 
    TonMemoryBlockStorageV3, SchemaV3 
} from "ton-http-api";

const api = new TonHttpApiV3({
    endpoint: "https://toncenter.com/",
    apiKey: "" // optional
});

const storage = new TonMemoryBlockStorageV3();

const subscriber = new TonSubscriberV3({
    api: api,
    storage: storage,
    // logger: logger,
    // masterchainTickSleepTime: 3000,
    // startSeqno: 35744539
});
await subscriber.start();

subscriber.on("block", async (args: { block: SchemaV3.Block }) => {
    try {

        let offset = 0;
        let stopped = false;
        let transactions: any = [];

        do {
            try {
                const data = await api.getTransactionsByMasterchainBlock(args.block.seqno, {
                    limit: 256,
                    offset
                });
                transactions = [...transactions, ...data.transactions];

                if (data.transactions.length < 256) {
                    stopped = true;
                    break;
                }

                offset += 256;
            } catch (error) {
                console.log(error);
            }
        } while(!stopped);

        console.log(`seqno: ${args.block.seqno} / transactions: ${transactions.length}`);

    } catch (error) {
        console.log(error);
    }
});
```

### Subscriber V2

You can use `TonSubscriberV2` to listen blocks in the blockchain, it uses the `TonHttpApiV2`.

```javascript
import { 
    TonHttpApiV2, TonSubscriberV2, 
    TonMemoryBlockStorageV2, SchemaV2 
} from "ton-http-api";

const api = new TonHttpApiV2({
    endpoint: "https://toncenter.com/",
    apiKey: "" // optional
});

const storage = new TonMemoryBlockStorageV2();

const subscriber = new TonSubscriberV2({
    api: api,
    storage: storage,
    // logger: logger,
    // masterchainTickSleepTime: 3000,
    // shardchainTickSleepTime: 100,
    // startSeqno: 35744539
});

subscriber.on("block", async (args: { block: SchemaV2.BlockHeader, shards?: SchemaV2.BlockShards }) => {
    try {

        const { workchain, shard, seqno } = args.block.id;

        let stopped = false;
        let transactions: any = [];
        do {
            try {
                const data = await api.getBlockTransactions(workchain, shard, seqno, {
                    count: 1024,
                });
                transactions = [...transactions, ...data.transactions];
                stopped = true;
            } catch (error) {
                console.log(error);
            }
        } while(!stopped);

        console.log(`workchain: ${workchain} / seqno: ${seqno} / transactions: ${transactions.length}`);

    } catch (error) {
        console.log(error);
    }
});
```
## Feedback

If you have any feedback, please reach out to me at telegram [@ndatg](https://t.me/ndatg).

