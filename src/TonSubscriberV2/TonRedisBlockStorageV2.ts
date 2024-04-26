import Redis from "ioredis";
import { TonBlockStorageV2 } from "./TonBlockStorageV2";
import { BlockIdExt } from "../TonHttpApiV2/SchemaV2";

export class TonRedisBlockStorageV2 implements TonBlockStorageV2 {

    readonly #redis: Redis;

    constructor(conn: string) {
        this.#redis = new Redis(conn);
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

            if (await this.#redis.hexists("ton:shardchain:blocks", `${workchain}_${shard}_${seqno}`)) {
                continue;
            }

            await this.#redis.hset("ton:shardchain:blocks", {
                [`${workchain}_${shard}_${seqno}`]: 0
            });
        }
    }

    /**
     * Insert a new masterchain block into the masterchain hashtable.
     * @param seqno
     */
    async insertMasterchainBlock(seqno: number) {
        if (await this.#redis.hexists("ton:masterchain:blocks", `${seqno}`)) {
            throw Error(`masterchain block already exists! seqno: ${seqno}`);
        }
        await this.#redis.hset("ton:masterchain:blocks", {
            [seqno]: 1
        });
    }

    /**
     * Get the last inserted masterchain block from the masterchain hashtable.
     */
    async getLastMasterchainBlock() {
        const masterchainBlocks = await this.#redis.hgetall("ton:masterchain:blocks");
        const data = Object.keys(masterchainBlocks)
            .map(x => Number(x))
            .sort((a, b) => b - a);
        return Object.keys(masterchainBlocks).length > 0 ? data[0] : null;
    }

    /**
     * Get the last unprocessed shardchain block from the shardchains hashtable.
     */
    async getUnprocessedShardchainBlock() {
        const shardchainBlocks = await this.#redis.hgetall("ton:shardchain:blocks");
        for (const key in shardchainBlocks) {
            if (shardchainBlocks[key] !== undefined && !parseInt(shardchainBlocks[key])) {
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
        if (!await this.#redis.hexists("ton:shardchain:blocks", `${workchain}_${shard}_${seqno}`)) {
            throw Error(
                `shardchain not found! workchain: ${workchain} / shard: ${shard} / seqno: ${seqno}`
            );
        }

        await this.#redis.hset("ton:shardchain:blocks", {
            [`${workchain}_${shard}_${seqno}`]: 1
        });
        await this.insertShardchainBlocks(prevShardBlocks);
    }

    /**
     * Clean up the hashtables.
     */
    async clean() {
        await this.#redis.del("ton:masterchain:blocks");
        await this.#redis.del("ton:shardchain:blocks");
    }
}
