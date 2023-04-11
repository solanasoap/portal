<script setup lang="ts">
import Cookies from "js-cookie";

const walletAddress = useState<string | null>(
  "headerWalletAddress",
  () => null
);
const displayWalletBtn = useState<boolean>("displayWalletBtn", () => false);

const route = useRoute();

// FIXME: this is not gud, do better, just for MVP
// show wallet button on: examiner, soaps, index
// else dont
watch(route, (to, from) => {
  if (
    to.name?.toString() == "examiner" ||
    to.name?.toString() == "soaps" ||
    to.name?.toString() == "index"
  ) {
    displayWalletBtn.value = true;
  } else {
    displayWalletBtn.value = false;
  }
});

onMounted(() => {
  if (!walletAddress.value) {
    if (Cookies.get("walletAddress")) {
      walletAddress.value = Cookies.get("walletAddress")!;
    } else {
      return;
    }
  }
});
</script>

<template>
  <div class="lg:max-w-6xl m-auto">
    <header class="flex my-4 mx-4 lg:mx-0 justify-between">
      <NuxtLink href="/">
        <h1 class="text-6xl font-phenomenaBlack h-12 leading-6 cursor-pointer">
          soap
        </h1>
      </NuxtLink>
      <div v-if="displayWalletBtn" class="font-neueHaasUnicaRegular">
        <NuxtLink href="/mobile">
          <button
            class="bg-white hover:drop-shadow-md text-black font-bold py-2 w-40 rounded h-12 lg:invisible"
          >
            {{
              walletAddress
                ? `🔗 ${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
                : "WALLET"
            }}
          </button>
        </NuxtLink>
      </div>
    </header>
  </div>
</template>
