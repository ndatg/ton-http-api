import { EventEmitter } from "events";
import { TonHttpApiV2 } from "../TonHttpApiV2/TonHttpApiV2";
import { TonBlockStorageV2 } from "./TonBlockStorageV2";
import { sleep } from "../utils";

export interface TonSubscriberV2Parameters {

    api: TonHttpApiV2;

    storage: TonBlockStorageV2;

    masterchainTickSleepTime?: number;

    shardchainTickSleepTime?: number;

    logger?: any;

    startSeqno?: number;

}

export class TonSubscriberV2 extends EventEmitter {

    readonly #api: TonHttpApiV2;

    readonly #storage: TonBlockStorageV2;

    readonly #masterchainTickSleepTime: number;

    readonly #shardchainTickSleepTime: number;

    readonly #logger: {
        info: any,
        error: any
    };

    #startSeqno: number;

    #startLT: bigint;

    #stopped = false;

    constructor(params: TonSubscriberV2Parameters) {
        super();

        this.#api = params.api;
        this.#storage = params.storage;

        this.#masterchainTickSleepTime = params?.masterchainTickSleepTime || 5_000;
        this.#shardchainTickSleepTime = params?.shardchainTickSleepTime || 1_000;
        this.#logger = params?.logger || {
            info: console.log,
            error: console.error
        };
        this.#startSeqno = params?.startSeqno || -1;
        this.#startLT = BigInt(-1);
    }

    /**
     * Start monitoring blocks in masterchain and shardchains, initialize initial data.
     */
    async start() {
        this.#stopped = false;
        this.#logger.info("start subscriber");

        if (this.#startSeqno >= 0) {
            const startMasterchainBlockHeader = await this.#api.getMasterchainBlockHeader(this.#startSeqno);
            await sleep(1000);

            this.#startLT = BigInt(startMasterchainBlockHeader.end_lt);
        } else {
            const masterchainInfo = await this.#api.getMasterchainInfo();
            await sleep(1000);

            const startMasterchainBlockHeader = await this.#api.getMasterchainBlockHeader(masterchainInfo.last.seqno);
            await sleep(1000);

            this.#startSeqno = masterchainInfo.last.seqno;
            this.#startLT = BigInt(startMasterchainBlockHeader.end_lt);
        }

        this.masterchainTick();
        this.shardchainTick();
    }

    /**
     * Stop monitoring blocks in masterchain and shardchains.
     */
    async stop() {
        this.#stopped = true;
        this.#logger.info("stop subscriber");
    }

    /**
     * Clean up the storage.
     */
    async clean() {
        await this.#storage.clean();
        this.#logger.info("clean storage");
    }

    /**
     * Monitoring blocks in the masterchain.
     * @private
     */
    private async masterchainTick() {

        while(!this.#stopped) {
            try {
                const lastSavedSeqno = await this.#storage.getLastMasterchainBlock() || this.#startSeqno;
                if (!lastSavedSeqno) {
                    throw Error("no init masterchain block in storage");
                }

                const lastMasterchainInfo = await this.#api.getMasterchainInfo();
                const lastSeqno = lastMasterchainInfo.last.seqno;
                if (!lastSeqno) {
                    throw Error("invalid last masterchain block from provider");
                }

                for (let i = lastSavedSeqno + 1; i <= lastSeqno; i += 1) {
                    this.#logger.info(`masterchain tick - seqno: ${i}`);

                    const getBlock = await this.#api.getMasterchainBlockHeader(i);
                    const getShards = await this.#api.getShards(i);

                    await this.#storage.insertMasterchainBlock(i);
                    await this.#storage.insertShardchainBlocks(getShards.shards);
                    this.emit("block", {
                        block: getBlock,
                        shards: getShards.shards,
                    });
                }

                await sleep(this.#masterchainTickSleepTime);
            } catch (error) {
                this.#logger.error(`masterchain tick error: ${error}`);
            }
        }
    }

    /**
     * Monitoring blocks in shardchains.
     * @private
     */
    private async shardchainTick() {

        while (!this.#stopped) {
            try {
                const shardchainBlock = await this.#storage.getUnprocessedShardchainBlock();
                if (shardchainBlock) {
                    const { workchain, shard, seqno } = shardchainBlock;
                    this.#logger.info(`shardchain tick - workchain: ${workchain} / shard: ${shard} / seqno: ${seqno}`);

                    const getBlock = await this.#api.getBlockHeader(workchain, shard, seqno);

                    if (BigInt(getBlock.end_lt) < this.#startLT) {
                        await this.#storage.setShardchainBlockProcessed(workchain, shard, seqno, []);
                    } else {
                        await this.#storage.setShardchainBlockProcessed(workchain, shard, seqno, getBlock.prev_blocks);
                        this.emit("block", {
                            block: getBlock
                        });
                    }
                }

                await sleep(this.#shardchainTickSleepTime);
            } catch (error) {
                this.#logger.error(`shardchain tick error: ${error}`);
            }
        }

    }
}
