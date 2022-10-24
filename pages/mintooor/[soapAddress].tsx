import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../../components/Header'
import React, { useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Metaplex } from '@metaplex-foundation/js';
import Cookies from 'js-cookie';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';

const connection = new Connection("https://broken-green-forest.solana-mainnet.discover.quiknode.pro/" + process.env.NEXT_PUBLIC_QUICKNODE_API_KEY + "/");
const metaplex = new Metaplex(connection);

// We get to this page from /wallet/onConnectV2
// which forwards us here based on a query param "target" (todo)
// onConnect puts the wallet's publicKey into a cookie (todo)
// This page reads that cookie, and reads the soapAddress from the forwarded url
// get soap jpeg based on soapAddress & start animation for "minting"
// with the toPublicKey (cookie) and soapAddress (url), we POST to /api/dispense
// /api/dispense?toPublicKey=<string>&soapAddress=<string>&secret=<API_SECRET>
// api sends back tx signature of mint in ~0.5-20 seconds
// track confirmation and animate display based on that
// user receives soap

const Dispenser: NextPage<{ soapDetails: soapDetails }> = ({ soapDetails }) => {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [txSignature, setTxSignature] = useState<string | null>(null);

    useEffect(() => {
        setWalletAddress(Cookies.get('walletAddress'))
    }, [])

    useEffect(() => {
        const apiMintRequest = {
            toPublicKey: walletAddress,
            soapAddress: soapDetails.Address,
            secret: "verySmooth"
        }

        const minted = Cookies.get(apiMintRequest.soapAddress)
        console.log(minted)

        // console.log("API Mint Request", apiMintRequest)

        // We should really check if we minted this or not
        // Otherwise it'll mint on every refresh lmao 
        if (walletAddress && soapDetails.Address) {
            axios
                .post('/api/dispense', {
                    toPublicKey: walletAddress,
                    soapAddress: soapDetails.Address,
                    secret: "verySmooth"
                }
                )
                .then(res => {
                    console.log('API Response', res.data);
                    setTxSignature(res.data['tx'])
                })
                .catch(err => {
                    if (err.response.status == 403) {
                        console.log("Forbidden: Wallet already has this soap.")
                        setTxSignature("403")
                    }
                    console.log('error in request', err);
                });
        }


    }, [walletAddress])

    useEffect(() => {
        Cookies.set(soapDetails.Address, 'minted')
        console.log("txSignature", txSignature)
    }, [txSignature])

    return (
        <div className="px-5">
            <Head>
                <title>Soap Mintooor</title>
                <meta name="description" content="Minting a soap." />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main >
                <Header></Header>
                <div className="py-6" >
                    <div className="inline text-7xl font-phenomenaBlack text-center">
                        {/* FIXME: add here a lot nicer animation that follows the actual confirmations until finalized */}
                        {txSignature ? (
                            <p>Mint Done!</p>
                        ) : (
                            <>
                                <p className="text-5xl mb-2">
                                    Minting {`${soapDetails.Name}`} to:
                                </p>
                                <p className="text-5xl">
                                {walletAddress && `🔗 ${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`}
                                </p>
                            </>
                        )}
                    </div>
                </div>
                <div className="flex py-2 w-full items-center justify-center drop-shadow-xl">
                    <div className="relative w-64 h-64 ">
                        <Image src={soapDetails.Image} layout="fill" className="rounded-xl" />
                    </div>
                </div>
                {txSignature ? (
                    <>
                        {(txSignature == "403") ? (
                            <div>
                                <div className="text-3xl font-phenomenaBlack py-4 text-center justify-center px-12">
                                    Looks like you already minted this one!
                                    {/* FIXME: This path doesn't exist yet */}
                                    <Link href={`/examiner/${soapDetails.Address}`}>
                                        <button className=" bg-black hover:shadow-md uppercase font-neueHaasUnicaBlack text-white font-bold py-2 px-4 mt-4 rounded w-64 h-18 text-lg">
                                            Check it out in the gallery
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="py-8 justify-center items-center flex-col">
                                <Link href={`/examiner/${soapDetails.Address}`}>
                                        <button className=" bg-black hover:shadow-md uppercase font-neueHaasUnicaBlack text-white font-bold py-2 px-4 mt-4 rounded w-64 h-18 text-lg">
                                            Check it out in the gallery
                                        </button>
                                    </Link>
                                    <Link href={`https://solscan.io/tx/${txSignature}`}>
                                        <button className=" bg-black hover:shadow-md uppercase font-neueHaasUnicaBlack text-white font-bold py-2 px-4 rounded w-64 h-16">
                                            Check it out on Solscan
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className='flex justify-center'>
                        <img className="" src="/loading.svg" />
                    </div>
                )}
            </main>
        </div>



    )
}

export default Dispenser

export async function getServerSideProps(context) {
    const soapAddress: string = context.query.soapAddress;
    const mintAddress = new PublicKey(soapAddress);

    // TODO: Maybe filter if it is a soap and send back a "not soap mfer" pic if not
    const soap = await metaplex.nfts().findByMint({ mintAddress });
    const soapDetails: soapDetails = {
        Address: soapAddress,
        Image: soap.json.image,
        Name: soap.json.name || "error"
    }

    return {
        props: { soapDetails }, // will be passed to the page component as props
    }
}

interface soapDetails {
    Address: string,
    Image: string,
    Name: string
}