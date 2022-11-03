import { NextPage } from "next"
import { useRouter } from "next/router"

const links = {
    StripDAOxUnlocParty: ""
}

const Link: NextPage = () => {

    const router = useRouter()
    const queryParams = router.query
    const targetSoap = links[queryParams.linkName as string]

    if (targetSoap) {
        router.push(`/dealer/${targetSoap}`)
    }

    return (
        <h4 className="text-center font-bold text-2xl leading-6 py-6 font-neueHaasUnicaRegular">Redirecting...</h4>
    )
}

export default Link