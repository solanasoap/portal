<script setup lang="ts">
import { JsonMetadata, Metaplex, PublicKey } from "@metaplex-foundation/js";
import Cookies from "js-cookie";
import { connection, metaplex } from "~/contants";

interface soapDetails {
  Address: string;
  Image: string;
  Name: string;
}

const walletAddress = useState<string | null>("walletAddress", () => null);
const txSignature = useState<string | null>("txSignature", () => null);

const config = useRuntimeConfig();
const { soapAddress } = useRoute().params as { soapAddress: string };
const mintAddress = new PublicKey(soapAddress);

// TODO: Maybe filter if it is a soap and send back a "not soap mfer" pic if not
const soapWithoutJsonMetadata = await metaplex
  .nfts()
  .findByMint({ mintAddress });
const jsonmetadata: JsonMetadata = await (
  await fetch(soapWithoutJsonMetadata.uri, {
    method: "GET",
  })
).json();

const soap = {
  ...soapWithoutJsonMetadata,
  json: jsonmetadata,
};

const soapDetails: soapDetails = {
  Address: soapAddress || "soapAddressNotFound",
  Image:
    soap.json?.image ||
    "https://www.seekpng.com/png/full/251-2514375_free-high-quality-error-youtube-icon-png-2018.png", // FIXME: lol random error pic
  Name: soap.json?.name || "soapNameNotFound",
};

watch(walletAddress, async (newWalletAddress) => {
  const apiMintRequest = {
    toPublicKey: newWalletAddress,
    soapAddress: soapDetails.Address,
    secret: config.public.apiSecret,
  };

  const minted = Cookies.get(apiMintRequest.soapAddress);
  console.log(minted);

  // We should really check if we minted this or not
  // Otherwise it'll mint on every refresh lmao
  if (newWalletAddress && soapDetails.Address) {
    await $fetch("/api/mintSoap", {
      method: "POST",
      body: {
        toPublicKey: newWalletAddress,
        soapAddress: soapDetails.Address,
        secret: config.public.apiSecret,
      },
    })
      .then(async (res) => {
        console.log("API Response", res.data);
        txSignature.value = res.data.toString();
        alert("got here");
      })
      //TODO test this
      .catch((err) => {
        console.log("ERROR HERE", err);
        if (err.response.status == 403) {
          console.log("Failed to Mint. Try again.");
          txSignature.value = "403";
        }
        if (err.response.status == 418) {
          console.log("Forbidden: Wallet already has this soap.");
          txSignature.value = "418";
        }
        console.log("error in request", err);
      });
  }
});

watch(txSignature, (newTxSignature) => {
  Cookies.set(soapDetails.Address, "minted");
  console.log("txSignature", newTxSignature);
});

onMounted(() => {
  if (Cookies.get("walletAddress")) {
    walletAddress.value = Cookies.get("walletAddress")!;
  }
});
</script>

<template>
  <div class="px-5">
    <Head>
      <title>Soap Mintooor</title>
      <meta name="description" content="Minting a soap." />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main>
      <div
        class="flex items-center justify-center w-auto h-80 py-6 pt-12 pb-12 mb-8"
      >
        <div class="relative flex h-72 w-72">
          <div
            class="z-10 absolute w-full h-full flex justify-center items-center bg-gradient-to-br from-gray-900 to-black"
          >
            <img :src="soapDetails.Image" layout="fill" />
          </div>
          <div
            class="absolute w-full h-full bg-conic-gradient filter blur-xl"
          ></div>
          <div
            class="absolute w-full h-full bg-conic-gradient filter blur-3xl opacity-60 animate-pulse"
          ></div>
          <div class="absolute -inset-0.5 rounded-sm bg-conic-gradient"></div>
        </div>
      </div>
      <div class="py-2" v-if="!txSignature">
        <div class="inline">
          <div>
            <div class="flex-col text-center font-neueHaasUnicaBlack pb-3">
              <p class="text-2xl font-bold mb-2">
                {{ `${soapDetails.Name}` }}
              </p>
              <p class="text-2xl font-neueHaasUnicaRegular">
                <!-- /* TODO: Auto-resolve .sol address of wallet */ -->
                Minting to: <br />
                {{
                  walletAddress &&
                  `🔗 ${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
                }}
              </p>
            </div>
            <div class="flex justify-center">
              <img src="/loading.svg" />
            </div>
          </div>
        </div>
      </div>

      <div v-if="txSignature">
        <div v-if="txSignature == '418'">
          <p
            class="text-4xl font-phenomenaBlack pb-2 text-center items-center bg-transparent text-transparent bg-clip-text bg-gradient-to-r from-greenBottomLeft to-greenTopRight"
          >
            You already have this soap
          </p>
          <p
            class="text-3xl font-phenomenaBlack pb-2 px-12 text-center items-center bg-transparent"
          >
            {{ soapDetails.Name }}
          </p>
          <div>
            <div
              class="text-4xl font-phenomenaBlack py-2 text-center justify-center px-12 items-center"
            >
              <NuxtLink :href="`/examiner/${soapDetails.Address}`">
                <div class="relative group">
                  <div
                    class="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"
                  ></div>
                  <button
                    class="relative px-7 py-4 bg-black rounded text-lg mt-4 font-bold leading-none flex items-center uppercase font-neueHaasUnicaBlack"
                  >
                    See in my Collection
                  </button>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
        <div v-else>
          <div v-if="txSignature == '403'">
            <p
              class="text-4xl font-phenomenaBlack pb-2 text-center items-center bg-transparent text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500"
            >
              Error, please try again later.
            </p>
          </div>
          <div v-else>
            <div>
              <div
                class="flex justify-center flex-row items-center mt-2 pt-2 gap-4"
              >
                <NuxtLink :href="`https://solscan.io/tx/${txSignature}`">
                  <div class="relative group">
                    <div
                      class="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"
                    ></div>
                    <button
                      class="relative px-7 py-4 bg-black rounded-lg leading-none flex items-center uppercase font-neueHaasUnicaBlack"
                    >
                      Blockchain proof
                    </button>
                  </div>
                </NuxtLink>
                <NuxtLink :href="`/examiner/${soapDetails.Address}`">
                  <div class="relative group">
                    <div
                      class="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"
                    ></div>
                    <button
                      class="relative px-7 py-4 bg-black rounded-lg leading-none flex items-center uppercase font-neueHaasUnicaBlack"
                    >
                      See in my Collection
                    </button>
                  </div>
                </NuxtLink>
              </div>
            </div>
            <div class="pt-4">
              <p
                class="text-5xl font-phenomenaBlack text-center py-2 px-12 items-center text-transparent bg-clip-text bg-gradient-to-r from-greenBottomLeft to-greenTopRight"
              >
                You just minted
              </p>
              <p
                class="text-4xl font-phenomenaBlack text-center px-12 items-center text-transparent bg-clip-text bg-gradient-to-r from-greenBottomLeft to-greenTopRight"
              >
                {{ soapDetails.Name }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
