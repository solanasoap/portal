import type { NextPage } from 'next'
import Link from 'next/link'
import bs58 from "bs58";
import { useLocalStorage } from "@solana/wallet-adapter-react";
import { useState, useCallback, useRef } from "react";
import Head from 'next/head';
import Header from '../../components/Header';
import { useRouter } from 'next/router'
import { GetServerSideProps } from "next";



const OnConnect: NextPage = (props) => {

    // const [searchParams, setSearchParams] = useSearchParams();

    // searchParams.get("__firebase_request_key")
    const router = useRouter()
    const phantom_encryptipion_pubkey = router.query["phantom_encryption_public_key"]
    //console.log(phantom_encryptipion_pubkey)
    //console.log(router.query)

    return (
        <>
            <div className="px-5">
                <Head>
                    <title>Connecting...</title>
                    <meta name="description" content="See your collection of soaps." />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <main >
                    <Header></Header>
                    {/* {{props}} */}
                </main>
            </div>
        </>
    )

}

export default OnConnect

export const getServerSideProps: GetServerSideProps = async (context) => {
    var id = context.query["phantom_encryption_public_key"];
  
    // In this example, we might call a database or an API with given ID from the query parameters
    // I'll call a fake API to get the players name from a fake database
    const res = await fetch(`https://api.mainnet-beta.solana.com/`);

    console.log(context.query)
    //console.log(context.query["phantom_encryption_public_key"])
  
    // Return the ID to the component
    return {
      props: {
        id,
      },
    };
  };