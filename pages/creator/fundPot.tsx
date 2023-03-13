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
import {
    createQR,
} from '@solana/pay';
import { useQRCode } from 'next-qrcode';
import { ToastContainer, toast, Zoom, Bounce } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"


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


const SoapAddress: NextPage<{ soapDetails: soapDetails }> = ({ soapDetails }) => {
    const [amount, setamount] = useState(10);
    const [soapAddress, setSoapAddress] = useState(soapDetails.Address)
    const [potAddress, setPotAddress] = useState(soapDetails.PotAddress)
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const { Canvas } = useQRCode();

    const notifyPotFilling = () => toast("Filling up Pot...");
    const notifyPotFilled = () => toast("Pot filled successfully!");
    const notifyPotWithdrawing = () => toast("Withdrawing Pot...");
    const notifyPotWithdrawn = () => toast("Pot withdrawn successfully!");
    const notifyPotDismissed = () => toast.error("Transaction error! Try again.",);
    const notifyLinkCopied = () => toast.success("Link copied!",);

    useEffect(() => {
        setSoapAddress(soapDetails.Address)
        setPotAddress(soapDetails.PotAddress)
        console.log("Soap Address: ", soapAddress);
        console.log("Pot Address: ", potAddress);
    }, [])

    const handleInputChange = (event) => {
        const newValue = event.target.value.replace(/\D/g, ''); // only allow digits
        if (newValue === event.target.value) {
            setamount(newValue);
        }
    };

    const soapLink = `https://${process.env.NEXT_PUBLIC_BASE_URL}/dealer/${soapAddress}`;
    const copylink = (e) => {
        navigator.clipboard.writeText(soapLink)
        notifyLinkCopied()
    }

    const submitFillUpPot = useCallback(async () => {
        if (!publicKey) throw new WalletNotConnectedError();
        if (amount < 1) {
            alert("Please put in an amount higher than 0");
            return;
        }

        notifyPotFilling()

        const amountToTransfer = new BN((LAMPORTS_PER_SOL * 0.00204) * amount)


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

        const signature = await sendTransaction(transaction, connection, { minContextSlot }).catch(e => {
            notifyPotDismissed()
        });

        if (!signature) return;

        await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });
        console.log("Pot filled. TX: ", signature)
        notifyPotFilled()
    }, [publicKey, sendTransaction, connection, amount]);

    const submitWithdrawPot = useCallback(async () => {
        if (!publicKey) throw new WalletNotConnectedError();

        notifyPotWithdrawing()

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

        const signature = await sendTransaction(transaction, connection, { minContextSlot }).catch(e => {
            notifyPotDismissed()
        });

        if (!signature) return;

        await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });
        console.log("Pot withdrawn. TX: ", signature)
        notifyPotWithdrawn()
    }, [publicKey, sendTransaction, connection, amount]);

    return (
        <div className="px-4">
            <Head>
                <title>SOAP | Fund Pot</title>
                <meta name="description" content="SOAP" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/favicon.ico" />
            </Head>
            <ToastContainer autoClose={4000} draggable={false} transition={Zoom} />
            <main className="lg:max-w-7xl mx-auto">
                <div className="m-6 justify-center items-center w-auto flex">
                    <WalletMultiButtonDynamic />
                </div>
                <div role="alert">
                    <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                        Heads up, save this link!
                    </div>
                    <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-600">
                        <p>Save this page to top up and withdraw from the Soap&#39;s Pot. You won&#39;t be able to come back to it unless you have the link.</p>
                        <p>Only the Creator of the Soap can add and withdraw from the Pot.</p>
                    </div>
                </div>
                <div className="flex flex-wrap justify-end items-end">
                    <div className="w-full md:w-1/2 px-4">
                        <div className="py-2 w-full">
                            <div className="relative w-auto items-center">
                                <Image src={soapDetails.Image} width="300" height="300" className="rounded-lg relative" />
                            </div>
                        </div>
                        <div className="py-2">
                            <Canvas
                                text={soapLink}
                                options={{
                                    level: 'M',
                                    margin: 3,
                                    scale: 4,
                                    width: 300,
                                    color: {
                                        dark: '#000000',
                                        light: '#FFFFFF',
                                    },
                                }}
                            />
                        </div>
                        <p className="w-auto">Save the QR code image or <a onClick={copylink} className="cursor-pointer select-none underline">copy to clipboard</a>.</p>
                        <p>People can scan this to redeem their Soaps.</p>
                    </div>
                    <div className="w-full md:w-1/2 px-4">
                        <div className="py-2">
                            <div className="block text-6xl font-phenomenaBlack">
                                <h1 className="font-bold">{soapDetails.Name}</h1>
                            </div>
                            <div className="block text-xl font-neueHaasUnica py-4">
                                <h1>{soapDetails.Description}</h1>
                            </div>
                            <div className="block text-xl font-neueHaasUnica py-4">
                                <p>Remaining balance: <span className="font-bold">{Math.round(soapDetails.PotBalance / LAMPORTS_PER_SOL / 0.00204)} Soap mints.</span></p>
                                {/* <p>Remaining balance: <span className="font-bold">{Math.round((soapDetails.PotBalance - 2040000) / LAMPORTS_PER_SOL / 0.00204)} Soap mints.</span></p> */}
                            </div>
                            <div className="py-4">
                                <p className="mb-2 font-bold text-lg">Add more funds for this many Soaps:</p>
                                <input type="text" value={amount} onChange={handleInputChange} className="text-gray-700 w-16 px-2 py-1 rounded-md border border-gray-400 focus:border-blue-500 focus:outline-none" placeholder="eg. 10" />
                            </div>
                            <div className="flex justify-start">
                                <button onClick={submitFillUpPot} disabled={!publicKey && (amount > 0)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-slate-400 uppercase mr-2 font-neueHaasUnicaBlack">
                                    Add funds
                                </button>
                                <button onClick={submitWithdrawPot} disabled={!publicKey && (amount > 0)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-slate-400 uppercase mr-2 font-neueHaasUnicaBlack">
                                    Withdraw Pot
                                </button>
                                <Link href={`https://explorer.solana.com/address/${soapDetails.Address}`}>
                                    <div className="relative group">
                                        <button className="relative px-7 py-4 bg-black rounded-lg leading-none flex items-center uppercase font-neueHaasUnicaBlack">
                                            See soap on-chain
                                        </button>
                                    </div>
                                </Link>
                            </div>
                            <div className="inline-block text-lg font-neueHaasUnica h-12 py-4">
                                <h1 className="font-bold">Creator</h1>
                                <p>{soapDetails.UpdateAuthority}</p>
                            </div>
                            <div className="inline-block text-lg font-neueHaasUnica h-12 py-4">
                                <h1 className="font-bold">Pot Address</h1>
                                <p>{soapDetails.PotAddress}</p>
                            </div>
                            <div className="inline-block text-lg font-neueHaasUnica h-12 py-4">
                                <h1 className="font-bold">Soap Address</h1>
                                <p>{soapDetails.Address}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center flex-row items-center mt-2 mb-12 pt-2 gap-4">

                </div>
            </main>
        </div>
    )
}

export default SoapAddress

export async function getServerSideProps(context) {
    const soapAddress: string = context.query.soapAddress;
    const mintAddress = new PublicKey(soapAddress);

    // TODO: Maybe filter if it is a soap and send back a "not soap mfer" pic if not
    const soap = await metaplex.nfts().findByMint({ mintAddress });
    // Must calculate better.
    // If Pot has 0.00204 SOL, it will show "1 soap remaining" but it can't mint because it would go below rent
    // So if fill up the pot with 1 Soap, it won't be able to mint. You can't go below "1 soap remaining"
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

// This should really be in my lib types, as it's used at multiple places
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