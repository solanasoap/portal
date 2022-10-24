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

const connection = new Connection("https://broken-green-forest.solana-mainnet.discover.quiknode.pro/" + process.env.NEXT_PUBLIC_QUICKNODE_API_KEY + "/");
const metaplex = new Metaplex(connection);


const soapAddress: NextPage<{ soapDetails: soapDetails }> = ({ soapDetails }) => {

    return (
        <div className="px-5">
            <Head>
                <title>SOAP | Examiner</title>
                <meta name="description" content="SOAP" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/favicon.ico" />
            </Head>
            <main>
                <Header></Header>
                <div className="flex-col py-6">
                    <div className="inline text-6xl font-phenomenaBlack h-12">
                        <h1>
                            {soapDetails.Name}
                        </h1>
                    </div>
                </div>
                <div className="flex py-2 w-full items-start justify-start drop-shadow-xl">
                    <div className="relative w-80 h-80 ">
                        <Image src={soapDetails.Image} layout="fill" className="rounded-xl" />
                    </div>
                </div>
                <div className="flex-col py-6">
                    <div className="inline text-2xl font-phenomenaRegular h-12">
                        <h1>
                            {soapDetails.Description}
                        </h1>
                    </div>
                </div>
                <Link href={`https://explorer.solana.com/address/${soapDetails.Address}`}>
                    <button className="bg-black hover:shadow-md text-white font-bold py-2 px-4 rounded w-64 h-16 my-2 mb-36">
                        See soap on-chain
                    </button>
                </Link>
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