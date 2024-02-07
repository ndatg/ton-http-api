import { z } from "zod";
import axios, { AxiosAdapter } from "axios";
import {Cell, TupleItem, TupleReader} from "@ton/core";
import * as Schema from "./SchemaV3";

export interface TonHttpApiV3Parameters {

    endpoint: string;

    apiKey?: string;

    timeout?: number;

    adapter?: AxiosAdapter;

}

export class TonHttpApiV3 {

    readonly #endpoint: string;

    readonly #timeout: number;

    readonly #apiKey?: string;

    readonly #adapter?: AxiosAdapter;

    constructor(params: TonHttpApiV3Parameters) {
        this.#endpoint = params.endpoint;
        this.#timeout = params?.timeout || 10_000;
        this.#apiKey = params?.apiKey;
        this.#adapter = params?.adapter;
    }

    /**
     * Get smart contract information.
     * @param address
     */
    async getAccount(address: string) {
        return this.get(
            "/api/v3/account",
            {
                address
            },
            Schema.account
        );
    }

    /**
     * Get wallet smart contract information.
     * The following wallets are supported: v1r1, v1r2, v1r3, v2r1, v2r2, v3r1, v3r2, v4r1, v4r2.
     * In case the account is not a wallet error code 409 is returned.
     * @param address
     */
    async getWallet(address: string) {
        return this.get(
            "/api/v3/wallet",
            {
                address
            },
            Schema.wallet
        );
    }

    /**
     * Get masterchain info.
     */
    async getMasterchainInfo() {
        return this.get(
            "/api/v3/masterchainInfo",
            {},
            Schema.masterchainInfo
        );
    }

    /**
     * Returns blocks by specified filters.
     * @param [optional={ workchain, shard, seqno, start_utime, end_utime, start_lt, end_lt, limit, offset, sort }]
     */
    async getBlocks(optional? : {
        workchain?: number, shard?: string, seqno?: number, start_utime?: string, end_utime?: string,
        start_lt?: string, end_lt?: string, limit?: number, offset?: number, sort?: "asc" | "desc"
    }) {
        return this.get(
            "/api/v3/blocks",
            {
                ...optional
            },
            Schema.blocks
        );
    }

    /**
     * Returns all workchain blocks, that appeared after previous masterchain block.
     * @param seqno
     * @param [optional={ include_mc_block }]
     */
    async getMasterchainBlockShards(seqno: number, optional?: {
        include_mc_block?: boolean
    }) {
        return this.get(
            "/api/v3/masterchainBlockShards",
            {
                seqno, ...optional
            },
            Schema.masterchainBlockShards
        );
    }

    /**
     * Get transactions by specified filters.
     * @param [optional={ workchain, shard, seqno, account, exclude_account, hash, lt,
     * start_utime, end_utime, start_lt, end_lt, limit, offset, sort }]
     */
    async getTransactions(optional?: {
        workchain?: number, shard?: string, seqno?: number, account?: string, exclude_account?: string, hash?: string,
        lt?: string, start_utime?: string, end_utime?: string, start_lt?: string, end_lt?: string, limit?: number,
        offset?: number, sort?: "asc" | "desc"
    }) {
        return this.get(
            "/api/v3/transactions",
            {
                ...optional
            },
            Schema.transactions
        );
    }

    /**
     * Returns transactions from masterchain block and from all shards.
     * @param seqno
     * @param [optional={ limit, offset, sort }]
     */
    async getTransactionsByMasterchainBlock(seqno: number, optional?: {
        limit?: number, offset?: number, sort?: "asc" | "desc"
    }) {
        return this.get(
            "/api/v3/transactionsByMasterchainBlock",
            {
                seqno, ...optional
            },
            Schema.transactions
        );
    }

    /**
     * Get transactions whose inbound/outbound message has the specified hash.
     * This endpoint returns list of Transaction objects since collisions of message hashes can occur.
     * @param direction
     * @param msg_hash
     * @param [optional={ limit, offset }]
     */
    async getTransactionsByMessage(direction: "in" | "out", msg_hash: string, optional?: {
        limit?: number, offset?: number
    }) {
        return this.get(
            "/api/v3/transactionsByMessage",
            {
                direction, msg_hash, ...optional
            },
            Schema.transactions
        );
    }

    /**
     * Get parent and/or children for specified transaction.
     * @param hash
     * @param [optional={ direction, limit, offset, sort }]
     */
    async getAdjacentTransactions(hash: string, optional?: {
        direction?: "in" | "out" | "both", limit?: number, offset?: number, sort?: "asc" | "desc"
    }) {
        return this.get(
            "/api/v3/adjacentTransactions",
            {
                hash, ...optional
            },
            Schema.transactions
        );
    }

