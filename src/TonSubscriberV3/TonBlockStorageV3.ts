export interface TonBlockStorageV3 {
    getLastMasterchainBlock(): Promise<number | null>;

    insertMasterchainBlock(seqno: number): Promise<void>;

    clean(): Promise<void>;
}
