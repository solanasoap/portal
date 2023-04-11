<script setup lang="ts">
import { PublicKey } from "@metaplex-foundation/js";
import Cookies from "js-cookie";
import nacl, { BoxKeyPair } from "tweetnacl";
import bs58 from "bs58";
import { decryptPayload } from "~/utils";

const errorMessage = useState<boolean | null>(
  "solflareOnConnectErrorMessage",
  () => null
);

// Get Query Params from solflare deeplink redirect
const route = useRoute();
const router = useRouter();
const queryParams = route.query;

// const [walletState, setWalletState] = useWalletContext();
// setWalletState(queryParams)

const dappKeyPair = useState<BoxKeyPair | null>("dappKeyPair", () => null);
const solflareWalletPublicKey = useState<PublicKey | boolean | null>(
  "solflareWalletPublicKey",
  () => null
);

onMounted(() => {
  if (Cookies.get("dappKeyPair")) {
    console.log("Reusing keypair in local storage.");
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

    if (route.query.data) {
      // console.log(router.query.solflare_encryption_public_key.toString())
      // console.log(router.query.data.toString())
      // console.log(router.query.nonce.toString())
      console.log(route.query);

      try {
        const sharedSecretDapp = nacl.box.before(
          bs58.decode(
            route.query["solflare_encryption_public_key"]!.toString()
          ),
          shouldDappKeyPair.secretKey // THIS FAILS IN PRIVATE TAB
        );

        const connectData = decryptPayload(
          route.query.data.toString(),
          route.query.nonce!.toString(),
          sharedSecretDapp
        );
        solflareWalletPublicKey.value = new PublicKey(connectData.public_key);
        console.log(`connected to ${connectData.public_key.toString()}`);

        // Save dappKeyPair in cookie
        Cookies.set("walletAddress", connectData.public_key.toString());
        // Direct to soaps
        router.push(queryParams.target!.toString() || "/");
      } catch (error) {
        console.log(
          "There was an error decrypting the connection data: ",
          error
        );
        // if it's going to mintooor, redirect to dealer
        const target: string = queryParams.target!.toString();
        if (target.indexOf("mintooor")) {
          console.log("it was going to mintooor");
          const targetSoap = target.substring(target.lastIndexOf("/") + 1);
          errorMessage.value = true;
          router.push(`/dealer/${targetSoap}`);
        }
      }
    } else {
      // Direct to auth if not called from deeplink redirect
      router.push("/mobile");
    }
  } else {
    // Can't find dapp keypair but has target, likely coming from in-app browser
    console.log("Couldn't find dappKeyPair in local cookie.");
    // if it's going to mintooor, redirect to dealer.
    // TODO: Make this more dynamic?
    console.log(route.query);
    window.open(`/dealer/${route.query.soapAddress}`);
    const target: string = queryParams.target!.toString();
    if (target.indexOf("mintooor")) {
      console.log("it was going to mintooor");
      const targetSoap = target.substring(target.lastIndexOf("/") + 1);
      errorMessage.value = true;
      router.push(`/dealer/${targetSoap}`);
    } else {
      // If all else fails
      router.push("/");
    }
  }
});
</script>

<template>
  <div className="px-5">
    <Head>
      <title>Connecting...</title>
      <meta name="description" content="Connecting to your wallet" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/favicon.ico" />
    </Head>
    <main>
      <div>
        <h4
          v-if="errorMessage"
          className="text-center font-bold text-2xl leading-6"
        >
          Opps, let&#39;s try again...
        </h4>
      </div>
    </main>
  </div>
</template>