    /**
     * Get batch of trace graph by ids.
     * @param [optional={ tx_hash, trace_id }]
     */
    async getTraces(optional?: {
        tx_hash?: string[], trace_id?: string[]
    }) {
        let query = "";

        if (optional?.tx_hash) {
            for (const tx of optional.tx_hash) {
                if (query.length <= 0) {
                    query += `?tx_hash=${tx}`;
                } else {
                    query += `&tx_hash=${tx}`;
                }
            }
        }

        if (optional?.trace_id) {
            for (const id of optional.trace_id) {
                if (query.length <= 0) {
                    query += `?trace_id=${id}`;
                } else {
                    query += `&trace_id=${id}`;
                }
            }
        }

        return this.get(
            `/api/v3/traces${query}`,
            {},
            Schema.traces
        );
    }

    /**
     * Get trace graph for specified transaction.
     * @param hash
     * @param [optional={ sort }]
     */
    async getTransactionTrace(hash: string, optional?: {
        sort?: "asc" | "desc"
    }) {
        return this.get(
            "/api/v3/transactionTrace",
            {
                hash, ...optional
            },
            Schema.transactionTrace
        );
    }

    /**
     * Get messages by specified filters.
     * @param [optional={ hash, source, destination, body_hash, limit, offset }]
     */
    async getMessages(optional?: {
        hash?: string, source?: string, destination?: string, body_hash?: string, limit?: number, offset?: number
    }) {
        return this.get(
            "/api/v3/messages",
            {
                ...optional
            },
            Schema.messages
        );
    }

    /**
     * Get NFT collections.
     * @param [optional={ collection_address, owner_address, limit, offset }]
     */
    async getNftCollections(optional?: {
        collection_address?: string, owner_address?: string, limit?: number, offset?: number
    }) {
        return this.get(
            "/api/v3/nft/collections",
            {
                ...optional
            },
            Schema.nftCollections
        );
    }

    /**
     * Get NFT items.
     * @param [optional={ address, collection_address, owner_address, limit, offset }]
     */
    async getNftItems(optional?: {
        address?: string, collection_address?: string, owner_address?: string, limit?: number, offset?: number
    }) {
        return this.get(
            "/api/v3/nft/items",
            {
                ...optional
            },
            Schema.nftItems
        );
    }

    /**
     * Get NFT transfers by specified filters.
     * @param [optional={ address, item_address, collection_address, direction, start_utime, end_utime,
     * start_lt, end_lt, limit, offset }]
     */
    async getNftTransfers(optional?: {
        address?: string, item_address?: string, collection_address?: string, direction?: "in" | "out" | "both",
        start_utime?: string, end_utime?: string, start_lt?: string, end_lt?: string, limit?: number, offset?: number,
        sort?: "asc" | "desc"
    }) {
        return this.get(
            "/api/v3/nft/transfers",
            {
                ...optional
            },
            Schema.nftTransfers
        );
    }

    /**
     * Get Jetton masters by specified filters.
     * @param [optional={ address, admin_address, limit, offset }]
     */
    async getJettonMasters(optional?: {
        address?: string, admin_address?: string, limit?: number, offset?: number
    }) {
        return this.get(
            "/api/v3/jetton/masters",
            {
                ...optional
            },
            Schema.jettonMasters
        );
    }

    /**
     * Get Jetton wallets by specified filters.
     * @param [optional={ address, owner_address, jetton_address, limit, offset }]
     */
    async getJettonWallets(optional?: {
        address?: string, owner_address?: string, jetton_address?: string, limit?: number, offset?: number
    }) {
        return this.get(
            "/api/v3/jetton/wallets",
            {
                ...optional
            },
            Schema.jettonWallets
        );
    }

    /**
     * Get Jetton transfers by specified filters.
     * @param [optional={ address, jetton_wallet, jetton_master, direction, start_utime, end_utime,
     * start_lt, end_lt, limit, offset, sort }]
     */
    async getJettonTransfers(optional?: {
        address?: string, jetton_wallet?: string, jetton_master?: string, direction?: "in" | "out" | "both",
        start_utime?: string, end_utime?: string, start_lt?: string, end_lt?: string, limit?: number, offset?: number,
        sort?: "asc" | "desc"
    }) {
        return this.get(
            "/api/v3/jetton/transfers",
            {
                ...optional
            },
            Schema.jettonTransfers
        );
    }

    /**
     * Get Jetton burns by specified filters.
     * @param [optional={ address, jetton_wallet, jetton_master, start_utime, end_utime,
     * start_lt, end_lt, limit, offset, sort }]
     */
    async getJettonBurns(optional?: {
        address?: string, jetton_wallet?: string, jetton_master?: string, start_utime?: string, end_utime?: string,
        start_lt?: string, end_lt?: string, limit?: number, offset?: number, sort?: "asc" | "desc"
    }) {
        return this.get(
            "/api/v3/jetton/burns",
            {
                ...optional
            },
            Schema.jettonBurns
        );
    }

    /**
     * Get list of accounts sorted descending by balance.
     * @param [optional={ limit, offset }]
     */
    async topAccountByBalance(optional?: {
        limit?: number, offset?: number
    }) {
        return this.get(
            "/api/v3/topAccountsByBalance",
            {
                ...optional
            },
            Schema.topAccountByBalance
        );
    }

