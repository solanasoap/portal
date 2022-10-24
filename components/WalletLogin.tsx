import Link from 'next/link'
import bs58 from "bs58";
import { useState, useEffect } from "react";
import nacl from "tweetnacl";
import router from "next/router";
import Cookies from "js-cookie";

/// redirect link from connect is /onConnect/ on our end
/// it should receive all the wallet info and store it in state
/// then it should redirect to wherever it was coming from
/// which it gets from the redirect url through query params
/// target page try autoconnect
/// reads state for what it's looking for if signed in
/// shows "log in mfer" if not signed in

const buildUrl = (walletEndpoint: string, path: string, params: URLSearchParams) =>
    `https://${walletEndpoint}/ul/v1/${path}?${params.toString()}`;

export default function WalletLogin({ walletAction, target, forceReconnect }) {

    const base_url = process.env.NEXT_PUBLIC_BASE_URL
    const onConnectRedirectLink = `https://${base_url}/phantom/onConnect?target=${target}`

    const [dappKeyPair, setDappKeyPair] = useState(nacl.box.keyPair());
    const [walletAddress, setWalletAddress] = useState<string | null>(null)

    const connect = (walletEndpoint: string) => {
        const params = new URLSearchParams({
            dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
            cluster: "mainnet-beta",
            app_url: `https://${base_url}`,
            redirect_link: onConnectRedirectLink,
        });

        const url = buildUrl(walletEndpoint, "connect", params);
        return url
    };

    const disconnect = () => {
        console.log("Clearing local storage of wallet info. Disconnecting...")
        // localStorage.removeItem('dappKeyPairSecretKey') // not remove yet...
        localStorage.removeItem('userPublicKey')
        Cookies.remove('walletAddress')
        alert("Wallet disconnected!")
        router.reload()
    }

    useEffect(() => {
        // check if localstorage exists for local keypair
        // load if yes, create and save if no
        if (!walletAddress && !forceReconnect) {
            if (Cookies.get('walletAddress')) {
                console.log("We found a public key of a user, we'll continue with that: ", Cookies.get('walletAddress'))
                setWalletAddress(Cookies.get('walletAddress'))
            } else {
                console.log("WalletLogin: you got no userPublicKey in your local storage ser")
            }
        }

        if (Cookies.get('dappKeyPair')) {
            console.log("Using dapp keypair in local storage.")

            const dappKeyPairSecretKeyCookies = JSON.parse(Cookies.get('dappKeyPair')).secretKey

            // Create array from JSON secret key
            var secretKeyArray = [];
            for (var i in dappKeyPairSecretKeyCookies)
                secretKeyArray.push(dappKeyPairSecretKeyCookies[i]);

            // Create Uint8Array for secret key to be used in keypair
            const secretKeyUint8 = Uint8Array.from(secretKeyArray)
            const shouldDappKeyPair = nacl.box.keyPair.fromSecretKey(secretKeyUint8)

            setDappKeyPair(shouldDappKeyPair)
        } else {
            console.log("No dApp keypair for deeplinking. Generating.")
            // localStorage.setItem('dappKeyPairSecretKey', JSON.stringify(dappKeyPair.secretKey))
            Cookies.set('dappKeyPair', JSON.stringify(dappKeyPair), { sameSite: 'strict' })
        }
    }, [])

    return (
        <>
            <div className="">
                {!walletAddress && (
                    <div className="">
                        <Link href={`${connect("phantom.app")}`}>
                            <button className="bg-phantomPurple hover:shadow-md text-white font-bold py-2 px-4 rounded w-64 h-16 my-2">
                                {`${walletAction} with Phantom`}
                            </button>
                        </Link>
                        <Link href={`${connect("solflare.com")}`}>
                            <button className="bg-orange-700 hover:shadow-md text-white font-bold py-2 px-4 rounded w-64 h-16 my-2">
                                {`${walletAction} with Solflare`}
                            </button>
                        </Link>
                    </div>
                )}
            </div>
            <div className="py-2 justify-end flex ">
                {walletAddress && (
                    <button onClick={disconnect} className="bg-black hover:shadow-md text-white font-bold py-2 px-4 rounded w-64 h-16">
                        Disconnect
                    </button>
                )}
            </div>
        </>
    )
}