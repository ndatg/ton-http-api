import { z } from "zod";

// AccountStatus
export const accountStatus = z.union([
    z.literal("uninit"),
    z.literal("frozen"),
    z.literal("active"),
    z.literal("nonexist")
]);
export type AccountStatus = z.infer<typeof accountState>;

// Account
export const account = z.object({
    balance: z.string(),
    code: z.string().nullable(),
    data: z.string().nullable(),
    last_transaction_lt: z.string().nullable(),
    last_transaction_hash: z.string().nullable(),
    frozen_hash: z.string().nullable(),
    status: accountStatus
});
export type Account = z.infer<typeof account>;

// AccountBalance
export const accountBalance = z.object({
    account: z.string(),
    balance: z.string()
});
export type AccountBalance = z.infer<typeof accountBalance>;

// AccountState
export const accountState = z.object({
    hash: z.string(),
    // account: z.string(),
    balance: z.string().nullable(),
    account_status: accountStatus.nullable(),
    frozen_hash: z.string().nullable(),
    code_hash: z.string().nullable(),
    data_hash: z.string().nullable()
});
export type AccountState = z.infer<typeof accountState>;

// AddressBookEntry
export const addressBookEntry = z.object({
    user_friendly: z.string()
});
export type AddressBookEntry = z.infer<typeof addressBookEntry>;

// Wallet
export const wallet = z.object({
    balance: z.string(),
    wallet_type: z.string().nullable(),
    seqno: z.number().nullable(),
    wallet_id: z.number().nullable(),
    last_transaction_lt: z.string().nullable(),
    last_transaction_hash: z.string().nullable(),
    status: z.string()
});
export type Wallet = z.infer<typeof wallet>;

// BlockReference
export const blockReference = z.object({
    workchain: z.number(),
    shard: z.string(),
    seqno: z.number()
});
export type BlockReference = z.infer<typeof blockReference>;

// Block
export const block = z.object({
    workchain: z.number(),
    shard: z.string(),
    seqno: z.number(),
    root_hash: z.string(),
    file_hash: z.string(),
    global_id: z.number(),
    version: z.number(),
    after_merge: z.boolean(),
    before_split: z.boolean(),
    after_split: z.boolean(),
    want_split: z.boolean(),
    key_block: z.boolean(),
    vert_seqno_incr: z.boolean(),
    flags: z.number(),
    gen_utime: z.string(),
    start_lt: z.string(),
    end_lt: z.string(),
    validator_list_hash_short: z.number(),
    gen_catchain_seqno: z.number(),
    min_ref_mc_seqno: z.number(),
    prev_key_block_seqno: z.number(),
    vert_seqno: z.number(),
    master_ref_seqno: z.number().nullable(),
    rand_seed: z.string(),
    created_by: z.string(),
    tx_count: z.number().nullable(),
    masterchain_block_ref: blockReference.nullable().optional()
});
export type Block = z.infer<typeof block>;

// MasterchainInfo
export const masterchainInfo = z.object({
    first: block,
    last: block
});
export type MasterchainInfo = z.infer<typeof masterchainInfo>;

// Blocks
export const blocks = z.object({
    blocks: z.array(block)
});
export type Blocks = z.infer<typeof blocks>;

// MasterchainBlockShards
export const masterchainBlockShards = blocks;
export type MasterchainBlockShards = z.infer<typeof masterchainBlockShards>;

// TextComment
export const textComment = z.object({
    type: z.literal("text_comment"),
    comment: z.string()
});
export type TextComment = z.infer<typeof textComment>;

// BinaryComment
export const binaryComment = z.object({
    type: z.literal("binary_comment"),
    hex_comment: z.string()
});
export type BinaryComment = z.infer<typeof binaryComment>;

// MesageContent
export const messageContent = z.object({
    hash: z.string(),
    body: z.string(),
    decoded: z.union([
        textComment,
        binaryComment
    ]).nullable()
});
export type MessageContent = z.infer<typeof messageContent>;

// MessageInitState
export const messageInitState = z.object({
    hash: z.string(),
    body: z.string()
});
export type MessageInitState = z.infer<typeof messageInitState>;

// Message
export const message = z.object({
    hash: z.string(),
    source: z.string().nullable(),
    destination: z.string().nullable(),
    value: z.string().nullable(),
    fwd_fee: z.string().nullable(),
    ihr_fee: z.string().nullable(),
    created_lt: z.string().nullable(),
    created_at: z.string().nullable(),
    opcode: z.string().nullable(),
    ihr_disabled: z.boolean().nullable(),
    bounce: z.boolean().nullable(),
    bounced: z.boolean().nullable(),
    import_fee: z.string().nullable(),
    message_content: messageContent.nullable(),
    init_state: messageInitState.nullable()
});
export type Message = z.infer<typeof message>;

// Transaction
export const transaction = z.object({
    account: z.string(),
    hash: z.string(),
    lt: z.string(),
    now: z.number(),
    orig_status: accountStatus,
    end_status: accountStatus,
    total_fees: z.string(),
    prev_trans_hash: z.string(),
    prev_trans_lt: z.string(),
    description: z.any(),
    block_ref: blockReference.nullable(),
    in_msg: message.nullable(),
    out_msgs: z.array(message),
    account_state_before: accountState.nullable(),
    account_state_after: accountState.nullable(),
    mc_block_seqno: z.number().nullable()
});
export type Transaction = z.infer<typeof transaction>;

// Transactions
export const transactions = z.object({
    transactions: z.array(transaction),
    address_book: z.record(z.string(), addressBookEntry)
});
export type Transactions = z.infer<typeof transactions>;