    /**
     * Send external message to TON network.
     * @param boc
     */
    async sendMessage(boc: string) {
        return this.post(
            "/api/v3/message",
            {
                boc
            },
            Schema.sendMessage
        );
    }

    /**
     * Run get method of smart contract. Stack supports only num, cell and slice types.
     * @param address
     * @param method
     * @param stack
     */
    async runGetMethod(address: string, method: string, stack: TupleItem[]) {
        return this.post(
            "/api/v3/runGetMethod",
            {
                address, method, stack: TonHttpApiV3.serializeStack(stack)
            },
            Schema.runGetMethod
        );
    }

    /**
     * Estimate fee for external message.
     * @param address
     * @param body
     * @param init_code
     * @param init_data
     * @param ignore_chksig
     */
    async estimateFee(address: string, body: string, init_code: string, init_data: string, ignore_chksig: boolean) {
        return this.post(
            "/api/v3/estimateFee",
            {
                address, body, init_code, init_data, ignore_chksig
            },
            Schema.estimateFee
        );
    }

    /**
     * Get method of adapter.
     * @param method
     * @param params
     * @param returnSchema
     * @private
     */
    private async get<T>(method: string, params: any, returnSchema: z.ZodType<T>) {
        const headers: { [key: string]: any } = {
            "Content-Type": "application/json"
        };

        const config: { [key: string]: any } = {
            headers,
            timeout: this.#timeout,
            params: {
                api_key: this.#apiKey,
                ...params
            }
        };
        if (this.#adapter) {
            config.adapter = this.#adapter;
        }

        const endpoint = this.#endpoint.endsWith("/") ? this.#endpoint.slice(0, -1) : this.#endpoint;

        const response = await axios.get<T>(
            endpoint + method,
            config
        );

        if (response.status !== 200) {
            throw Error("Error received: " + JSON.stringify(response.data));
        }

        const decoded = returnSchema.safeParse(response.data);
        if (!decoded.success) {
            throw Error("Broken response received: " + decoded.error.format()._errors.join(", "));
        }

        return decoded.data;
    }

    /**
     * Post method of adapter.
     * @param method
     * @param params
     * @param returnSchema
     */
    private async post<T>(method: string, params: any, returnSchema: z.ZodType<T>) {
        const headers: { [key: string]: any } = {
            "Content-Type": "application/json"
        };
        if (this.#apiKey) {
            headers["X-API-Key"] = this.#apiKey;
        }

        const config: { [key: string]: any } = {
            headers,
            timeout: this.#timeout
        };
        if (this.#adapter) {
            config.adapter = this.#adapter;
        }

        const endpoint = this.#endpoint.endsWith("/") ? this.#endpoint.slice(0, -1) : this.#endpoint;

        const response = await axios.post<{ ok: boolean, result: T }>(
            endpoint + method,
            params,
            config
        );

        if (response.status !== 200) {
            throw Error("Error received: " + JSON.stringify(response.data));
        }

        const decoded = returnSchema.safeParse(response.data);
        if (!decoded.success) {
            throw Error("Broken response received: " + decoded.error.format()._errors.join(", "));
        }

        return decoded.data;
    }

    /**
     * Serialization of stack items.
     * @param items
     */
    static serializeStack(items: TupleItem[]) {
        const stack: any[] = [];

        for (const item of items) {
            if (item.type === "int") {
                stack.push({
                    type: "num",
                    value: item.value.toString()
                });
                continue;
            }

            if (item.type === "cell") {
                stack.push({
                    type: "cell",
                    value: item.cell.toBoc().toString("base64")
                });
                continue;
            }

            if (item.type === "slice") {
                stack.push({
                    type: "slice",
                    value: item.cell.toBoc().toString("base64")
                });
                continue;
            }

            throw Error(`Unsupported stack item type received: ${item.type}`);
        }

        return stack;
    }

    /**
     * Deserialization of stack items.
     * @param items
     */
    static parseStack(items: any[]) {
        const stack: TupleItem[] = [];

        for (const item of items) {
            stack.push(TonHttpApiV3.parseStackItem(item));
        }

        return new TupleReader(stack);
    }

    /**
     * Deserialization of stack item.
     * @param item
     */
    static parseStackItem(item: any): TupleItem {
        if (item.value === null) {
            return {
                type: "null"
            };
        }

        if (item.type === "num") {
            if (item.value.startsWith("-")) {
                return {
                    type: "int",
                    value: -BigInt(item.value.slice(1))
                };
            }

            return {
                type: "int",
                value: BigInt(item.value)
            };
        }

        if (item.type === "cell") {
            return {
                type: "cell",
                cell: Cell.fromBase64(item.value)
            };
        }

        if (item.type === "slice") {
            return {
                type: "slice",
                cell: Cell.fromBase64(item.value)
            };
        }

        if (item.type === "list" || item.type === "tuple") {
            if (item.value.length === 0) {
                return {
                    type: "null"
                };
            }

            return {
                type: item.type,
                items: item.value.map(TonHttpApiV3.parseStackItem)
            };
        }

        throw Error(`Unsupported stack item type: ${item.type}`);
    }
}



