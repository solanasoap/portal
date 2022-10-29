import { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { Metaplex } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import Image from "next/image";
import WalletLogin from "../../components/WalletLogin";
import { useState } from "react";
import nacl from "tweetnacl";
import Header from "../../components/Header";
import Link from "next/link";
import { OwnSoap } from "../../components/OwnSoap";

// TODO: Add the ability to have secrets on this page when you own the soap
// Like a secret code or location to a party (see StripDAO party)
// Only stored on our backend, not on-chain. Only visible if person authenticates ownership of soap.

// TODO: Add the ability to have secrets on this page when you own the soap
// Like a secret code or location to a party (see StripDAO party)
// Only stored on our backend, not on-chain. Only visible if person authenticates ownership of soap.

const connection = new Connection("https://broken-green-forest.solana-mainnet.discover.quiknode.pro/" + process.env.NEXT_PUBLIC_QUICKNODE_API_KEY + "/");
const metaplex = new Metaplex(connection);


const soapAddress: NextPage<{ soapDetails: soapDetails }> = ({ soapDetails }) => {

    return (
        <div className="px-4">
            <Head>
                <title>SOAP | Examiner</title>
                <meta name="description" content="SOAP" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/favicon.ico" />
            </Head>
            <main>
                <div className="inline-block py-2 w-full drop-shadow-xl">
                    <div className="relative">
                        <Image src={soapDetails.Image} width="2024" height="2024" className="rounded-lg relative" />
                    </div>
                </div>
                <div>
                    <OwnSoap soapAddress={soapDetails.Address} />
                </div>
                <div className="flex-col py-2">
                    <div className="inline text-6xl font-phenomenaBlack h-12">
                        <h1>
                            {soapDetails.Name}
                        </h1>
                    </div>
                </div>
                <div className="flex-col pt-2 pb-6">
                    <div className="inline text-xl font-neueHaasUnicaRegular h-12">
                        <h1>
                            {soapDetails.Description}
                        </h1>
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
                    <Link href={`/soaps`}>
                        <div className="relative group">
                            <button className="relative px-7 py-4 bg-black rounded-lg leading-none flex items-center uppercase font-neueHaasUnicaBlack">
                                See in my Collection
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
    const soapDetails: soapDetails = {
        Address: soapAddress,
        Image: soap.json.image || "https://www.seekpng.com/png/full/251-2514375_free-high-quality-error-youtube-icon-png-2018.png", // FIXME: lol random error pic
        Name: soap.json.name || "no name",
        Description: soap.json.description || "no description",
        Attributes: soap.json.attributes || "no attributes",
        Model: soap.model || "no model",
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
    Model: string
}