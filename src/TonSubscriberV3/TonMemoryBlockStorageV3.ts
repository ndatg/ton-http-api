import { TonBlockStorageV3 } from "./TonBlockStorageV3";

export class TonMemoryBlockStorageV3 implements TonBlockStorageV3 {

    #masterchainBlocks: {
        [key: string]: boolean
    };

    constructor() {
        this.#masterchainBlocks = {};
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
     * Clean up the hashtable.
     */
    async clean() {
        this.#masterchainBlocks = {};
    }
}
