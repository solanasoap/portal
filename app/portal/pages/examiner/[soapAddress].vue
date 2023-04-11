<script setup lang="ts">
import { JsonMetadata, PublicKey } from "@metaplex-foundation/js";
import { metaplex } from "~/contants";

type soapDetails = {
  Address: string;
  Image: string;
  Name: string;
  Description: string;
  Attributes: any;
  Model: string;
};

const route = useRoute();
const { soapAddress } = route.params as { soapAddress: string };
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
  Address: soapAddress,
  Image:
    soap.json.image ||
    "https://www.seekpng.com/png/full/251-2514375_free-high-quality-error-youtube-icon-png-2018.png", // FIXME: lol random error pic
  Name: soap.json.name || "no name",
  Description: soap.json.description || "no description",
  Attributes: soap.json.attributes || null,
  Model: soap.model || "no model",
};
</script>

<template>
  <div class="px-4">
    <Head>
      <title>SOAP | Examiner</title>
      <meta name="description" content="SOAP" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/favicon.ico" />
    </Head>
    <main class="lg:max-w-7xl mx-auto">
      <div class="inline-block py-2 w-full drop-shadow-xl">
        <div class="relative">
          <img
            :src="soapDetails.Image"
            width="2024"
            height="2024"
            class="rounded-lg relative"
          />
        </div>
      </div>

      <div>
        <OwnSoap :soapAddress="soapDetails.Address" />
      </div>

      <div class="flex-col py-2">
        <div class="inline text-6xl font-phenomenaBlack h-12">
          <h1>
            {{ soapDetails.Name }}
          </h1>
        </div>
      </div>

      <div class="flex-col pt-2 pb-6">
        <div class="inline text-xl font-neueHaasUnicaRegular h-12">
          <h1>
            {{ soapDetails.Description }}
          </h1>
        </div>
      </div>

      <h1 class="text-5xl font-phenomenaBlack mb-2">Traits</h1>
      <div class="mx-auto pb-8">
        <div class="grid grid-flow-row gap-2 auto-cols-auto">
          <div
            v-if="soapDetails.Attributes"
            v-for="(attribute, index) in soapDetails.Attributes"
            :key="index"
            class="flex"
          >
            <div class="px-1 rounded-md h-16 w-full mx-auto">
              <h1 class="font-bold font-phenomenaBlack text-2xl">
                {{ attribute.trait_type }}
              </h1>
              <h3 class="font-phenomenaRegular text-xl leading-5">
                {{ attribute.value }}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div
        class="flex justify-center flex-row items-center mt-2 mb-12 pt-2 gap-4"
      >
        <NuxtLink
          :to="`https://explorer.solana.com/address/${soapDetails.Address}`"
        >
          <div class="relative group">
            <button
              class="relative px-7 py-4 bg-black rounded-lg leading-none flex items-center uppercase font-neueHaasUnicaBlack"
            >
              See soap on-chain
            </button>
          </div>
        </NuxtLink>
        <NuxtLink :href="`/soaps`">
          <div class="relative group">
            <button
              class="relative px-7 py-4 bg-black rounded-lg leading-none flex items-center uppercase font-neueHaasUnicaBlack"
            >
              See in my Collection
            </button>
          </div>
        </NuxtLink>
      </div>
    </main>
  </div>
</template>
