import { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react";


const Link: NextPage<{ linkDetails: linkDetails }> = ({ linkDetails }) => {
    const [targetSoap, setTargetSoap] = useState()

    const router = useRouter()
    const queryParams = router.query

    const links = {
        StripDAOxUnlocParty: "4UMhYMjSQE3Q8vWtA4nD1CrkcQMbg7zfgiy4UBm24xTx"
    }

    useEffect(() => {
        setTargetSoap(links[queryParams.linkName as string])
    }, [])

    useEffect(() => {
        if (targetSoap) {
            router.push(`/dealer/${targetSoap}`)
        }
    }, [targetSoap])

    return (
        <h4 className="text-center font-bold text-2xl leading-6 py-6 font-neueHaasUnicaRegular">Redirecting...</h4>
    )
}

export default Link

export async function getServerSideProps(context) {
    const links = [
        {
            "StripDAOxUnlocParty": "DmJkS5j6ycbtUCxZJFbnQQoMQY7Q6pyBR3KxGQEByJ3q"
        }
    ]
    const linkName: string = context.query.linkName
    console.log("linkName: ", linkName)


    return {
        props: { forwardTo: `/mintooor/${links[linkName]}` }, // will be passed to the page component as props
    }
}

type linkDetails = {
    forwardTo: string
}