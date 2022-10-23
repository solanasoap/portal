import { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import SoapDealer from "../../components/SoapDealer"

const soapAddress: NextPage = (props) => {


    return (
        <div className="px-5">
            <Head>
                <title>SOAP Dealer</title>
                <meta name="description" content="SOAP" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/favicon.ico" />
            </Head>
            <SoapDealer />
        </div>
    )
}

export default soapAddress