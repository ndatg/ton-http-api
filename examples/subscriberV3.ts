import {
    TonHttpApiV3,
    TonSubscriberV3,
    TonMemoryBlockStorageV3,
    TonRedisBlockStorageV3,
    SchemaV3
} from "../src";
import Logger from "pino";

const main = async () => {
    const api = new TonHttpApiV3({
        endpoint: "https://toncenter.com/",
        apiKey: ""
    });

    const storage = new TonMemoryBlockStorageV3();
    // const storage = new TonRedisBlockStorageV3("redis://:password@127.0.0.1:6379/0");

    const logger = Logger({
        transport: {
            target: "pino-pretty",
            options: {
                colorize: true
            }
        }
    });

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

    // subscriber.stop();
};

main();
