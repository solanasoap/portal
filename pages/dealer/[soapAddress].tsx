import { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import SoapDealer from "../../components/SoapDealer"
import { Metaplex } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import Image from "next/image";

const connection = new Connection("https://broken-green-forest.solana-mainnet.discover.quiknode.pro/" + process.env.NEXT_PUBLIC_QUICKNODE_API_KEY + "/");
const metaplex = new Metaplex(connection);


const soapAddress: NextPage<{ soapDetails: soapDetails}> = ({ soapDetails }) => {


    return (
        <div className="px-5">
            <Head>
                <title>SOAP Dealer</title>
                <meta name="description" content="SOAP" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/favicon.ico" />
            </Head>
            <main>
                <SoapDealer
                    soapDetails={soapDetails}
                />
                {/* <Image src={soapImage} width="200" height="200" /> */}
            </main>
        </div>
    )
}

export default soapAddress

export async function getServerSideProps(context) {
    const soapAddress: string = context.query.soapAddress;
    const mintAddress = new PublicKey(soapAddress);

    // TODO: Maybe filter if it is a soap and send back a "not soap mfer" pic if not
    const soap = await metaplex.nfts().findByMint({ mintAddress });
    const soapDetails: soapDetails = {
        Address: soapAddress,
        Image: soap.json.image,
        Name: soap.json.name
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