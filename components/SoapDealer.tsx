import { useState, useEffect } from "react";
import Cookie from "js-cookie";
import { parseCookies } from "../lib/parseCookies";
import { PublicKey } from "@metaplex-foundation/js";
import { useRouter } from "next/router";
import Image from "next/image";
import nacl from "tweetnacl";
import bs58 from "bs58";

// This does not handle already logged in in the beginning
// because most users will open the soap dispenser page for the first time
// and need to auth anyways

// -- /dispenser/HKPcjAi699egocGNqMVEEkPqYAwPZ12oqFWKfzVcCudV
// -> https://phantom.app/ul/v1/connect?
//  & dapp_encryption_public_key=
//  & cluster=mainnet-beta
//  & app_url=https://portal-solsoap.vercel.app
//  & redirect_link=https://portal-solsoap.vercel.app/phantom/onConnect?target=/mintooor/<soapAddress>
// 
// 
// 
// 
// 
// 
// 

// /phantom/onConnect?dapp_encryption_public_key=...&cluster=mainnet-beta&app_url=https://nftsoap.com&redirect_link=https://nftsoap.com/phantom/onConnect

// What to do
// - 

// This [soapAddress].tsx page would have to handle:
// - If the user is already logged in, button will send mintTo instruction
// - If the user is not logged in show wallet modal, send connect to wallet, handle response, set user state to logged in, send mintTo instruction
// - Handle user login
// - Mint the soap


const buildUrl = (walletEndpoint: string, path: string, params: URLSearchParams) =>
  `https://${walletEndpoint}/ul/v1/${path}?${params.toString()}`;

const SoapDealer = () => {
  const [dappKeyPair, setDappKeyPair] = useState(nacl.box.keyPair());
  console.log("dappkeypair 1: ", dappKeyPair)

  if (Cookie.get("dappKeyPairSecretKey")) {
    console.log("Cookie already set, no need to set again")
    console.log(JSON.parse(Cookie.get("dappKeyPairSecretKey")))
  }

  // useEffect(() => {
  //   if (!Cookie.get("dappKeyPairSecretKey")) {
  //     console.log("Cookie not set yet, setting now")
  //     Cookie.set("dappKeyPairSecretKey", JSON.stringify(dappKeyPair))
  //   }
  // }, [dappKeyPair])

  const base_url = process.env.NEXT_PUBLIC_BASE_URL
  const onConnectRedirectLink = `https://${base_url}/phantom/onConnect`

  // const connect = (walletEndpoint: string) => {
  //   const params = new URLSearchParams({
  //     dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
  //     cluster: "mainnet-beta",
  //     app_url: `https://${base_url}`,
  //     redirect_link: onConnectRedirectLink,
  //   });

  //   const url = buildUrl(walletEndpoint, "connect", params);
  //   return url
  // };

  return (
    <>
      <div>
        {dappKeyPair.publicKey.toString()}
      </div>
      <div className="flex justify-center">
        <Image src="https://nftstorage.link/ipfs/bafybeib7z3rbaodrg6l6zpypaamxxof3antmflllcfxt6vitovhh25ukyi/2508.png" width={200} height={200} />
      </div>
    </>
  );
};

export function getServerSideProps({ req, res }) {
  return { props: { dappKeyPairSecretKey: req.cookies.dappKeyPairSecretKey || "fuck" } }
}

export default SoapDealer;