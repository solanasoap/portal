<script setup lang="ts">
import QRCode from "qrcode.vue";

const config = useRuntimeConfig();
</script>

<template>
  <div class="px-4 lg:max-w-7xl lg:justify-center lg:items-center lg:m-auto">
    <Head>
      <title>New mobile adapter</title>
      <meta name="description" content="Connect to mobile" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/favicon.ico" />
    </Head>
    <main>
      <div class="lg:invisible">
        <div class="flex">
          <div class="ml-auto">
            <WalletLogin
              target="/soaps"
              walletAction="Connect"
              :forceReconnect="false"
            />
          </div>
        </div>
      </div>

      <div class="invisible lg:visible lg:max-w-7xl">
        <div
          class="text-white bg-gradient-to-tr from-RBGradient-Red-Left to-RBGradient-Blue-Right px-4 py-8 mt-4 mb-3 rounded-lg"
        >
          <div class="lg:grid lg:grid-cols-2">
            <div class="pl-8">
              <div class="pb-2">
                <div class="text-3xl lg:text-6xl md:text-4xl font-bold">
                  We&#39;re mobile first.
                </div>
              </div>
              <div class="py-2 text-xl">
                <p>
                  Apologies, we plan to create a cross-platform experience in
                  the future. For now, open this page on your phone by using the
                  QR code.
                </p>
              </div>
            </div>
            <div class="font-neueHaasUnicaRegular bg-white rounded-lg m-auto">
              <div class="p-4">
                <QRCode
                  :value="`https://${config.public.baseUrl}`"
                  :size="250"
                  level="H"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
