import { TonBlockStorageV2 } from "./TonBlockStorageV2";
import { BlockIdExt } from "../TonHttpApiV2/SchemaV2";

export class TonMemoryBlockStorageV2 implements TonBlockStorageV2 {

    #masterchainBlocks: {
        [key: string]: boolean
    };

    #shardchainBlocks: {
        [key: string]: boolean
    };

    constructor() {
        this.#masterchainBlocks = {};
        this.#shardchainBlocks = {};
    }

    /**
     * Insert new shardchain blocks into the shardchains hashtable.
     * @param shards
     */
    async insertShardchainBlocks(shards: BlockIdExt[]) {
        for (const { workchain, shard, seqno } of shards) {
            if (workchain === -1) {
                continue;
            }

            if (this.#shardchainBlocks[`${workchain}_${shard}_${seqno}`] !== undefined) {
                continue;
            }

            this.#shardchainBlocks[`${workchain}_${shard}_${seqno}`] = false;
        }
    }

    /**
     * Insert a new masterchain block into the masterchain hashtable.
     * @param seqno
     */
    async insertMasterchainBlock(seqno: number) {
        if (this.#masterchainBlocks[seqno] !== undefined) {
            throw Error(`masterchain block already exists! seqno: ${seqno}`);
        }
        this.#masterchainBlocks[seqno] = true;
    }

    /**
     * Get the last inserted masterchain block from the masterchain hashtable.
     */
    async getLastMasterchainBlock() {
        const data = Object.keys(this.#masterchainBlocks)
            .map(x => Number(x))
            .sort((a, b) => b - a);
        return data[0];
    }

    /**
     * Get the last unprocessed shardchain block from the shardchains hashtable.
     */
    async getUnprocessedShardchainBlock() {
        for (const key in this.#shardchainBlocks) {
            if (!this.#shardchainBlocks[key]) {
                const data = key.split("_");
                return {
                    workchain: Number(data[0]),
                    shard: data[1],
                    seqno: Number(data[2])
                };
            }
        }

        return null;
    }

    /**
     * Process a shardchain block in the sharchains hashtable.
     * @param workchain
     * @param shard
     * @param seqno
     * @param prevShardBlocks
     */
    async setShardchainBlockProcessed(workchain: number, shard: string, seqno: number, prevShardBlocks: BlockIdExt[]) {
        if (this.#shardchainBlocks[`${workchain}_${shard}_${seqno}`] === undefined) {
            throw Error(
                `shardchain not found! workchain: ${workchain} / shard: ${shard} / seqno: ${seqno}`
            );
        }

        this.#shardchainBlocks[`${workchain}_${shard}_${seqno}`] = true;
        await this.insertShardchainBlocks(prevShardBlocks);
    }

    /**
     * Clean up the hashtables.
     */
    async clean() {
        this.#masterchainBlocks = {};
        this.#shardchainBlocks = {};
    }
}
