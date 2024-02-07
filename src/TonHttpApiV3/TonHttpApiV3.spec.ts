import { TonHttpApiV3 } from "./TonHttpApiV3";

describe("TonHttpApiV3", () => {
    const api = new TonHttpApiV3({
        endpoint: "https://toncenter.com/",
        apiKey: ""
    });

    it("should get account", async () => {
        const data = await api.getAccount("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N");
        console.log(data);
    });

    it("should get wallet", async () => {
        const data = await api.getWallet("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N");
        console.log(data);
    });

    it("should get masterchain info", async () => {
        const data = await api.getMasterchainInfo();
        console.log(data);
    });

    it("should get blocks", async() => {
        const data = await api.getBlocks({ limit: 1 });
        console.log(data);
    });

    it("should get masterchain block shards", async () => {
        const data = await api.getMasterchainBlockShards(35868280);
        console.log(data);
    });

    it("should get transactions", async () => {
        const data = await api.getTransactions();
        console.log(data);
    });

    it("should get transactions by masterchain block", async () => {
        const data = await api.getTransactionsByMasterchainBlock(35878012);
        console.log(data);
    });

    it("should get transactions by message", async () => {
        const data = await api.getTransactionsByMessage("in", "C54AC1AED050C90BA5A4E28162BAADC6E488AB73A1B15401A852597E52D628CA");
        console.log(data);
    });

    it("should get adjacent transactions", async () => {
        const data = await api.getAdjacentTransactions("DAF4991D2D167CE88820F7ADF03069E2FDFCE1E73009C17237C6F38558EA6330");
        console.log(data);
    });

    it("should get traces", async () => {
        const data = await api.getTraces({
            trace_id: ["1823522290912790511"]
        });
        console.log(data);
    });

    it("should get transaction trace", async () => {
        const data = await api.getTransactionTrace("F05E09E2EDA153BD0C030CD824FD3171979A2E7B2E32208228CE08792D5FAB69");
        console.log(data);
    });

    it("should get messages", async () => {
        const data = await api.getMessages({
            source: "UQAmsVBk_msf-WUkKvt2Uq15tgeJ6weDWXJEsBuVEVjkTWgb",
            destination: "UQDXgkYbrxDpRZD6PUZd0jwdjZmYYQd7l5YOE2UeXunLD5hj"
        });
        console.log(data);
    });

    it("should get nft collections", async () => {
        const data = await api.getNftCollections({
            collection_address: "EQCA14o1-VWhS2efqoh_9M1b_A9DtKTuoqfmkn83AbJzwnPi"
        });
        console.log(data);
    });

    it("should get nft items", async () => {
        const data = await api.getNftItems({
            collection_address: "EQCA14o1-VWhS2efqoh_9M1b_A9DtKTuoqfmkn83AbJzwnPi"
        });
        console.log(data);
    });

    it("should get nft transfers", async () => {
        const data = await api.getNftTransfers({
            collection_address: "EQCA14o1-VWhS2efqoh_9M1b_A9DtKTuoqfmkn83AbJzwnPi"
        });
        console.log(data);
    });

    it("should get jetton masters", async () => {
        const data = await api.getJettonMasters({
            address: "EQBynBO23ywHy_CgarY9NK9FTz0yDsG82PtcbSTQgGoXwiuA"
        });
        console.log(data);
    });

    it("should get jetton wallets", async () => {
        const data = await api.getJettonWallets({
            jetton_address: "EQBynBO23ywHy_CgarY9NK9FTz0yDsG82PtcbSTQgGoXwiuA"
        });
        console.log(data);
    });

    it("should get jetton transfers", async () => {
        const data = await api.getJettonTransfers({
            jetton_master: "EQBynBO23ywHy_CgarY9NK9FTz0yDsG82PtcbSTQgGoXwiuA"
        });
        console.log(data);
    });

    it("should get jetton burns", async () => {
        const data = await api.getJettonBurns({
            jetton_master: "EQBynBO23ywHy_CgarY9NK9FTz0yDsG82PtcbSTQgGoXwiuA"
        });
        console.log(data);
    });

    it("should get top account by balance", async () => {
        const data = await api.topAccountByBalance();
        console.log(data);
    });

    // it("should send message", async () => {
    //     const data = await api.sendMessage(
    //         "te6cckEBAgEAuQAB4YgBiXTopEXQzb36+G+zgvv3jDq3EWF+gxSlVtOer7SaNVoFoUdh4AH70EV+XiujkojUzRUj0IFeTPzSOO3USQ4Idjdy4ve0gnlqKGlMubbzSx2AyfqmGwGyuVb5HpC4pDDYIU1NGLsruTzoAAAAUAAMAQCGYgBB7+qpcxuU2jl+XmRiL15jNIuBKsW0djqT8N0gHQeY1CAvrwgAAAAAAAAAAAAAAAAAAAAAAABIZWxsbyB3b3JsZHkAek0="
    //     );
    //     console.log(data);
    // });

    it("should run get method", async () => {
        const data = await api.runGetMethod(
            "EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N",
            "seqno",
            []
        );
        console.log(data);
    });

    it("should estimate fee", async () => {
        const data = await api.estimateFee(
            "EQDEunRSIuhm3v18N9nBffvGHVuIsL9BilKrac9X2k0arXP6",
            "te6cckEBAgEAuQAB4YgBiXTopEXQzb36+G+zgvv3jDq3EWF+gxSlVtOer7SaNVoCYhGBOOuoQn/pAJ4zo2jKnhVV/u6BeKG7I8cnnRbVULUWzvSr/kX/qZ2IgJw8T0m+j2qJcrdn4EnuWO6f5y0oQU1NGLsrualIAAAAWAAMAQCGYgBB7+qpcxuU2jl+XmRiL15jNIuBKsW0djqT8N0gHQeY1CAvrwgAAAAAAAAAAAAAAAAAAAAAAABIZWxsbyB3b3JsZGhxjnc=",
            "",
            "",
            true
        );
        console.log(data);
    });
});
