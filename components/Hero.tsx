import Link from 'next/link'

export default function Hero() {
    return (
        <>
            <div className="flex text-white bg-gradient-to-tr from-RBGradient-Red-Left to-RBGradient-Blue-Right py-8 px-6 mt-2 rounded-lg">
                <div className="lg:px-6 font-neueHaasUnicaRegular">
                    <div className="pt-6 py-6">
                        <div className="text-3xl lg:text-6xl md:text-4xl font-bold lg:w-5/6">
                            Soap lets you create digital collectibles and helps you distribute them.
                        </div>
                    </div>
                    <div className="py-2 text-xl lg:w-5/6">
                        <p> Reward people for completing challenges, participating in spaces, or attending events. Be it a virtual or real life experience, soap offers tools to engage with your community on-chain. </p>
                    </div>
                    <div className="py-8">
                        <Link href="/soaps">
                            <button className=" bg-RBGradient-Blue-Right hover:shadow-md uppercase font-neueHaasUnicaBlack text-white font-bold py-2 px-4 rounded w-64 h-16">
                                see your soaps
                            </button>
                        </Link>
                        <div className="py-8">
                            <Link href="/dealer/YngRrzzvjvdAhWTCyNMgvyrmeJ8jt4hL7NUqaK4derF">
                                <button className=" bg-RBGradient-Blue-Right hover:shadow-md uppercase font-neueHaasUnicaBlack text-white font-bold py-2 px-4 rounded w-64 h-16">
                                    Test dealer
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
