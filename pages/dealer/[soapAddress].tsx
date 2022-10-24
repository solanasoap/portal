import { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { Metaplex } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import Image from "next/image";
import WalletLogin from "../../components/WalletLogin";
import { useState } from "react";
import nacl from "tweetnacl";

const connection = new Connection("https://broken-green-forest.solana-mainnet.discover.quiknode.pro/" + process.env.NEXT_PUBLIC_QUICKNODE_API_KEY + "/");
const metaplex = new Metaplex(connection);

// SCOPE NO
// This does not handle already logged in in the beginning - future todo
// because most users will open the soap dispenser page for the first time
// and need to auth anyways. so we can just make them auth each time

// SCOPE YES
// user scans QR code which opens up this page
// /dispenser/<soapAddress>
// DONE get soapAddress from url query param, get picture of soap and display it
// generate dappKeyPair and store it in a cookie "dappKeyPair"
// construct deeplink call [based on user's wallet choice] to wallet, with target to /mintooor/<soapAddress>

// -- /dispenser/HKPcjAi699egocGNqMVEEkPqYAwPZ12oqFWKfzVcCudV
// -> https://phantom.app/ul/v1/connect?
//  & dapp_encryption_public_key=<dappKeyPair.publicKey>
//  & cluster=mainnet-beta
//  & app_url=https://portal-solsoap.vercel.app
//  & redirect_link=https://portal-solsoap.vercel.app/phantom/onConnectV2?target=/mintooor/<soapAddress>


const soapAddress: NextPage<{ soapDetails: soapDetails }> = ({ soapDetails }) => {

    return (
        <div className="px-5">
            <Head>
                <title>SOAP Dealer</title>
                <meta name="description" content="SOAP" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/favicon.ico" />
            </Head>
            <main>
                <div className="px-5 pt-6" >
                    <div className="inline text-6xl font-phenomenaBlack h-12">
                        <h1>
                            Hey, you got a soap!
                        </h1>
                    </div>
                </div>
                <h4 className="text-2xl font-phenomenaRegular text-center pt-4 drop-shadow-xl">
                    {soapDetails.Name}
                </h4>
                <div className="flex py-2 w-full items-center justify-center drop-shadow-xl">
                    <div className="relative w-64 h-64 ">
                        <Image src={soapDetails.Image} layout="fill" className="rounded-xl" />
                    </div>
                </div>
                <div className="py-2 px-24 justify-center flex items-center">
                    <WalletLogin
                        target={`/mintooor/${soapDetails.Address}`}
                        walletAction="Mint"
                        forceReconnect={true}
                    />
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
    const soapDetails: soapDetails = {
        Address: soapAddress,
        Image: soap.json.image || "https://www.seekpng.com/png/full/251-2514375_free-high-quality-error-youtube-icon-png-2018.png", // FIXME: lol random error pic
        Name: soap.json.name || "error"
    }

    return {
        props: { soapDetails }, // will be passed to the page component as props
    }
}

type soapDetails = {
    Address: string,
    Image: string,
    Name: string
}