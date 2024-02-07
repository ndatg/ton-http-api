import { Address, TupleBuilder } from "@ton/core";
import { TonClientV2 } from "../src";

const main = async () => {
    const client = new TonClientV2({
        endpoint: "https://toncenter.com/"
    });

    // const data = await client.callGetMethod(
    //     Address.parse("EQCkWxfyhAkim3g2DjKQQg8T5P4g-Q1-K_jErGcDJZ4i-vqR"),
    //     "get_pool_full_data_raw",
    //     []
    // );
    // console.log(data);

    const stack = new TupleBuilder();
    stack.writeAddress(Address.parse("EQAUrAcsVikSMtfNk93sEgI1xeXPXiAn9Ju8WqJ25dIk2O19"));
    const data = await client.callGetMethod(
        Address.parse("EQBynBO23ywHy_CgarY9NK9FTz0yDsG82PtcbSTQgGoXwiuA"),
        "get_wallet_address",
        stack.build()
    );
    console.log(data.stack.readAddress());
};

main();
