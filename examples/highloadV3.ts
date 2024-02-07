// import { TonClientV3, TonClientV2 } from "../src";
// import { HighloadWalletContractV2 } from "ton-highload-wallet-contract";
// import { mnemonicToPrivateKey } from "@ton/crypto";
// import { internal } from "@ton/core";
//
// const main = async () => {
//     const client = new TonClientV3({
//         endpoint: "https://testnet.toncenter.com/",
//         apiKey: "",
//     });
//
//     const mnemonic = [
//         "sunset",
//         "success",
//         "icon",
//         "unveil",
//         "science",
//         "fault",
//         "explain",
//         "demise",
//         "pass",
//         "empower",
//         "outside",
//         "merit"
//     ];
//
//     // Create contract
//     const key = await mnemonicToPrivateKey(mnemonic);
//     const contract = client.open(HighloadWalletContractV2.create({ publicKey: key.publicKey, workchain: 0 }));
//     console.log(contract.address);
//
//     // Send transfer
//     await contract.sendTransfer({
//         secretKey: key.secretKey,
//         messages: [
//             internal({
//                 to: "EQBYivdc0GAk-nnczaMnYNuSjpeXu2nJS3DZ4KqLjosX5sVC",
//                 value: "0.2",
//                 body: "test 1",
//                 bounce: false,
//             }),
//             internal({
//                 to: "EQBYivdc0GAk-nnczaMnYNuSjpeXu2nJS3DZ4KqLjosX5sVC",
//                 value: "0.2",
//                 body: "test 2",
//                 bounce: false,
//             })
//         ],
//     });
// };
//
// main();
