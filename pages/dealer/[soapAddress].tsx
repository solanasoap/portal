import { NextPage } from "next"
import Head from "next/head"
import { Metaplex } from "@metaplex-foundation/js";
import { Connection, PublicKey } from "@solana/web3.js";
import Image from "next/image";
import WalletLogin from "../../components/WalletLogin";

const connection = new Connection("https://rpc.helius.xyz/?api-key=" + process.env.NEXT_PUBLIC_HELIUS_API_KEY);
const metaplex = new Metaplex(connection);

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


const soapAddress: NextPage<{ soapDetails: soapDetails }> = ({ soapDetails }) => {

    return (
        <div className="px-5">
            <Head>
                <title>SOAP Dealer</title>
                <meta name="description" content="SOAP" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/favicon.ico" />
            </Head>
            <main className="lg:max-w-7xl lg:justify-center lg:m-auto">
                <div className="flex-col lg:py-6 py-3">
                    <div className="inline text-5xl lg:text-5xl text-center font-phenomenaBlack h-12">
                        <h1>
                            Hey, you got a soap!
                        </h1>
                    </div>
                </div>
                <h4 className="text-3xl font-phenomenaRegular text-center py-2 drop-shadow-xl lg:pb-4">
                    {soapDetails.Name}
                </h4>
                <div className="flex py-2 w-full items-center justify-center drop-shadow-xl">
                    <div className="relative w-64 h-64 lg:w-96 lg:h96">
                        <div className="flex items-center justify-center w-auto h-64 lg:h-96">
                            <div className="relative flex h-64 w-64 lg:w-96 lg:h-96">
                                <div className="z-10 absolute w-full h-full flex justify-center items-center bg-gradient-to-br from-gray-900 to-black">
                                    <Image src={soapDetails.Image} layout="fill" />
                                </div>
                                <div className="absolute w-full h-full bg-conic-gradient filter blur-xl"></div>
                                <div className="absolute w-full h-full bg-conic-gradient filter blur-3xl opacity-60 animate-pulse"></div>
                                <div className="absolute -inset-0.5 rounded-sm bg-conic-gradient"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="lg:invisible">
                    <div className="py-2 px-12 justify-center flex items-center">
                        <WalletLogin
                            target={`/mintooor/${soapDetails.Address}`}
                            walletAction="Mint"
                            forceReconnect={true}
                        />
                    </div>
                </div>
                {/* <div className="invisible lg:visible ">
                    <div className="flow-root text-white bg-gradient-to-tr from-RBGradient-Red-Left to-RBGradient-Blue-Right p-8 mb-3 rounded-lg">
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
                                <QRCode value={`https://${process.env.NEXT_PUBLIC_BASE_URL}/dealer/${soapDetails.Address}`} />
                            </div>
                        </div>
                    </div>
                </div> */}
            </main>
        </div>
    )
}

export default soapAddress

export async function getStaticPaths() {
    return {
        paths: [
            { params: { soapAddress: 'YngRrzzvjvdAhWTCyNMgvyrmeJ8jt4hL7NUqaK4derF' } }, // early testooor
            { params: { soapAddress: '3NBSGW817Zg1kvttcn8eZWbz4iw7FtyBDVrrmy7YxaiH' } }, // soap lisbon
            { params: { soapAddress: '8TmfqtbvH58aHL2NcRGXA9SS3s39j2gseCVBdyyk8En' } }, // unloc rally
            { params: { soapAddress: 'Ha2Cvs4YqdTY4f7is9E8v3G6BXNMHhE2jHVmQgeRweft' } }, // BluntDAO proof of sesh v2.6
            { params: { soapAddress: 'EKoubfYoTcfdj6uML7dnUPFFwMHkRTWZM5cMpNDrzxku' } }, // SpliffDAO proof of sesh v2.6
            { params: { soapAddress: 'HvegCrU6Vc9UvSwJaPZeULWZN6u3fnWPdx5sefH85Fei' } }, // HackaTUM
        ],
        fallback: 'blocking', // can also be true or 'blocking'
    }
}

export async function getStaticProps(context) {
    const soapAddress: string = context.params.soapAddress;
    const mintAddress = new PublicKey(soapAddress);

    // TODO: Maybe filter if it is a soap and send back a "not soap mfer" pic if not
    const soap = await metaplex.nfts().findByMint({ mintAddress });
    const soapDetails: soapDetails = {
        Address: soapAddress || "soapAddressNotFound",
        Image: soap.json.image || "https://www.seekpng.com/png/full/251-2514375_free-high-quality-error-youtube-icon-png-2018.png", // FIXME: lol random error pic
        Name: soap.json.name || "soapNameNotFound"
    }

    return {
        props: { soapDetails }, // will be passed to the page component as props
    }
}

type soapDetails = {
    Address: string,
    Image: string,
    Name: string
}