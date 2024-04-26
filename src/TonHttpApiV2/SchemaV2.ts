// https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl

import { z } from "zod";

// Balance
export const balance = z.union([z.number(), z.string()]);
export type Balance = z.infer<typeof balance>;

// WalletId
export const walletId = z.union([z.number(), z.string()]);
export type WalletId = z.infer<typeof walletId>;

// Fee
export const fee = z.union([z.number(), z.string()]);
export type Fee = z.infer<typeof fee>;

// State
export const state = z.union([
    z.literal("active"),
    z.literal("uninitialized"),
    z.literal("frozen")
]);
export type State = z.infer<typeof state>;

// BlockIdExt
export const blockIdExt = z.object({
    "@type": z.literal("ton.blockIdExt"),
    workchain: z.number(),
    shard: z.string(),
    seqno: z.number(),
    root_hash: z.string(),
    file_hash: z.string()
});
export type BlockIdExt = z.infer<typeof blockIdExt>;

// TransactionId
export const transactionId = z.object({
    "@type": z.literal("internal.transactionId"),
    lt: z.string(),
    hash: z.string(),
});
export type TransactionId = z.infer<typeof transactionId>;

// AccountAddress
export const accountAddress = z.object({
    "@type": z.literal("accountAddress"),
    account_address: z.string()
});
export type AccountAddress = z.infer<typeof accountAddress>;

// RWalletLimit
export const rWalletLimit = z.object({
    "@type": z.literal("rwallet.limit"),
    seconds: z.number(),
    value: z.number()
});
export type RWalletLimit = z.infer<typeof rWalletLimit>;

// RWalletConfig
export const rWalletConfig = z.object({
    "@type": z.literal("rwallet.config"),
    start_at: z.number(),
    limits: z.array(rWalletLimit)
});
export type RWalletConfig = z.infer<typeof rWalletConfig>;

// AccountState
export const accountState = z.union([
    z.object({
        "@type": z.literal("raw.accountState"),
        code: z.string(),
        data: z.string(),
        frozen_hash: z.string()
    }),
    z.object({
        "@type": z.literal("wallet.v3.accountState"),
        wallet_id: walletId,
        seqno: z.number()
    }),
    z.object({
        "@type": z.literal("wallet.v4.accountState"),
        wallet_id: walletId,
        seqno: z.number()
    }),
    z.object({
        "@type": z.literal("wallet.highload.v1.accountState"),
        wallet_id: walletId,
        seqno: z.number()
    }),
    z.object({
        "@type": z.literal("wallet.highload.v2.accountState"),
        wallet_id: walletId
    }),
    z.object({
        "@type": z.literal("dns.accountState"),
        wallet_id: walletId
    }),
    z.object({
        "@type": z.literal("rwallet.accountState"),
        wallet_id: walletId,
        seqno: z.number(),
        unlocked_balance: balance,
        config: rWalletConfig
    })
]);
export type AccountState = z.infer<typeof accountState>;

// AddressInformation
export const addressInformation = z.object({
    "@type": z.literal("raw.fullAccountState"),
    balance: z.union([z.number(), z.string()]),
    code: z.string(),
    data: z.string(),
    last_transaction_id: transactionId,
    block_id: blockIdExt,
    frozen_hash: z.string(),
    sync_utime: z.number(),
    state: state
});
export type AddressInformation = z.infer<typeof addressInformation>;

// ExtendedAddressInformation
export const extendedAddressInformation = z.object({
    "@type": z.literal("fullAccountState"),
    balance: z.union([z.number(), z.string()]),
    last_transaction_id: transactionId,
    block_id: blockIdExt,
    sync_utime: z.number(),
    address: accountAddress,
    account_state: accountState,
    revision: z.number()
});
export type ExtendedAddressInformation = z.infer<typeof extendedAddressInformation>;

// WalletInformation
export const walletInformation = z.object({
    wallet: z.boolean(),
    balance: z.union([z.number(), z.string()]),
    account_state: z.string(),
    wallet_type: z.string(),
    seqno: z.number(),
    last_transaction_id: transactionId,
    wallet_id: walletId
});
export type WalletInformation = z.infer<typeof walletInformation>;

