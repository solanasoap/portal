import { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { Metaplex, Pda } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, PublicKey, Transaction, LAMPORTS_PER_SOL } from "@solana/web3.js";
import Image from "next/image";
import WalletLogin from "../../components/WalletLogin";
import { useCallback, useEffect, useState } from "react";
import Header from "../../components/Header";
import Link from "next/link";
import dynamic from "next/dynamic";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { FundPotInstructionAccounts, FundPotInstructionArgs, PROGRAM_ID, WithdrawPotInstructionAccounts, WithdrawPotInstructionArgs, createFundPotInstruction, createWithdrawPotInstruction } from "../../lib/generated";
import { POT_TAG } from "../../lib/constants";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { BN } from "@project-serum/anchor";

const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

// TODO: Add the ability to have secrets on this page when you own the soap
// Like a secret code or location to a party (see StripDAO party)
// Only stored on our backend, not on-chain. Only visible if person authenticates ownership of soap.

// TODO: Add the ability to have secrets on this page when you own the soap
// Like a secret code or location to a party (see StripDAO party)
// Only stored on our backend, not on-chain. Only visible if person authenticates ownership of soap.

const connection = new Connection(process.env.NEXT_PUBLIC_RPC_ENDPOINT + process.env.NEXT_PUBLIC_HELIUS_API_KEY, "confirmed");
const metaplex = new Metaplex(connection);


