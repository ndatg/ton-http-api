import {
    TonHttpApiV2,
    TonSubscriberV2,
    TonMemoryBlockStorageV2,
    TonRedisBlockStorageV2,
    SchemaV2
} from "../src";
import Logger from "pino";

const main = async () => {
    const api = new TonHttpApiV2({
        endpoint: "https://toncenter.com/",
        apiKey: ""
    });

    const storage = new TonMemoryBlockStorageV2();
    // const storage = new TonRedisBlockStorageV2("redis://:password@127.0.0.1:6379/0");

    const logger = Logger({
        transport: {
            target: "pino-pretty",
            options: {
                colorize: true
            }
        }
    });

    const subscriber = new TonSubscriberV2({
        api: api,
        storage: storage,
        // logger: logger,
        // masterchainTickSleepTime: 3000,
        // shardchainTickSleepTime: 100,
        // startSeqno: 35744539
    });

    await subscriber.start();

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

    // subscriber.stop();
};

main();
