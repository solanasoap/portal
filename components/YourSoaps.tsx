// this component fetches all the soaps from the user's wallet after
// they authenticated to the dapp through their wallet.

// Connect to phantom on phone

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from 'next/link'
import bs58 from "bs58";
import axios from 'axios';
import {
    clusterApiUrl,
    Connection,
    Keypair,
    PublicKey,
    SystemProgram,
    Transaction,
  } from "@solana/web3.js";
import { useState, useCallback, useRef } from "react";
import nacl from "tweetnacl";
import { useLocalStorage } from "@solana/wallet-adapter-react";

export const BASE_URL = "https://phantom.app/ul/v1/";
const NETWORK = clusterApiUrl("mainnet-beta");

/// create dapp encryption public key
const dappEncryptionPublicKey = "FIXME"

/// redirect link from connect is /onConnect/ on our end
/// it should receive all the wallet info and store it in state
/// then it should redirect to wherever it was coming from
/// which it gets from the redirect url through query params
/// target page try autoconnect
/// reads state for what it's looking for if signed in
/// shows "log in mfer" if not signed in
const onConnectRedirectLink = "https://e175-213-220-159-212.eu.ngrok.io/phantom/onConnect"


const urlEncodedConnectLink = "phantom://v1/connect?app_url=%20https%3A%2F%2Fe175-213-220-159-212.eu.ngrok.io"
const openInPhantomURL = "THIS I NEED TO GET TO ULTIAMTELY"

// 



const buildUrl = (path: string, params: URLSearchParams) =>
    `https://phantom.app/ul/v1/${path}?${params.toString()}`;

export default function YourSoaps() {
    const [deepLink, setDeepLink] = useState<string>("");
    const [logs, setLogs] = useState<string[]>([]);
    const connection = new Connection(NETWORK);
    const addLog = useCallback((log: string) => setLogs((logs) => [...logs, "> " + log]), []);
    const scrollViewRef = useRef<any>(null);
  
    //console.log(nacl.box.keyPair())

    // store dappKeyPair, sharedSecret, session and account SECURELY on device
    // to avoid having to reconnect users.
    // FIXME: Add local persistance safely // fix to one custom keypair (pubkey)
    const [dappKeyPair, setDappKeyPair] = useState(nacl.box.keyPair()); //nacl.box.keyPair()
    const [sharedSecret, setSharedSecret] = useState<Uint8Array>();
    const [session, setSession] = useState<string>();
    const [phantomWalletPublicKey, setPhantomWalletPublicKey] = useState<PublicKey>();

    console.log("loaded")

    const connect = () => {
        const params = new URLSearchParams({
            dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
            cluster: "mainnet-beta",
            app_url: "https://phantom.app",
            redirect_link: onConnectRedirectLink,
        });

        const url = buildUrl("connect", params);
        console.log("url: ", url)
        return url
    };

    return (
        <>
            <div className="py-2 justify-center flex ">
                <Link href="https://phantom.app/ul/browse/https%3A%2F%2Fe175-213-220-159-212.eu.ngrok.io%2Fcollection?ref=<%20https%3A%2F%2Fe175-213-220-159-212.eu.ngrok.io">
                    <button className="bg-black hover:bg-gray-900 text-white font-bold py-2 px-4 rounded w-48 h-12">
                        Open in Phantom
                    </button>
                </Link>
            </div>
            <div className="py-2 justify-center flex ">
                <Link href={`${connect()}`}>
                    <button className="bg-black hover:bg-gray-900 text-white font-bold py-2 px-4 rounded w-48 h-12">
                        Deeplink in Phantom
                    </button>
                </Link>
            </div>


            {/* <ul className="flex items-center font-neueHaasUnicaRegular py-2 justify-center">
                <li className="pl-6">
                    <WalletMultiButton className='bg-black ' />
                </li>
            </ul> */}
        </>
    )

}