const soapAddress: NextPage<{ soapDetails: soapDetails }> = ({ soapDetails }) => {
    const [amount, setamount] = useState(10);
    const [soapAddress, setSoapAddress] = useState('')
    const [potAddress, setPotAddress] = useState('')
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    useEffect(() => {
        setSoapAddress(soapDetails.Address)
        setPotAddress(soapDetails.PotAddress)
    }, [])

    const handleInputChange = (event) => {
        const newValue = event.target.value.replace(/\D/g, ''); // only allow digits
        if (newValue === event.target.value) {
            setamount(newValue);
        }
    };

    const submitFillUpPot = useCallback(async () => {
        if (!publicKey) throw new WalletNotConnectedError();
        if (amount < 1) {
            alert("Please put in an amount higher than 0");
            return;
        }

        const amountToTransfer = new BN((LAMPORTS_PER_SOL * 0.0021) * amount)


        const pot = Pda.find(PROGRAM_ID, [POT_TAG, new PublicKey(soapAddress).toBuffer(), publicKey.toBuffer()])
        console.log("Pot Address: ", pot.toBase58())

        const fundPotIxAccs: FundPotInstructionAccounts = {
            authority: publicKey,
            pot: new PublicKey(potAddress),
            mintAccount: new PublicKey(soapAddress),
        }

        const fundPotIxArgs: FundPotInstructionArgs = {
            solLamports: amountToTransfer
        }

        const fundPotIx = createFundPotInstruction(
            fundPotIxAccs,
            fundPotIxArgs,
            PROGRAM_ID
        )

        const {
            context: { slot: minContextSlot },
            value: { blockhash, lastValidBlockHeight }
        } = await connection.getLatestBlockhashAndContext();

        const transaction = new Transaction({
            feePayer: publicKey,
            lastValidBlockHeight,
            blockhash: blockhash
        }).add(fundPotIx)

        const signature = await sendTransaction(transaction, connection, { minContextSlot });

        await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });
        console.log("Pot filled. TX: ", signature)
        alert("Pot filled successfully!")
    }, [publicKey, sendTransaction, connection, amount]);

    const submitWithdrawPot = useCallback(async () => {
        if (!publicKey) throw new WalletNotConnectedError();

        const potBalance = await connection.getBalance(new PublicKey(potAddress))
        console.log("Pot balance: ", potBalance)

        const amountToTransfer = new BN(potBalance)


        const pot = Pda.find(PROGRAM_ID, [POT_TAG, new PublicKey(soapAddress).toBuffer(), publicKey.toBuffer()])
        console.log("Pot Address: ", pot.toBase58())

        const fundPotIxAccs: WithdrawPotInstructionAccounts = {
            authority: publicKey,
            pot: pot,
            payer: publicKey,
            mintAccount: new PublicKey(soapAddress)
        }

        const fundPotIxArgs: WithdrawPotInstructionArgs = {
            solLamports: amountToTransfer
        }

        const fundPotIx = createWithdrawPotInstruction(
            fundPotIxAccs,
            fundPotIxArgs,
            PROGRAM_ID
        )

        const {
            context: { slot: minContextSlot },
            value: { blockhash, lastValidBlockHeight }
        } = await connection.getLatestBlockhashAndContext();

        const transaction = new Transaction({
            feePayer: publicKey,
            lastValidBlockHeight,
            blockhash: blockhash
        }).add(fundPotIx)

        const signature = await sendTransaction(transaction, connection, { minContextSlot });

        await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });
        console.log("Pot withdrawn. TX: ", signature)
        alert("Pot withdrawn successfully!")
    }, [publicKey, sendTransaction, connection, amount]);

    return (
        <div className="px-4">
            <Head>
                <title>SOAP | Fund Pot</title>
                <meta name="description" content="SOAP" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/favicon.ico" />
            </Head>
            <main className="lg:max-w-7xl mx-auto">
                <div className="m-6 justify-center items-center w-auto flex">
                    <WalletMultiButtonDynamic />
                </div>
                <div className="justify-center items-center w-auto flex">
                    <div className="py-2 w-full drop-shadow-xl">
                        <div className="relative w-auto items-center">
                            <Image src={soapDetails.Image} width="200" height="200" className="rounded-lg relative" />
                        </div>
                    </div>

                    <div className="flex-col py-2">
                        <div className="inline text-6xl font-phenomenaBlack h-12">
                            <h1>
                                {soapDetails.Name}
                            </h1>
                        </div>
                        <div className="inline text-xl font-neueHaasUnicaRegular h-12">
                            <h1>
                                {soapDetails.Description}
                            </h1>
                        </div>
                        <div className="inline text-l font-neueHaasUnicaRegular h-12">
                            <h1>
                                Creator: {soapDetails.UpdateAuthority}
                            </h1>
                        </div>
                        <div className="inline text-l font-neueHaasUnicaRegular h-12">
                            <h1>
                                Pot Address: {soapDetails.PotAddress}
                            </h1>
                        </div>
                        <div className="inline text-l font-neueHaasUnicaRegular h-12">
                            <h1>
                                The pot has enough funds for {Math.round(soapDetails.PotBalance / LAMPORTS_PER_SOL / 0.0021)} Soap mints.
                            </h1>
                        </div>
                        <div>
                            Add more funds for this many Soaps:
                            <input type="text" value={amount} onChange={handleInputChange} className="text-gray-700 mx-4 w-16 px-2 rounded-md" placeholder="eg. 10" />
                        </div>
                        <button onClick={submitFillUpPot} disabled={!publicKey && (amount > 0)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-slate-400 mx-2">
                            Add funds
                        </button>
                        <button onClick={submitWithdrawPot} disabled={!publicKey && (amount > 0)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-slate-400 mx-2">
                            Withdraw Pot
                        </button>
                    </div>
                </div>

                <div className="flex justify-center flex-row items-center mt-2 mb-12 pt-2 gap-4">
                    <Link href={`https://explorer.solana.com/address/${soapDetails.Address}`}>
                        <div className="relative group">
                            <button className="relative px-7 py-4 bg-black rounded-lg leading-none flex items-center uppercase font-neueHaasUnicaBlack">
                                See soap on-chain
                            </button>
                        </div>
                    </Link>
                </div>
            </main>
        </div>
    )
}

export default soapAddress

export async function getServerSideProps(context) {
    const soapAddress: string = context.query.soapAddress;
    const mintAddress = new PublicKey(soapAddress);

    // TODO: Maybe filter if it is a soap and send back a "not soap mfer" pic if not
    const soap = await metaplex.nfts().findByMint({ mintAddress });
    console.log("Soap details: ", soap)
    const potBalance = await connection.getBalance(soap.mint.mintAuthorityAddress)

    const soapDetails: soapDetails = {
        Address: soapAddress,
        Image: soap.json.image || "https://www.seekpng.com/png/full/251-2514375_free-high-quality-error-youtube-icon-png-2018.png", // FIXME: lol random error pic
        Name: soap.json.name || "no name",
        Description: soap.json.description || "no description",
        Attributes: soap.json.attributes || "no attributes",
        Model: soap.model || "no model",
        UpdateAuthority: soap.updateAuthorityAddress.toBase58() || "no creator",
        PotAddress: soap.mint.mintAuthorityAddress.toBase58() || "",
        PotBalance: potBalance
    }

    return {
        props: { soapDetails }, // will be passed to the page component as props
    }
}

type soapDetails = {
    Address: string,
    Image: string,
    Name: string,
    Description: string,
    Attributes: any,
    Model: string,
    UpdateAuthority: string,
    PotAddress: string,
    PotBalance: number,
}