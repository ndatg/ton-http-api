import { z } from "zod";
import axios, { AxiosAdapter } from "axios";
import { Cell, TupleItem, TupleReader } from "@ton/core";
import * as Schema from "./SchemaV2";

export interface TonHttpApiV2Parameters {

    endpoint: string;

    apiKey?: string;

    timeout?: number;

    adapter?: AxiosAdapter;

}

export class TonHttpApiV2 {

    readonly #endpoint: string;

    readonly #timeout: number;

    readonly #apiKey?: string;

    readonly #adapter?: AxiosAdapter;

    constructor(params: TonHttpApiV2Parameters) {
        this.#endpoint = params.endpoint;
        this.#timeout = params?.timeout || 10_000;
        this.#apiKey = params?.apiKey;
        this.#adapter = params?.adapter;
    }

    /**
     * Get basic information about the address: balance, code, data, last_transaction_id.
     * @param address
     */
    async getAddressInformation(address: string) {
        return this.callJsonRpc(
            "getAddressInformation",
            {
                address
            },
            Schema.addressInformation
        );
    }

    /**
     * Similar to previous one but tries to parse additional information for known contract types.
     * This method is based on tonlib's function getAccountState.
     * For detecting wallets we recommend to use getWalletInformation.
     * @param address
     */
    async getExtendedAddressInformation(address: string) {
        return this.callJsonRpc(
            "getExtendedAddressInformation",
            {
                address
            },
            Schema.extendedAddressInformation
        );
    }

    /**
     * Retrieve wallet information.
     * This method parses contract state and currently supports more wallet types
     * than getExtendedAddressInformation: simple wallet, standart wallet, v3 wallet, v4 wallet.
     * @param address
     */
    async getWalletInformation(address: string) {
        return await this.callJsonRpc(
            "getWalletInformation",
            {
                address
            },
            Schema.walletInformation
        );
    }

    /**
     * Get balance (in nanotons) of a given address.
     * @param address
     */
    async getAddressBalance(address: string) {
        return this.callJsonRpc(
            "getAddressBalance",
            {
                address
            },
            Schema.addressBalance
        );
    }

    /**
     * Get state of a given address.
     * State can be either unitialized, active or frozen.
     * @param address
     */
    async getAddressState(address: string) {
        return this.callJsonRpc(
            "getAddressState",
            {
                address
            },
            Schema.addressState
        );
    }

    /**
     * Convert an address from raw to human-readable format.
     * @param address
     */
    async packAddress(address: string) {
        return this.callJsonRpc(
            "packAddress",
            {
                address
            },
            Schema.packAddress
        );
    }

    /**
     * Convert an address from human-readable to raw format.
     * @param address
     */
    async unpackAddress(address: string) {
        return this.callJsonRpc(
            "unpackAddress",
            {
                address
            },
            Schema.unpackAddress
        );
    }

    /**
     * Get all possible address forms.
     * @param address
     */
    async detectAddress(address: string) {
        return this.callJsonRpc(
            "detectAddress",
            {
                address
            },
            Schema.detectAddress
        );
    }

    /**
     * Get up-to-date masterchain state.
     */
    async getMasterchainInfo() {
        return this.callJsonRpc(
            "getMasterchainInfo",
            {},
            Schema.masterchainInfo
        );
    }

    /**
     * Get up-to-date masterchain state.
     * @param seqno
     */
    async getMasterchainBlockSignatures(seqno: number) {
        return this.callJsonRpc(
            "getMasterchainBlockSignatures",
            {
                seqno
            },
            Schema.masterchainBlockSignatures
        );
    }

    /**
     * Get merkle proof of shardchain block.
     * @param workchain
     * @param shard
     * @param seqno
     * @param [optional={ from_seqno }]
     */
    async getShardBlockProof(
        workchain: number, shard: string, seqno: number,
        optional?: { from_seqno?: number }
    ) {
        return this.callJsonRpc(
            "getShardBlockProof",
            {
                workchain, shard, seqno, ...optional
            },
            Schema.shardBlockProof
        );
    }

    /**
     * Get consensus block and its update timestamp.
     */
    async getConsensusBlock() {
        return this.callJsonRpc(
            "getConsensusBlock",
            {},
            Schema.consensusBlock
        );
    }

