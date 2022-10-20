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
import { useState, useCallback, useRef, useEffect } from "react";
import nacl from "tweetnacl";
import { useLocalStorage } from "@solana/wallet-adapter-react";
import { TextEncoder } from "util";
import base from "base-x";

export const BASE_URL = "https://phantom.app/ul/v1/";
const NETWORK = clusterApiUrl("mainnet-beta");

/// redirect link from connect is /onConnect/ on our end
/// it should receive all the wallet info and store it in state
/// then it should redirect to wherever it was coming from
/// which it gets from the redirect url through query params
/// target page try autoconnect
/// reads state for what it's looking for if signed in
/// shows "log in mfer" if not signed in
const base_url = process.env.BASE_URL

const buildUrl = (walletEndpoint: string, path: string, params: URLSearchParams) =>
    `https://${walletEndpoint}/ul/v1/${path}?${params.toString()}`;

export default function MobileAdapter() {

    const base_url = "portal-solsoap.vercel.app" // WHY TF THIS AINT WORKING process.env.BASE_URL
    const onConnectRedirectLink = `https://${base_url}/phantom/onConnect`
    const urlEncodedConnectLink = `phantom://v1/connect?app_url=%20https%3A%2F%2Fe${base_url}`
    console.log("URL", base_url)

    const [deepLink, setDeepLink] = useState<string>("");
    const [logs, setLogs] = useState<string[]>([]);
    const connection = new Connection(NETWORK);
    const addLog = useCallback((log: string) => setLogs((logs) => [...logs, "> " + log]), []);
    const scrollViewRef = useRef<any>(null);
    const [dappKeyPair, setDappKeyPair] = useState(nacl.box.keyPair());

    const [sharedSecret, setSharedSecret] = useState<Uint8Array>();
    const [session, setSession] = useState<string>();
    const [phantomWalletPublicKey, setPhantomWalletPublicKey] = useState<PublicKey>();

    const connect = (walletEndpoint: string) => {
        console.log("dappkeypair.publickey in connect: ", dappKeyPair.publicKey)
        const params = new URLSearchParams({
            dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
            cluster: "mainnet-beta",
            app_url: `https://${base_url}`,
            redirect_link: onConnectRedirectLink,
        });

        const url = buildUrl(walletEndpoint, "connect", params);
        return url
    };

    useEffect(() => {
        //console.log(nacl.box.keyPair())

        // store dappKeyPair, sharedSecret, session and account SECURELY on device
        // to avoid having to reconnect users.
        // FIXME: Add local persistance safely // fix to one custom keypair (pubkey)

        // check if localstorage exists for local keypair
        // load if yes
        // create and save if no

        if (localStorage.getItem('dappKeyPairSecretKey')) {
            console.log("Reusing keypair in local storage.")

            // Get "dappKeyPairSecretKey" from local storage
            const dappKeyPairSecretKeyLocalStorage = JSON.parse(localStorage.getItem('dappKeyPairSecretKey'))
            console.log("dappkeypairsecretkeylocalstorage: ", dappKeyPairSecretKeyLocalStorage)

            // Create array from JSON secret key
            var secretKeyArray = [];
            for (var i in dappKeyPairSecretKeyLocalStorage)
                secretKeyArray.push(dappKeyPairSecretKeyLocalStorage[i]);

            // Create Uint8Array for secret key to be used in keypair
            const secretKeyUint8 = Uint8Array.from(secretKeyArray)
            const shouldDappKeyPair = nacl.box.keyPair.fromSecretKey(secretKeyUint8)
            console.log("ShouldDappKeyPair: ", shouldDappKeyPair)

            setDappKeyPair(shouldDappKeyPair)
            console.log("dappKeyPair: ", dappKeyPair)
        } else {
            console.log("No dApp keypair for deeplinking in local storage. Generating.")
            //setDappKeyPair(nacl.box.keyPair())
            localStorage.setItem('dappKeyPairSecretKey', JSON.stringify(dappKeyPair.secretKey))
            console.log("dApp keypair saved to local storage")
        }
    }, [])

    return (
        <>
            <div className="py-2 justify-center flex ">
                <Link href="https://phantom.app/ul/browse/https%3A%2F%2Fe%2Fsoaps?ref=<%20https%3A%2F%2Feportal-solsoap.vercel.app/">
                    <button className="bg-black hover:bg-gray-900 text-white font-bold py-2 px-4 rounded w-48 h-12">
                        Open in Phantom
                    </button>
                </Link>
            </div>
            <div className="py-2 justify-center flex ">
                <Link href={`${connect("phantom.app")}`}>
                    <button className="bg-black hover:bg-gray-900 text-white font-bold py-2 px-4 rounded w-48 h-12">
                        Deeplink in Phantom
                    </button>
                </Link>
            </div>


            {/* <div className="py-2 justify-center flex ">
                <Link href="https://solflare.com/ul/browse/https%3A%2F%2Fe175-213-220-159-212.eu.ngrok.io%2Fsoaps?ref=<%20https%3A%2F%2Fe175-213-220-159-212.eu.ngrok.io">
                    <button className="bg-black hover:bg-gray-900 text-white font-bold py-2 px-4 rounded w-48 h-12">
                        Open in Solflare
                    </button>
                </Link>
            </div>
            <div className="py-2 justify-center flex ">
                <Link href={`${connect("solflare.com")}`}>
                    <button className="bg-black hover:bg-gray-900 text-white font-bold py-2 px-4 rounded w-48 h-12">
                        Deeplink in Solflare
                    </button>
                </Link>
            </div> */}


            {/* <div>
                { dappKeyPair.publicKey.toString() }
            </div> */}


            {/* <ul className="flex items-center font-neueHaasUnicaRegular py-2 justify-center">
                <li className="pl-6">
                    <WalletMultiButton className='bg-black ' />
                </li>
            </ul> */}
        </>
    )

}