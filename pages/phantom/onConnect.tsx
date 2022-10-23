import type { NextPage } from 'next'
import bs58 from "bs58";
import { useLocalStorage } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import Head from 'next/head';
import Header from '../../components/Header';
import { useRouter } from 'next/router'
import { GetServerSideProps } from "next";
import { PublicKey } from '@solana/web3.js';
import { useWalletContext } from "../../context/MobileWalletContext";
import nacl, { BoxKeyPair } from 'tweetnacl';
import { decryptPayload } from '../../utils/decryptPayload';


const OnConnect: NextPage = (props) => {
    // Get Query Params from Phantom deeplink redirect
    const router = useRouter()
    const queryParams = router.query
    // console.log("query params: ", queryParams)

    // const [walletState, setWalletState] = useWalletContext();
    // setWalletState(queryParams)

    const [dappKeyPair, setDappKeyPair] = useState<BoxKeyPair>();
    const [phantomWalletPublicKey, setPhantomWalletPublicKey] =
        useState<PublicKey | string>("");


    useEffect(() => {

        // TODO:
        // Get all NFTs that belong to the 9McAofPndtizYttpcdPD4EnQniJZdCG7o6usF2d4JPDV collection from user's wallet
        // Display all of them in a nice card system

        var shouldDappKeyPair2;

        if (localStorage.getItem('dappKeyPairSecretKey')) {
            console.log("Reusing keypair in local storage.")

            // Get "dappKeyPairSecretKey" from local storage
            const dappKeyPairSecretKeyLocalStorage = JSON.parse(localStorage.getItem('dappKeyPairSecretKey'))
            // console.log("dappkeypairsecretkeylocalstorage: ", dappKeyPairSecretKeyLocalStorage)

            // Create array from JSON secret key
            var secretKeyArray = [];
            for (var i in dappKeyPairSecretKeyLocalStorage)
                secretKeyArray.push(dappKeyPairSecretKeyLocalStorage[i]);

            // Create Uint8Array for secret key to be used in keypair
            const secretKeyUint8 = Uint8Array.from(secretKeyArray)
            const shouldDappKeyPair = nacl.box.keyPair.fromSecretKey(secretKeyUint8)
            // console.log("ShouldDappKeyPair: ", shouldDappKeyPair)

            setDappKeyPair(shouldDappKeyPair)
            shouldDappKeyPair2 = shouldDappKeyPair
            // console.log("dappKeyPair: ", dappKeyPair)

        }

        if (router.query.data) {

            // console.log(router.query.phantom_encryption_public_key.toString())
            // console.log(router.query.data.toString())
            // console.log(router.query.nonce.toString())

            const sharedSecretDapp = nacl.box.before(
                bs58.decode(router.query.phantom_encryption_public_key.toString()),
                shouldDappKeyPair2.secretKey
            );

            const connectData = decryptPayload(
                router.query.data.toString(),
                router.query.nonce.toString(),
                sharedSecretDapp
            )

            // FIXME: Redirects to auth page in case payload can't be decrypted
            // eg. Going from in-view browser to full safari, local storage doesn't transfer
            // todo: make it nicer
            if (!connectData) { router.push("/mobile"); return }
            
            // setSharedSecret(sharedSecretDapp);
            // setSession(connectData.session);
            setPhantomWalletPublicKey(new PublicKey(connectData.public_key));
            console.log(`connected to ${connectData.public_key.toString()}`);

            // Save public key of wallet in Local Storage
            localStorage.setItem('userPublicKey', connectData.public_key.toString())
            // Direct to soaps
            router.push("/soaps") // FIXME Make this dynamically read from the URL query param "target" || /soaps
        } else {
            // Direct to auth if not called from deeplink redirect
            router.push("/mobile")
        }

    }, []);


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
                    {/* <p>Wallet pubkey: {phantomWalletPublicKey.toString()}</p>
                    <div >
                        <p className='font-bold font-phenomenaRegular flex pb-2 text-4xl'>Wallet: {phantomWalletPublicKey.toString() ? `${phantomWalletPublicKey.toString().slice(0, 4)}...${phantomWalletPublicKey.toString().slice(-4)}` : "Not logged in"}</p>
                    </div> */}
                    {/* {{props}} */}

                </main>
            </div>
        </>
    )

}

export default OnConnect

export const getServerSideProps: GetServerSideProps = async (context) => {
    if (context.query["data"]) {

        var id = context.query["phantom_encryption_public_key"];

        // In this example, we might call a database or an API with given ID from the query parameters
        // I'll call a fake API to get the players name from a fake database
        //const res = await fetch(`https://api.mainnet-beta.solana.com/`);

        //console.log("FUCK", context.query)
        //console.log(context.query["phantom_encryption_public_key"])

        // Return the ID to the component
        return {
            props: {
                id,
            },
        };
    } else {
        console.log("No data came back from the wallet. User likely rejected the auth.")

        return {
            props: {

            },
        };
    }

};