// AddressBalance
export const addressBalance = balance;
export type AddressBalance = z.infer<typeof addressBalance>; // alias

// AddressState
export const addressState = state;
export type AddressState = z.infer<typeof addressState>; // alias

// PackAddress
export const packAddress = z.string();
export type PackAddress = z.infer<typeof packAddress>;

// UnpackAddress
export const unpackAddress = z.string();
export type UnpackAddress = z.infer<typeof unpackAddress>;

// DetectAddress
export const detectAddress = z.object({
    raw_form: z.string(),
    bounceable: z.object({
        b64: z.string(),
        b64url: z.string(),
    }),
    non_bounceable: z.object({
        b64: z.string(),
        b64url: z.string(),
    }),
    given_type: z.union([
        z.literal("raw_form"),
        z.literal("dns"),
        z.literal("friendly_bounceable"),
        z.literal("friendly_non_bounceable")
    ]),
    test_only: z.boolean()
});
export type DetectAddress = z.infer<typeof detectAddress>;

// MasterchainInfo
export const masterchainInfo = z.object({
    "@type": z.literal("blocks.masterchainInfo"),
    last: blockIdExt,
    state_root_hash: z.string(),
    init: blockIdExt
});
export type MasterchainInfo = z.infer<typeof masterchainInfo>;

// Signature
export const signature = z.object({
    "@type": z.literal("blocks.signature"),
    node_id_short: z.string(),
    signature: z.string()
});
export type Signature = z.infer<typeof signature>;

// MasterchainBlockSignatures
export const masterchainBlockSignatures = z.object({
    "@type": z.literal("blocks.blockSignatures"),
    id: blockIdExt,
    signatures: z.array(signature)
});
export type MasterchainBlockSignatures = z.infer<typeof masterchainBlockSignatures>;

// ShardBlockLink
export const shardBlockLink = z.object({
    "@type": z.literal("blocks.shardBlockLink"),
    id: blockIdExt,
    proof: z.string()
});
export type ShardBlockLink = z.infer<typeof shardBlockLink>;

// BlockLinkBack
export const blockLinkBack = z.object({
    "@type": z.literal("blocks.blockLinkBack"),
    to_key_block: z.boolean(),
    from: blockIdExt,
    to: blockIdExt,
    dest_proof: z.string(),
    proof: z.string(),
    state_proof: z.string()
});
export type BlockLinkBack = z.infer<typeof blockLinkBack>;

// ShardBlockProof
export const shardBlockProof = z.object({
    "@type": z.literal("blocks.shardBlockProof"),
    from: blockIdExt,
    mc_id: blockIdExt,
    links: z.array(shardBlockLink),
    mc_proof: z.array(blockLinkBack)
});
export type ShardBlockProof = z.infer<typeof shardBlockProof>;

// ConsensusBlock
export const consensusBlock = z.object({
    consensus_block: z.number(),
    timestamp: z.number()
});
export type ConsensusBlock = z.infer<typeof consensusBlock>;

// LookupBlock
export const lookupBlock = blockIdExt;
export type LookupBlock = z.infer<typeof lookupBlock>;

// Shards
export const shards = z.object({
    "@type": z.literal("blocks.shards"),
    shards: z.array(blockIdExt)
});
export type Shards = z.infer<typeof shards>;
export type BlockShards = z.infer<typeof shards>;

// ShortTxId
export const shortTxId = z.object({
    "@type": z.literal("blocks.shortTxId"),
    mode: z.number(),
    account: z.string(),
    lt: z.string(),
    hash: z.string()
});
export type ShortTxId = z.infer<typeof shortTxId>;

// BlockTransactions
export const blockTransactions = z.object({
    "@type": z.literal("blocks.transactions"),
    id: blockIdExt,
    req_count: z.number(),
    incomplete: z.boolean(),
    transactions: z.array(shortTxId)
});
export type BlockTransactions = z.infer<typeof blockTransactions>;

