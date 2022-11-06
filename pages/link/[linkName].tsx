import { NextPage } from "next"
import { useRouter } from "next/router"

const links = {
    StripDAOxUnlocParty: "",
    SoapLisbon: "3NBSGW817Zg1kvttcn8eZWbz4iw7FtyBDVrrmy7YxaiH",
    Unloc: "8TmfqtbvH58aHL2NcRGXA9SS3s39j2gseCVBdyyk8En",
    BluntDAO: "Ha2Cvs4YqdTY4f7is9E8v3G6BXNMHhE2jHVmQgeRweft"
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