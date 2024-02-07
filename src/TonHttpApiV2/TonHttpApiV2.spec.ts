import { TonHttpApiV2 } from "./TonHttpApiV2";

describe("TonHttpApiV2", () => {
    const api = new TonHttpApiV2({
        endpoint: "https://toncenter.com/",
        apiKey: ""
    });

    it("should get address information", async () => {
        const data = await api.getAddressInformation("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N");
        console.log(data);
    });

    it("should get extended address information", async () => {
        const data = await api.getExtendedAddressInformation("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N");
        console.log(data);
    });

    it("should get wallet information", async () => {
        const data = await api.getWalletInformation("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N");
        console.log(data);
    });

    it("should get address balance", async () => {
        const data = await api.getAddressBalance("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N");
        console.log(data);
    });

    it("should get address state", async () => {
        const data = await api.getAddressState("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N");
        console.log(data);
    });

    it("should pack address", async () => {
        const data = await api.packAddress("0:83DFD552E63729B472FCBCC8C45EBCC6691702558B68EC7527E1BA403A0F31A8");
        console.log(data);
    });

    it("should unpack address", async () => {
        const data = await api.unpackAddress("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N");
        console.log(data);
    });

    it("should detect address", async () => {
        const data = await api.detectAddress("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N");
        console.log(data);
    });

    it("should get masterchain info", async () => {
        const data = await api.getMasterchainInfo();
        console.log(data);
    });

    it("should get masterchain block signatures", async () => {
        const data = await api.getMasterchainBlockSignatures((await api.getMasterchainInfo()).last.seqno);
        console.log(data);
    });

    it("should get consensus block", async () => {
        const data = await api.getConsensusBlock();
        console.log(data);
    });

    it("should lookup block", async () => {
        const data = await api.lookupBlock(
            0,
            "-9223372036854775808",
            {
                // seqno: 40549700,
                lt: "43146370000003"
            }
        );
        console.log(data);
    });

    it("should get shards", async () => {
        const data = await api.getShards((await api.getMasterchainInfo()).last.seqno);
        console.log(data);
    });

    it("should get shards block proof", async () => {
        const masterchain = await api.getMasterchainInfo();
        const shards = await api.getShards(masterchain.last.seqno);
        const data = await api.getShardBlockProof(
            shards.shards[0].workchain,
            shards.shards[0].shard,
            shards.shards[0].seqno,
            { from_seqno: masterchain.last.seqno }
        );
        console.log(data);
    });

    it("should get block header", async () => {
        const data = await api.getBlockHeader(
            0,
            "-9223372036854775808",
            40549700,
            {
                root_hash: "aJI/eZX4iztmmjVvcF3lquTkVmn3UxgCALYapNPoH5E=",
                file_hash: "0w+kLck7NZRzOtU3RWjcq8yJcwFYl67NWftLl/fDMmU="
            }
        );
        console.log(data);
    });

    it("should get block transactions", async () => {
        const data = await api.getBlockTransactions(
            0,
            "-9223372036854775808",
            40549700,
            { after_lt: "43146370000003" }
        );
        console.log(data);
    });

    it("should get transactions", async () => {
        const data = await api.getTransactions("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N");
        console.log(data);
    });

    it("should try locate tx", async () => {
        const data = await api.tryLocateTx(
            "EQAI9nJ0-fZ618dBA1CVgAPCExXh-Z2y5mlrfJdj0cVp16wn",
            "EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N",
            "43164150000002"
        );
        console.log(data);
    });

    it("should try locate result tx", async () => {
        const data = await api.tryLocateResultTx(
            "EQAI9nJ0-fZ618dBA1CVgAPCExXh-Z2y5mlrfJdj0cVp16wn",
            "EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N",
            "43164150000002"
        );
        console.log(data);
    });

    it("should try locate source tx", async () => {
        const data = await api.tryLocateResultTx(
            "EQAI9nJ0-fZ618dBA1CVgAPCExXh-Z2y5mlrfJdj0cVp16wn",
            "EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N",
            "43164150000002"
        );
        console.log(data);
    });

    it("should get config param", async () => {
        const info = await api.getMasterchainInfo();
        const data = await api.getConfigParam(0, {
            seqno: info.last.seqno
        });
        console.log(data);
    });

    it("should run get method", async () => {
        const data = await api.runGetMethod(
            "EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N",
            "seqno",
            []
        );
        console.log(data);
    });

    // need to generate new boc for test (this test works only once because it depends on seqno)
    // it("should send boc", async () => {
    //     const data = await api.sendBoc(
    //         "te6cckEBAgEAuQAB4YgBiXTopEXQzb36+G+zgvv3jDq3EWF+gxSlVtOer7SaNVoFoUdh4AH70EV+XiujkojUzRUj0IFeTPzSOO3USQ4Idjdy4ve0gnlqKGlMubbzSx2AyfqmGwGyuVb5HpC4pDDYIU1NGLsruTzoAAAAUAAMAQCGYgBB7+qpcxuU2jl+XmRiL15jNIuBKsW0djqT8N0gHQeY1CAvrwgAAAAAAAAAAAAAAAAAAAAAAABIZWxsbyB3b3JsZHkAek0="
    //     );
    //     console.log(data);
    // });

    // need to generate new boc for test (this test works only once because it depends on seqno)
    // it("should send boc return hash", async () => {
    //     const data = await api.sendBocReturnHash(
    //         "te6cckEBAgEAuQAB4YgBiXTopEXQzb36+G+zgvv3jDq3EWF+gxSlVtOer7SaNVoFoUdh4AH70EV+XiujkojUzRUj0IFeTPzSOO3USQ4Idjdy4ve0gnlqKGlMubbzSx2AyfqmGwGyuVb5HpC4pDDYIU1NGLsruTzoAAAAUAAMAQCGYgBB7+qpcxuU2jl+XmRiL15jNIuBKsW0djqT8N0gHQeY1CAvrwgAAAAAAAAAAAAAAAAAAAAAAABIZWxsbyB3b3JsZHkAek0="
    //     );
    //     console.log(data);
    // });

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