// TransactionTrace
export const transactionTrace = z.object({
    id: z.string(),
    transaction: transaction,
    children: z.array(z.any())
});
export type TransactionTrace = z.infer<typeof transactionTrace>;

// Traces
export const traces = z.array(transactionTrace.nullable());
export type Traces = z.infer<typeof traces>;

// Messages
export const messages = z.object({
    messages: z.array(message)
});
export type Messages = z.infer<typeof messages>;

// NftCollection
export const nftCollection = z.object({
    address: z.string(),
    owner_address: z.string().nullable(),
    last_transaction_lt: z.string(),
    next_item_index: z.string(),
    collection_content: z.any(),
    code_hash: z.string(),
    data_hash: z.string()
});
export type NftCollection = z.infer<typeof nftCollection>;

// NftCollections
export const nftCollections = z.object({
    nft_collections: z.array(nftCollection)
});
export type NftCollections = z.infer<typeof nftCollections>;

// NftItem
export const nftItem = z.object({
    address: z.string(),
    collection_address: z.string().nullable(),
    owner_address: z.string().nullable(),
    init: z.boolean(),
    index: z.string(),
    last_transaction_lt: z.string(),
    code_hash: z.string(),
    data_hash: z.string(),
    content: z.any(),
    collection: nftCollection.nullable()
});
export type NftItem = z.infer<typeof nftItem>;

// NftItems
export const nftItems = z.object({
    nft_items: z.array(nftItem)
});
export type NftItems = z.infer<typeof nftItems>;

// NftTransfer
export const nftTransfer = z.object({
    query_id: z.string(),
    nft_address: z.string(),
    transaction_hash: z.string(),
    transaction_lt: z.string(),
    transaction_now: z.number(),
    old_owner: z.string(),
    new_owner: z.string(),
    response_destination: z.string().nullable(),
    custom_payload: z.string().nullable(),
    forward_amount: z.string(),
    forward_payload: z.string().nullable()
});

// NftTransfers
export const nftTransfers = z.object({
    nft_transfers: z.array(nftTransfer)
});
export type NftTransfers = z.infer<typeof nftTransfers>;

// JettonMaster
export const jettonMaster = z.object({
    address: z.string(),
    total_supply: z.string(),
    mintable: z.boolean(),
    admin_address: z.string().nullable(),
    last_transaction_lt: z.string(),
    jetton_wallet_code_hash: z.string(),
    jetton_content: z.any(),
    code_hash: z.string(),
    data_hash: z.string()
});
export type JettonMaster = z.infer<typeof jettonMaster>;

// JettonMasters
export const jettonMasters = z.object({
    jetton_masters: z.array(jettonMaster)
});
export type JettonMasters = z.infer<typeof jettonMasters>;

// JettonWallet
export const jettonWallet = z.object({
    address: z.string(),
    balance: z.string(),
    owner: z.string(),
    jetton: z.string(),
    last_transaction_lt: z.string(),
    code_hash: z.string(),
    data_hash: z.string()
});
export type JettonWallet = z.infer<typeof jettonWallet>;

// JettonWallets
export const jettonWallets = z.object({
    jetton_wallets: z.array(jettonWallet)
});
export type JettonWallets = z.infer<typeof jettonWallets>;

export const jettonTransfer = z.object({
    query_id: z.string(),
    source: z.string(),
    destination: z.string(),
    amount: z.string(),
    source_wallet: z.string(),
    jetton_master: z.string(),
    transaction_hash: z.string(),
    transaction_lt: z.string(),
    transaction_now: z.number(),
    response_destination: z.string().nullable(),
    custom_payload: z.string().nullable(),
    forward_ton_amount: z.string().nullable(),
    forward_payload: z.string().nullable()
});
export type JettonTransfer = z.infer<typeof jettonTransfer>;

// JettonTransfers
export const jettonTransfers = z.object({
    jetton_transfers: z.array(jettonTransfer)
});
export type JettonTransfers = z.infer<typeof jettonTransfers>;

// JettonBurn
export const jettonBurn = z.object({
    query_id: z.string(),
    owner: z.string(),
    jetton_master: z.string(),
    transaction_hash: z.string(),
    transaction_lt: z.string(),
    transaction_now: z.number(),
    response_destination: z.string().nullable(),
    custom_payload: z.string().nullable(),
});
export type JettonBurn = z.infer<typeof jettonBurn>;

// JettonBurns
export const jettonBurns = z.object({
    jetton_burns: z.array(jettonBurn)
});
export type JettonBurns = z.infer<typeof jettonBurns>;

// TopAccountsByBalance
export const topAccountByBalance = z.array(accountBalance);
export type TopAccountByBalance = z.infer<typeof topAccountByBalance>;

// SendMessage
export const sendMessage = z.object({
    message_hash: z.string()
});
export type SendMessage = z.infer<typeof sendMessage>;

// RunGetMethod
export const runGetMethod = z.object({
    gas_used: z.number(),
    exit_code: z.number(),
    stack: z.array(z.object({
        type: z.union([
            z.literal("cell"),
            z.literal("slice"),
            z.literal("num"),
            z.literal("list"),
            z.literal("tuple"),
            z.literal("unsupported_type")
        ]),
        value: z.any()
    }))
});
export type RunGetMethod = z.infer<typeof runGetMethod>;

// Fee
export const fee = z.object({
    in_fwd_fee: z.number(),
    storage_fee: z.number(),
    gas_fee: z.number(),
    fwd_fee: z.number()
});

// EstimateFee
export const estimateFee = z.object({
    source_fees: fee,
    destination_fees: z.array(fee)
});
export type EstimateFee = z.infer<typeof estimateFee>;
