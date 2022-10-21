import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../components/Header'
import Hero from '../components/Hero'
import React, { } from 'react';
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { BalanceDisplay } from '../components/BalanceDisplay';
import WalletLogin from '../components/WalletLogin';
import QRCode from 'react-qr-code'

const Collection: NextPage = (props) => {


  return (
    <div className="px-5">
      <Head>
        <title>New mobile adapter</title>
        <meta name="description" content="See your collection of soaps." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main >
        <Header></Header>
        <div className="lg:invisible">
          <WalletLogin></WalletLogin>
        </div>

        <div className="invisible lg:visible ">
          <div className="flow-root text-white bg-gradient-to-tr from-RBGradient-Red-Left to-RBGradient-Blue-Right p-8 mt-4 mb-3 rounded-lg">
            <div className="float-left max-w-3xl lg:pl-32 font-neueHaasUnicaRegular">
              <div className="pt-6 py-6">
                <div className="text-3xl lg:text-6xl md:text-4xl font-bold">
                  We&#39;re mobile first.
                </div>
              </div>
              <div className="py-2 text-xl">
                <p>Apologies, we plan to create a cross-platform experience in the future. For now, open this page on your phone by using the QR code. </p>
              </div>
            </div>
            <div className="float-right font-neueHaasUnicaRegular bg-white rounded-lg mx-32">
              <div className=" p-4">
                <QRCode value={"https://" + process.env.NEXT_PUBLIC_BASE_URL} />
              </div>
            </div>
          </div>
        </div>

        {/* <BalanceDisplay></BalanceDisplay> */}

      </main>
    </div>



  )
}

export default Collection