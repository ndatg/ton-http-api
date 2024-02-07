import { BlockIdExt } from "../TonHttpApiV2/SchemaV2";

export interface TonBlockStorageV2 {
    getLastMasterchainBlock(): Promise<number | null>;

    getUnprocessedShardchainBlock(): Promise<{ workchain: number, shard: string, seqno: number } | null>;

    insertMasterchainBlock(seqno: number): Promise<void>;

    insertShardchainBlocks(shards: BlockIdExt[]): Promise<void>;

    setShardchainBlockProcessed(workchain: number, shard: string, seqno: number, prevShardBlocks: BlockIdExt[]): Promise<void>;

    clean(): Promise<void>;
}
