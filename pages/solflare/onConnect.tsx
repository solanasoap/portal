import type { NextPage } from 'next'
import bs58 from "bs58";
import { useState, useEffect } from "react";
import Head from 'next/head';
import { useRouter } from 'next/router'
import { GetServerSideProps } from "next";
import { PublicKey } from '@solana/web3.js';
import nacl, { BoxKeyPair } from 'tweetnacl';
import { decryptPayload } from '../../utils/decryptPayload';
import Cookies from 'js-cookie';

// onConnectV2 servers Soap Dealer & Mintooor.
// It uses cookies and saves the full dappKeyPair
// It can also forward to a page by using "target" url query param

const OnConnect: NextPage = (props) => {
    const [errorMessage, setErrorMessage] = useState(null)

    // Get Query Params from solflare deeplink redirect
    const router = useRouter()
    const queryParams = router.query

    // const [walletState, setWalletState] = useWalletContext();
    // setWalletState(queryParams)

    const [dappKeyPair, setDappKeyPair] = useState<BoxKeyPair>();
    const [solflareWalletPublicKey, setSolflareWalletPublicKey] =
        useState<PublicKey | boolean>(null);


    useEffect(() => {

        if (Cookies.get('dappKeyPair')) {
            console.log("Reusing keypair in local storage.")

            const dappKeyPairSecretKeyCookies = JSON.parse(Cookies.get('dappKeyPair')).secretKey

            // Create array from JSON secret key
            var secretKeyArray = [];
            for (var i in dappKeyPairSecretKeyCookies)
                secretKeyArray.push(dappKeyPairSecretKeyCookies[i]);

            // Create Uint8Array for secret key to be used in keypair
            const secretKeyUint8 = Uint8Array.from(secretKeyArray)
            const shouldDappKeyPair = nacl.box.keyPair.fromSecretKey(secretKeyUint8)

            setDappKeyPair(shouldDappKeyPair)


            if (router.query.data) {

                // console.log(router.query.solflare_encryption_public_key.toString())
                // console.log(router.query.data.toString())
                // console.log(router.query.nonce.toString())
                console.log(router.query)

                try {
                    const sharedSecretDapp = nacl.box.before(
                        bs58.decode(router.query["solflare_encryption_public_key"].toString()),
                        shouldDappKeyPair.secretKey // THIS FAILS IN PRIVATE TAB
                    );

                    const connectData = decryptPayload(
                        router.query.data.toString(),
                        router.query.nonce.toString(),
                        sharedSecretDapp
                    )

                    setSolflareWalletPublicKey(new PublicKey(connectData.public_key));
                    console.log(`connected to ${connectData.public_key.toString()}`);

                    // Save dappKeyPair in cookie
                    Cookies.set('walletAddress', connectData.public_key.toString())
                    // Direct to soaps
                    router.push(queryParams.target.toString() || "/")
                } catch (error) {
                    console.log("There was an error decrypting the connection data: ", error)
                    // if it's going to mintooor, redirect to dealer
                    const target: string = queryParams.target.toString()
                    if (target.indexOf('mintooor')) {
                        console.log("it was going to mintooor")
                        const targetSoap = target.substring(target.lastIndexOf('/') + 1);
                        setErrorMessage(true)
                        router.push(`/dealer/${targetSoap}`)
                    }
                }
            } else {
                // Direct to auth if not called from deeplink redirect
                router.push("/mobile")
            }
        } else {
            // Can't find dapp keypair but has target, likely coming from in-app browser
            console.log("Couldn't find dappKeyPair in local cookie.")
            // if it's going to mintooor, redirect to dealer.
            // TODO: Make this more dynamic?
            console.log(router.query)
            window.open(`/dealer/${router.query.soapAddress}`)
            const target: string = queryParams.target.toString()
            if (target.indexOf('mintooor')) {
                console.log("it was going to mintooor")
                const targetSoap = target.substring(target.lastIndexOf('/') + 1);
                setErrorMessage(true)
                router.push(`/dealer/${targetSoap}`)
            } else {
                // If all else fails
                router.push('/')
            }
        }

    }, []);

    return (
        <>
            <div className="px-5">
                <Head>
                    <title>Connecting...</title>
                    <meta name="description" content="Connecting to your wallet" />
                    <link rel="icon" href="/favicon.ico" />
                    <link rel="apple-touch-icon" href="/favicon.ico" />
                </Head>
                <main >
                    <div>
                        {errorMessage && (
                            <h4 className="text-center font-bold text-2xl leading-6">Opps, let&#39;s try again...</h4>
                        )}
                    </div>
                </main>
            </div>
        </>
    )

}

export default OnConnect

export const getServerSideProps: GetServerSideProps = async (context) => {
    // console.log("Solfalre onconnect getServerSideProps context.query: ", context.query)
    if (context.query["data"]) {

        var query = context.query

        // Return the ID to the component
        return {
            props: {
                query,
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
