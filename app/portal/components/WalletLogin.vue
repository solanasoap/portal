<script setup lang="ts">
import nacl from "tweetnacl";
import bs58 from "bs58";
import { detectIncognito } from "detectincognitojs";
import Cookies from "js-cookie";

const buildUrl = (
  walletEndpoint: string,
  path: string,
  params: URLSearchParams
) => `https://${walletEndpoint}/ul/v1/${path}?${params.toString()}`;

const props = defineProps<{
  walletAction: "Connect" | "Mint";
  target: string;
  forceReconnect: boolean;
}>();

const config = useRuntimeConfig();

const incognito = useState<boolean | null>("incognito", () => null);
const solanaPayUrl = useState<string | null>("solanaPayUrl", () => null);

const base_url = config.public.baseUrl;
const extraQueryParams = `?target=${props.target}&`;
const soapAddress = props.target.split("/").pop();

const dappKeyPair = useState("dappKeyPair", () => nacl.box.keyPair());
const walletAddress = useState<string | null>("walletAddress", () => null);

const connect = (walletEndpoint: string) => {
  const onConnectRedirectLink = `https://${base_url}/${
    walletEndpoint.split(".")[0]
  }/onConnect`;
  const params = new URLSearchParams({
    dapp_encryption_public_key: bs58.encode(dappKeyPair.value.publicKey),
    cluster: "mainnet-beta",
    app_url: `https://${base_url}`,
    redirect_link: onConnectRedirectLink + extraQueryParams,
  });

  const url = buildUrl(walletEndpoint, "connect", params);
  console.log("URL of deeplink request: ", url);
  return url;
};

const disconnect = () => {
  console.log("Clearing local storage of wallet info. Disconnecting...");
  // localStorage.removeItem('dappKeyPairSecretKey') // not remove yet...
  localStorage.removeItem("userPublicKey");
  Cookies.remove("walletAddress");
  alert("Wallet disconnected!");
  window.location.reload();
};

onMounted(async () => {
  await detectIncognito().then((result) => {
    incognito.value = result.isPrivate;
  });

  // check if localstorage exists for local keypair
  // load if yes, create and save if no
  if (!walletAddress.value && !props.forceReconnect) {
    if (Cookies.get("walletAddress")) {
      console.log(
        "We found a public key of a user, we'll continue with that: ",
        Cookies.get("walletAddress")
      );
      walletAddress.value = Cookies.get("walletAddress")!;
    } else {
      console.log(
        "WalletLogin: you got no userPublicKey in your local storage ser"
      );
    }
  }

  if (Cookies.get("dappKeyPair")) {
    console.log("Using dapp keypair in local storage.");
    console.log("dappKeypairCookie.value: ", Cookies.get("dappKeyPair")!);
    const dappKeyPairSecretKeyCookies = JSON.parse(Cookies.get("dappKeyPair")!)
      ._object.$sdappKeyPair.secretKey;

    // Create array from JSON secret key
    var secretKeyArray = [];
    for (var i in dappKeyPairSecretKeyCookies)
      secretKeyArray.push(dappKeyPairSecretKeyCookies[i]);

    // Create Uint8Array for secret key to be used in keypair
    const secretKeyUint8 = Uint8Array.from(secretKeyArray);
    const shouldDappKeyPair = nacl.box.keyPair.fromSecretKey(secretKeyUint8);

    dappKeyPair.value = shouldDappKeyPair;
  } else {
    console.log("No dApp keypair for deeplinking. Generating.");
    // localStorage.setItem('dappKeyPairSecretKey', JSON.stringify(dappKeyPair.secretKey))
    console.log("here", dappKeyPair.value);

    Cookies.set("dappKeyPair", JSON.stringify(dappKeyPair), {
      sameSite: "strict",
    });
  }

  // Create Solana Pay Mint URL
  if (props.target) {
    const urlToEncode = `https://${config.public.baseUrl}/api/solPayMint?soap=${soapAddress}`;
    const encodedSolanaPayMintUrl = "solana:" + encodeURIComponent(urlToEncode);
    solanaPayUrl.value = encodedSolanaPayMintUrl;
    console.log("Solana Pay URL: ", encodedSolanaPayMintUrl);
  }
});
</script>

<template>
  <div>
    <div>
      <div v-if="!walletAddress && !incognito">
        <div class="flex-col">
          <NuxtLink :href="`${connect('phantom.app')}`">
            <button
              class="bg-gradient-to-tr from-phantomBottomLeft to-phantomTopRight hover:shadow-md text-white font-bold py-2 px-4 rounded w-64 h-16 my-2 block"
            >
              {{ `${walletAction} with Phantom` }}
            </button>
          </NuxtLink>
          <NuxtLink :href="`${connect('solflare.com')}`">
            <button
              class="bg-gradient-to-tr from-[#fc4d2e] to-[#fe9820] hover:shadow-md text-white font-bold py-2 px-4 rounded w-64 h-16 my-2 block"
            >
              {{ `${walletAction} with Solflare` }}
            </button>
          </NuxtLink>
          <div v-if="walletAction == 'Mint' && solanaPayUrl">
            <a :href="solanaPayUrl" target="_blank" rel="noreferrer">
              <button
                class="bg-gradient-to-tr from-[#8504fa] to-[#e96dfd] hover:shadow-md text-white font-bold py-2 px-4 rounded w-64 h-16 my-2 block opacity-90"
              >
                {{ `${walletAction} with Glow` }}
              </button>
            </a>
          </div>
        </div>
      </div>
      <h4
        v-if="incognito === true"
        class="text-center font-bold text-2xl leading-6"
      >
        {{
          `You're currently in a private window. Open this page in a regular window to ${walletAction.toLowerCase()}.`
        }}
      </h4>
    </div>
    <div class="py-2 justify-end flex">
      <button
        v-if="walletAddress"
        @click="disconnect"
        class="bg-black hover:shadow-md text-white font-bold py-2 px-4 rounded w-64 h-16"
      >
        Disconnect
      </button>
    </div>
  </div>
</template>
