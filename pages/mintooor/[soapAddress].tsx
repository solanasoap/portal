import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../../components/Header'
import Hero from '../../components/Hero'
import React, { } from 'react';
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { BalanceDisplay } from '../../components/BalanceDisplay';
import WalletLogin from '../../components/WalletLogin';
import { SoapGallery } from '../../components/SoapGallery';

// We get to this page from /wallet/OnConnect
// which forwards us here based on a query param "target" (todo)
// onConnect puts the wallet's publicKey into a cookie (todo)
// This page reads that cookie, and reads the soapAddress from the forwarded url
// get soap jpeg based on soapAddress & start animation for "minting"
// with the toPublicKey (cookie) and soapAddress (url), we POST to /api/dispense
// /api/dispense?toPublicKey=<string>&soapAddress=<string>&secret=<API_SECRET>
// api sends back tx signature of mint in ~5-20 seconds
// track confirmation and animate display based on that
// user receives soap

const Dispenser: NextPage = (props) => {

    return (
        <div className="px-5">
            <Head>
                <title>Soap Mintooor</title>
                <meta name="description" content="Minting a soap." />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main >
                <Header></Header>
                <p>I'm mintiiiin....</p>
            </main>
        </div>



    )
}

export default Dispenser