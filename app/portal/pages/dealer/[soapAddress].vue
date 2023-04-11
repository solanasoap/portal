<script setup lang="ts">
import { JsonMetadata, PublicKey } from "@metaplex-foundation/js";
import { metaplex } from "~/contants";

type soapDetails = {
  Address: string;
  Image: string;
  Name: string;
};

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
</script>

<template>
  <div class="px-5">
    <Head>
      <title>SOAP Dealer</title>
      <meta name="description" content="SOAP" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/favicon.ico" />
    </Head>
    <main class="lg:max-w-7xl lg:justify-center lg:m-auto">
      <!-- <div class="flex-col lg:py-6 py-3">
                    <div class="inline text-5xl lg:text-5xl text-center font-phenomenaBlack h-12">
                        <h1>
                            Hey, you got a soap!
                        </h1>
                    </div>
                </div>  -->
      <h4
        class="text-4xl font-phenomenaBlack text-center py-4 drop-shadow-xl lg:pb-4 lg:py-6"
      >
        {{ soapDetails.Name }}
      </h4>
      <div class="flex py-2 w-full items-center justify-center drop-shadow-xl">
        <div class="relative w-64 h-64 lg:w-96 lg:h96">
          <div class="flex items-center justify-center w-auto h-64 lg:h-96">
            <div class="relative flex h-64 w-64 lg:w-96 lg:h-96">
              <div
                class="z-10 absolute w-full h-full flex justify-center items-center bg-gradient-to-br from-gray-900 to-black"
              >
                <img
                  :src="soapDetails.Image"
                  layout="fill"
                  class="object-cover"
                />
              </div>
              <div
                class="absolute w-full h-full bg-conic-gradient filter blur-xl"
              ></div>
              <div
                class="absolute w-full h-full bg-conic-gradient filter blur-3xl opacity-60 animate-pulse"
              ></div>
              <div
                class="absolute -inset-0.5 rounded-sm bg-conic-gradient"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div class="lg:invisible">
        <div class="py-2 px-12 justify-center flex items-center">
          <WalletLogin
            :target="`/mintooor/${soapDetails.Address}`"
            walletAction="Mint"
            :force-reconnect="true"
          />
        </div>
      </div>
      <!-- <div class="invisible lg:visible ">
                    <div class="flow-root text-white bg-gradient-to-tr from-RBGradient-Red-Left to-RBGradient-Blue-Right p-8 mb-3 rounded-lg">
                        <div class="float-left max-w-3xl lg:pl-32 font-neueHaasUnicaRegular">
                            <div class="pt-6 py-6">
                                <div class="text-3xl lg:text-6xl md:text-4xl font-bold">
                                    We&#39;re mobile first.
                                </div>
                            </div>
                            <div class="py-2 text-xl">
                                <p>Apologies, we plan to create a cross-platform experience in the future. For now, open this page on your phone by using the QR code. </p>
                            </div>
                        </div>
                        <div class="float-right font-neueHaasUnicaRegular bg-white rounded-lg mx-32">
                            <div class=" p-4">
                                <QRCode value={`https://${process.env.NEXT_PUBLIC_BASE_URL}/dealer/${soapDetails.Address}`} />
                            </div>
                        </div>
                    </div>
                </div> -->
    </main>
  </div>
</template>
