import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../components/Header'
import Hero from '../components/Hero'
import React, { } from 'react';
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { BalanceDisplay } from '../components/BalanceDisplay';
import WalletLogin from '../components/WalletLogin';
import { SoapGallery } from '../components/SoapGallery';

const Dispenser: NextPage = (props) => {

    return (
        <div className="px-5">
            <Head>
                <title>You got soap!</title>
                <meta name="description" content="A soap dispenser." />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main >
                <Header></Header>
                <p>beep boop soap dispenser here</p>
            </main>
        </div>



    )
}

export default Dispenser