import { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react";


const Link: NextPage<{ linkDetails: linkDetails }> = ({ linkDetails }) => {
    const [targetSoap, setTargetSoap] = useState()

    const router = useRouter()
    const queryParams = router.query

    const links = {
        StripDAOxUnlocParty: "HLk9BKFHszaXu1PYj1T6fVbFkXFeCYJeWCYH6pXoQhWa"
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
        <h4 className="text-center font-bold text-2xl leading-6 py-6 font-neueHaasUnicaRegular">Connecting...</h4>
    )
}

export default Link

export async function getServerSideProps(context) {
    const links = [
        {
            "StripDAOxUnlocParty": "HLk9BKFHszaXu1PYj1T6fVbFkXFeCYJeWCYH6pXoQhWa"
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