    /**
     * Look up block by either seqno, lt or unixtime.
     * @param workchain
     * @param shard
     * @param [optional={ seqno, lt, unixtime }]
     */
    async lookupBlock(
        workchain: number, shard: string,
        optional?: { seqno?: number, lt?: string, unixtime?: number }
    ) {
        return this.callJsonRpc(
            "lookupBlock",
            {
                workchain, shard, ...optional
            },
            Schema.lookupBlock
        );
    }

    /**
     * Get shards information.
     * @param seqno
     */
    async getShards(seqno: number) {
        return this.callJsonRpc(
            "shards",
            {
                seqno
            },
            Schema.shards
        );
    }

    /**
     * Get transactions of the given block.
     * @param workchain
     * @param shard
     * @param seqno
     * @param [optional={ root_hash, file_hash, after_lt, after_hash, count }]
     */
    async getBlockTransactions(
        workchain: number, shard: string, seqno: number,
        optional? : { root_hash?: string, file_hash?: string, after_lt?: string, after_hash?: string, count?: number }
    ) {
        return this.callJsonRpc(
            "getBlockTransactions",
            {
                workchain, shard, seqno, ...optional
            },
            Schema.blockTransactions
        );
    }

    /**
     * Get metadata of a given block.
     * @param workchain
     * @param shard
     * @param seqno
     * @param [optional={ root_hash, file_hash }]
     */
    async getBlockHeader(
        workchain: number, shard: string, seqno: number,
        optional?: { root_hash?: string, file_hash?: string }
    ) {
        return this.callJsonRpc(
            "getBlockHeader",
            {
                workchain, shard, seqno, ...optional
            },
            Schema.blockHeader
        );
    }

    /**
     * Get metadata of a given masterchain block.
     * @param seqno
     */
    async getMasterchainBlockHeader(seqno: number) {
        return this.getBlockHeader(-1, "-9223372036854775808", seqno);
    }

    /**
     * Get transactions of the given masterchain block.
     * @param seqno
     */
    async getMasterchainBlockTransactions(seqno: number) {
        return this.getBlockTransactions(-1, "-9223372036854775808", seqno);
    }

    /**
     * Get transaction history of a given address.
     * @param address
     * @param [optional={ limit, lt, hash, to_lt, archival }]
     */
    async getTransactions(
        address: string,
        optional?: { limit?: number, lt?: string, hash?: string, to_lt?: string, archival?: boolean }
    ) {
        return this.callJsonRpc(
            "getTransactions",
            {
                address, ...optional
            },
            Schema.transactions
        );
    }

    /**
     * Locate outcoming transaction of destination address by incoming message.
     * @param source
     * @param destination
     * @param created_lt
     */
    async tryLocateTx(source: string, destination: string, created_lt: string) {
        return this.callJsonRpc(
            "tryLocateTx",
            {
                source, destination, created_lt
            },
            Schema.tryLocateTx
        );
    }

    /**
     * Same as previous. Locate outcoming transaction of destination address by incoming message.
     * @param source
     * @param destination
     * @param created_lt
     */
    async tryLocateResultTx(source: string, destination: string, created_lt: string) {
        return this.callJsonRpc(
            "tryLocateResultTx",
            {
                source, destination, created_lt
            },
            Schema.tryLocateResultTx
        );
    }

    /**
     * Locate incoming transaction of source address by outcoming message.
     * @param source
     * @param destination
     * @param created_lt
     */
    async tryLocateSourceTx(source: string, destination: string, created_lt: string) {
        return this.callJsonRpc(
            "tryLocateSourceTx",
            {
                source, destination, created_lt
            },
            Schema.tryLocateSourceTx
        );
    }

    /**
     * Get config by id.
     * @param config_id
     * @param [optional={ seqno }]
     */
    async getConfigParam(config_id: number, optional? : { seqno?: number }) {
        return this.callJsonRpc(
            "getConfigParam",
            {
                config_id, ...optional
            },
            Schema.configParam
        );
    }

    /**
     * Run get method on smart contract.
     * @param address
     * @param method
     * @param stack
     */
    async runGetMethod(address: string, method: string, stack: TupleItem[]) {
        return this.callJsonRpc(
            "runGetMethod",
            {
                address, method, stack: TonHttpApiV2.serializeStack(stack)
            },
            Schema.callGetMethod
        );
    }

    /**
     * Send serialized boc file: fully packed and serialized external message to blockchain.
     * boc accepted in serialized format (b64-encoded).
     * @param boc
     */
    async sendBoc(boc: string) {
        return this.callJsonRpc("sendBoc",
            {
                boc
            },
            Schema.sendBoc
        );
    }

