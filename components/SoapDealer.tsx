import { useState, useEffect } from "react";
import Cookie from "js-cookie";
import { parseCookies } from "../lib/parseCookies";
import { PublicKey } from "@metaplex-foundation/js";
import { useRouter } from "next/router";
import Image from "next/image";
import nacl from "tweetnacl";
import bs58 from "bs58";

// SCOPE NO
// This does not handle already logged in in the beginning - future todo
// because most users will open the soap dispenser page for the first time
// and need to auth anyways. so we can just make them auth each time

// SCOPE YES
// user scans QR code which opens up this page
// /dispenser/<soapAddress>
// DONE get soapAddress from url query param, get picture of soap and display it
// generate dappKeyPair and store it in a cookie "dappKeyPair"
// construct deeplink call [based on user's wallet choice] to wallet, with target to /mintooor/<soapAddress>

// -- /dispenser/HKPcjAi699egocGNqMVEEkPqYAwPZ12oqFWKfzVcCudV
// -> https://phantom.app/ul/v1/connect?
//  & dapp_encryption_public_key=<dappKeyPair.publicKey>
//  & cluster=mainnet-beta
//  & app_url=https://portal-solsoap.vercel.app
//  & redirect_link=https://portal-solsoap.vercel.app/phantom/onConnectV2?target=/mintooor/<soapAddress>


const SoapDealer = ({ soapDetails }) => {


  return (
    <>
      <div className="px-5 pt-6" >
        <div className="inline text-7xl font-phenomenaBlack h-12">
          <h1>
            Hey, you got a soap!
          </h1>
        </div>
      </div>
      <h4 className="text-2xl font-phenomenaRegular text-center pt-12 drop-shadow-xl">
        {soapDetails.Name}
      </h4>
      <div className="flex py-2 w-full items-center justify-center drop-shadow-xl">
        <div className="relative w-72 h-72 ">
          <Image src={soapDetails.Image} layout="fill" className="rounded-xl" />
        </div>
      </div>
    </>
  );
};



export default SoapDealer;