// BlockHeader
export const blockHeader = z.object({
    "@type": z.literal("blocks.header"),
    id: blockIdExt,
    global_id: z.number(),
    version: z.number(),
    flags: z.number(),
    after_merge: z.boolean(),
    after_split: z.boolean(),
    before_split: z.boolean(),
    want_merge: z.boolean(),
    want_split: z.boolean(),
    validator_list_hash_short: z.number(),
    catchain_seqno: z.number(),
    min_ref_mc_seqno: z.number(),
    is_key_block: z.boolean(),
    prev_key_block_seqno: z.number(),
    start_lt: z.string(),
    end_lt: z.string(),
    gen_utime: z.number(),
    vert_seqno: z.number(),
    prev_blocks: z.array(blockIdExt)
});
export type BlockHeader = z.infer<typeof blockHeader>;

// MessageData
export const messageData = z.union([
    z.object({
        "@type": z.literal("msg.dataRaw"),
        body: z.string(),
        init_state: z.string()
    }),
    z.object({
        "@type": z.literal("msg.dataText"),
        text: z.string()
    }),
    z.object({
        "@type": z.literal("msg.dataDecryptedText"),
        text: z.string()
    }),
    z.object({
        "@type": z.literal("msg.dataEncryptedText"),
        text: z.string()
    })
]);
export type MessageData = z.infer<typeof messageData>;

// Message
export const message = z.object({
    "@type": z.literal("raw.message"),
    source: z.string(),
    destination: z.string(),
    value: z.string(),
    fwd_fee: fee,
    ihr_fee: fee,
    created_lt: z.string(),
    body_hash: z.string(),
    msg_data: messageData,
    message: z.string().optional()
});
export type Message = z.infer<typeof message>;

// Transaction
export const transaction = z.object({
    "@type": z.literal("raw.transaction"),
    address: accountAddress,
    utime: z.number(),
    data: z.string(),
    transaction_id: transactionId,
    fee: fee,
    storage_fee: fee,
    other_fee: fee,
    in_msg: message,
    out_msgs: z.array(message)
});
export type Transaction = z.infer<typeof transaction>;

// Transactions
export const transactions = z.array(transaction);
export type Transactions = z.infer<typeof transactions>;

// LocateTx
export const tryLocateTx = transaction;
export type LocateTx = z.infer<typeof tryLocateTx>;

// LocateResultTx
export const tryLocateResultTx = transaction;
export type LocateResultTx = z.infer<typeof tryLocateResultTx>;

// LocateSourceTx
export const tryLocateSourceTx = transaction;
export type LocateSourceTx = z.infer<typeof tryLocateSourceTx>;

// TvmCell
export const tvmCell = z.object({
    "@type": z.literal("tvm.cell"),
    bytes: z.string()
});
export type TvmCell = z.infer<typeof tvmCell>;

// ConfigParam
export const configParam = z.object({
    "@type": z.literal("configInfo"),
    config: tvmCell
});
export type ConfigParam = z.infer<typeof configParam>;

// CallGetMethod
export const callGetMethod = z.object({
    gas_used: z.number(),
    exit_code: z.number(),
    stack: z.array(z.unknown())
});
export type CallGetMethod = z.infer<typeof callGetMethod>;

// SendBoc
export const sendBoc = z.object({
    "@type": z.literal("ok")
});
export type SendBoc = z.infer<typeof sendBoc>;

// sendBocReturnHash
export const sendBocReturnHash = z.object({
    "@type": z.literal("raw.extMessageInfo"),
    "hash": z.string()
});
export type SendBocReturnHash = z.infer<typeof sendBocReturnHash>;

// Fees
export const fees = z.object({
    "@type": z.literal("fees"),
    in_fwd_fee: fee,
    storage_fee: fee,
    gas_fee: fee,
    fwd_fee: fee
});
export type Fees = z.infer<typeof fees>;

// EstimateFee
export const estimateFee = z.object({
    "@type": z.literal("query.fees"),
    source_fees: fees,
    destination_fees: z.array(fees)
});
export type EstimateFee = z.infer<typeof estimateFee>;