    /**
     * Send serialized boc file: fully packed and serialized external message to blockchain.
     * The method returns message hash.
     * boc accepted in serialized format (b64-encoded).
     * @param boc
     */
    async sendBocReturnHash(boc: string) {
        return this.callJsonRpc("sendBocReturnHash",
            {
                boc
            },
            Schema.sendBocReturnHash
        );
    }

    /**
     * Estimate fees required for query processing.
     * body, init-code and init-data accepted in serialized format (b64-encoded).
     * @param address
     * @param body
     * @param init_code
     * @param init_data
     * @param ignore_chksig
     */
    async estimateFee(address: string, body: string, init_code: string, init_data: string, ignore_chksig: boolean) {
        return this.callJsonRpc(
            "estimateFee",
            {
                address, body, init_code, init_data, ignore_chksig
            },
            Schema.estimateFee
        );
    }

    /**
     * Method to call jsonrpc.
     * @param method
     * @param params
     * @param returnSchema
     * @private
     */
    private async callJsonRpc<T>(method: string, params: any, returnSchema: z.ZodType<T>) {
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
            `${endpoint}/api/v2/jsonRPC`,
            {
                method,
                params,
                id: "ton-http-api",
                jsonrpc: "2.0"
            },
            config
        );

        if (response.status !== 200 || !response.data.ok) {
            throw Error("Error received: " + JSON.stringify(response.data));
        }

        const decoded = returnSchema.safeParse(response.data.result);
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
                stack.push([
                    "num",
                    item.value.toString()
                ]);
                continue;
            }

            if (item.type === "cell") {
                stack.push([
                    "tvm.Cell",
                    item.cell.toBoc().toString("base64")
                ]);
                continue;
            }

            if (item.type === "slice") {
                stack.push([
                    "tvm.Slice",
                    item.cell.toBoc().toString("base64")
                ]);
                continue;
            }

            if (item.type === "builder") {
                stack.push([
                    "tvm.Builder",
                    item.cell.toBoc().toString("base64")
                ]);
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
            stack.push(TonHttpApiV2.parseStackItem(item));
        }

        return new TupleReader(stack);
    }

    /**
     * Deserialization of stack item.
     * @param item
     */
    static parseStackItem(item: any): TupleItem {
        if (item[0] === "null") {
            return {
                type: "null"
            };
        }

        if (item[0] === "num") {
            if (item[1].startsWith("-")) {
                return {
                    type: "int",
                    value: -BigInt(item[1].slice(1))
                };
            }

            return {
                type: "int",
                value: BigInt(item[1])
            };
        }

        if (item[0] === "cell") {
            return {
                type: "cell",
                cell: Cell.fromBase64(item[1].bytes)
            };
        }

        if (item[0] === "slice") {
            return {
                type: "slice",
                cell: Cell.fromBase64(item[1].bytes)
            };
        }

        if (item[0] === "builder") {
            return {
                type: "builder",
                cell: Cell.fromBase64(item[1].bytes)
            };
        }

        if (item[0] === "list" || item[0] === "tuple") {
            // empty
            if (item[1].elements.length === 0) {
                return {
                    type: "null"
                };
            }

            return {
                type: item[0],
                items: item[1].elements.map(TonHttpApiV2.parseStackItemElement)
            };
        }

        throw Error(`Unsupported stack item type: ${item[0]}`);
    }

    /**
     * Deserialization of stack item element.
     * @param element
     */
    static parseStackItemElement(element: any): TupleItem {
        if (element["@type"] === "tvm.stackEntryNumber") {
            return {
                type: "int",
                value: BigInt(element.number.number)
            };
        }

        if (element["@type"] === "tvm.stackEntryCell") {
            return {
                type: "cell",
                cell: Cell.fromBase64(element.cell.bytes)
            };
        }

        if (element["@type"] === "tvm.stackEntryList") {
            return {
                type: "tuple",
                items: element.list.elements.map(TonHttpApiV2.parseStackItemElement)
            };
        }

        if (element["@type"] === "tvm.stackEntryTuple") {
            return {
                type: "tuple",
                items: element.tuple.elements.map(TonHttpApiV2.parseStackItemElement)
            };
        }

        throw Error(`Unsupported item element type: ${element["@type"]}`);
    }
}
