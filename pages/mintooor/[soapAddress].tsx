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
import { Sign } from 'crypto';
import Script from 'next/script'

const RPCURL = "https://broken-green-forest.solana-mainnet.discover.quiknode.pro/" + process.env.NEXT_PUBLIC_QUICKNODE_API_KEY + "/"
// const RPCURL = "https://api.mainnet-beta.solana.com"
const connection = new Connection(RPCURL);
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
                <div className="flex items-center justify-center w-auto h-80 py-6 pt-12 pb-12 mb-12">
                    <div className="relative flex h-72 w-72">
                        <div className="z-10 absolute w-full h-full flex justify-center items-center bg-gradient-to-br from-gray-900 to-black">
                            <Image src={soapDetails.Image} layout="fill" />
                        </div>
                        <div className="absolute w-full h-full bg-conic-gradient filter blur-xl"></div>
                        <div className="absolute w-full h-full bg-conic-gradient filter blur-3xl opacity-60 animate-pulse"></div>
                        <div className="absolute -inset-0.5 rounded-sm bg-conic-gradient"></div>
                    </div>
                </div>
                {!txSignature && (
                    <div className="py-6" >
                        <div className="inline ">
                            <>
                                <div className="flex-col text-center font-neueHaasUnicaBlack pb-3">
                                    <p className="text-2xl font-bold mb-2">
                                        {`${soapDetails.Name}`}
                                    </p>
                                    <p className="text-xl font-neueHaasUnicaRegular">
                                        {/* TODO: Auto-resolve .sol address of wallet */}
                                        Minting to {walletAddress && `🔗 ${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`}
                                    </p>
                                </div>
                                <div className='flex justify-center'>
                                    <img className="" src="/loading.svg" />
                                </div>
                            </>
                        </div>
                    </div>
                )}
                {txSignature && (
                    <>
                        {(txSignature == "403") ? (
                            <>
                                <p className="text-4xl font-phenomenaBlack pb-2 text-center items-center bg-transparent text-transparent bg-clip-text bg-gradient-to-r from-greenBottomLeft to-greenTopRight">
                                    You already have this soap
                                </p>
                                <p className="text-3xl font-phenomenaBlack pb-2 px-12 text-center items-center bg-transparent">
                                    {soapDetails.Name}
                                </p>
                                <div>
                                    <div className="text-4xl font-phenomenaBlack py-2 text-center justify-center px-12 items-center">
                                        <Link href={`/examiner/${soapDetails.Address}`}>
                                            <div className="relative group">
                                                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                                                <button className="relative px-7 py-4 bg-black rounded text-lg mt-4 font-bold leading-none flex items-center uppercase font-neueHaasUnicaBlack">
                                                    See in my Collection

                                                </button>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <div className="flex justify-center flex-row items-center mt-2 pt-2 gap-4">
                                        <Link href={`https://solscan.io/tx/${txSignature}`}>
                                            <div className="relative group">
                                                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                                                <button className="relative px-7 py-4 bg-black rounded-lg leading-none flex items-center uppercase font-neueHaasUnicaBlack">
                                                    Blockchain proof
                                                </button>
                                            </div>
                                        </Link>
                                        <Link href={`/examiner/${soapDetails.Address}`}>
                                            <div className="relative group">
                                                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                                                <button className="relative px-7 py-4 bg-black rounded-lg leading-none flex items-center uppercase font-neueHaasUnicaBlack">
                                                    See in my Collection
                                                </button>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                                <div className='pt-4'>
                                    <p className="text-5xl font-phenomenaBlack text-center py-2 px-12 items-center text-transparent bg-clip-text bg-gradient-to-r from-greenBottomLeft to-greenTopRight">
                                        You just minted
                                    </p>
                                    <p className="text-4xl font-phenomenaBlack text-center px-12 items-center text-transparent bg-clip-text bg-gradient-to-r from-greenBottomLeft to-greenTopRight">
                                        {soapDetails.Name}
                                    </p>
                                </div>
                            </>
                        )}
                    </>
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
        Address: soapAddress || 'address.none',
        Image: soap.json.image || 'https://cdn2.vectorstock.com/i/1000x1000/09/11/problem-flat-red-color-icon-vector-6080911.jpg',
        Name: soap.json.name || "name.none"
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