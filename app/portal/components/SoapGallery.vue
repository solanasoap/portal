<script setup lang="ts">
import { FindNftsByOwnerOutput, Metadata,JsonMetadata, Metaplex, Nft, PublicKey, Sft } from '@metaplex-foundation/js';
import { connection } from '~/contants';

const router = useRouter()

const walletAddress = useState<string | null>("walletAddress", () => null)
const nftList = useState<(Metadata | Nft | Sft)[] | null>("nftList", () => null);
const loading = useState("soapGalleryLoading", () => false);
const currentPage = useState("currentPage", () => 1);
const currentView = useState<(Metadata | Nft | Sft)[] | null>("currentView", () => null);
const userHasSoap = useState("userHasSoap", () => true)
const perPage = 30;

const mxconnection = connection;
const mx = Metaplex.make(mxconnection);
const soapCollectionId = new PublicKey("9McAofPndtizYttpcdPD4EnQniJZdCG7o6usF2d4JPDV")


// Fetch all NFTs held by wallet
const fetchNFTs = async () => {
    try {
        loading.value = true;
        currentView.value = null;
        // FIXME: This doesn't return SFT soaps if the user has more than 1 in their wallet
        if (walletAddress.value == null) {
            return;
        }
        const list: FindNftsByOwnerOutput = await mx.nfts().findAllByOwner({ owner: new PublicKey(walletAddress.value) });
        nftList.value = soapList(list);
        currentPage.value = 1;
    } catch (e) {
        console.error(e);
    }
};

// redirect to login page
const goToLoginPage = async () => {
    await sleep(2000)
    router.push('mobile')
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Filter only for authentic soaps from all nfts held by wallet
const soapList = (list: FindNftsByOwnerOutput) => {
    let soaps: (Metadata | Nft | Sft)[] = []
    list.map(nft => {
        if (nft.collection != null && nft.collection.verified == true) {
            if (nft.collection.address.toBase58() == soapCollectionId.toBase58()) {
                soaps.push(nft)
            }
        }
    })
    return soaps
}

// Update nft data in view when nftList or currentPage state gets updated
watchEffect(() => {
    if (!nftList.value) {
        return;
    }

    const execute = async () => {
        const startIndex = (currentPage.value - 1) * perPage;
        const endIndex = currentPage.value * perPage;
        const nftsWithoutImage = await loadData(startIndex, endIndex);
        // get json data from uri
        const nfts = nftsWithoutImage.map(async (nft) => {
            const jsonMetadata =await (await fetch(nft.uri, { method: 'GET' })).json() as JsonMetadata;
            return {
                ...nft,
                json: jsonMetadata
            }
        });
        if (nfts.length == 0) {
            console.log("No NFTs held by wallet.")
            currentView.value = null;
            userHasSoap.value = false
        } else {
            currentView.value = await Promise.all(nfts);
        }
        loading.value = false;
    };

    execute();

},
    { flush: 'post' });


const loadData = async (startIndex: number, endIndex: number) => {
    if (!nftList.value) {
        return [];
    }
    const nftsToLoad = nftList.value.filter((_: any, index: number) => (index >= startIndex && index < endIndex))

    const promises = nftsToLoad.map((metadata: any) => mx.nfts().load({ metadata }));
    return Promise.all(promises);
};

// Update nftList when walletAddress state gets updated
watchEffect(() => {
    if (walletAddress.value) {
        fetchNFTs()
    }
}, { flush: 'post' })

// First load only
onMounted(() => {
    if (!walletAddress.value) {
        const walletAddressCookie = useCookie("walletAddress")
        if (walletAddressCookie.value) {
            console.log("We found a public key of a user, we'll continue with that: ", walletAddressCookie.value);
            walletAddress.value = walletAddressCookie.value;
        } else {
            console.log("you got no wallet address in your local storage ser")
            goToLoginPage()
            return
        }
    }
})
</script>

<template>
    <div>
        <div>
            <p
                class='font-bold font-phenomenaRegular text-4xl text-center flex-col flex justify-center text-white px-2 py-2 rounded-lg'>
            <div v-if="!walletAddress">
                <p>Please log in to see your soaps.</p>
                <div class='flex justify-center'>
                    <img  src="/loading.svg" />
                </div>
            </div>
            </p>
        </div>

        <div v-if="walletAddress && currentView">
            <div>
                <h1 class='text-6xl font-phenomenaBlack mt-[-20pt] pb-6'>
                    your collection
                </h1>
            </div>
            <div class="flex text-white px-0 pt-2 mb-4 rounded-lg">
                <div>
                    <div v-if="loading" class='flex justify-center'>
                        <img src="/loading.svg" />
                    </div>
                    <div v-if="currentView" v-for="(nft, index) in currentView" :key="index"
                        class="w-full flex px-4 flex-col rounded-xl mb-4 bg-gradient-to-tr from-[#e10b00] to-RBGradient-Red-Left shadow-md">
                        <h1 class="font-bold font-phenomenaBlack flex py-3 pt-2 text-3xl justify-start">{{ nft.name }}</h1>
                        <NuxtLink :href="`/examiner/${nft.address.toBase58()}`">
                            <img
                            :src="nft?.json?.image || '/fallbackImage.jpg'"
                            class="flex items-center justify-center w-auto h-auto rounded-lg mb-6 shadow-lg hover:shadow-md cursor-pointer"
                            alt="The downloaded illustration of the provided NFT address." />
                        </NuxtLink>
                    </div>

                </div>
            </div>
        </div>
        <div v-else-if="loading" class='flex justify-center'>
            <img src="/loading.svg" />
        </div>

        <div v-if="!currentView && walletAddress && !userHasSoap"
            class="flex-col text-white mb-3 bg-gradient-to-tr from-RBGradient-Red-Left to-RBGradient-Blue-Right p-8 rounded-b-lg rounded-t-lg h-auto">
            <p class='font-bold font-phenomenaRegular flex pb-2 text-4xl text-center'>Can&#39;t find any soaps here!</p>
        </div>

    </div>
</template>
