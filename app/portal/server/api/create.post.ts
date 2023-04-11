// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  keypairIdentity,
  Metaplex,
  KeypairSigner,
  CreateSftInput,
  CreatorInput,
  JsonMetadata,
  MetaplexFile,
  toMetaplexFile,
} from "@metaplex-foundation/js";
import {
  Keypair,
  Connection,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import axios from "axios";
import { connection } from "~/contants";
import { Buffer } from "buffer";

const clusterString = "mainnet-beta";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  // Load a local keypair.
  const keypair = Keypair.fromSecretKey(
    Buffer.from(JSON.parse(config.soapKeypair))
  );

  const metaplex = Metaplex.make(connection).use(keypairIdentity(keypair));
  console.log(
    "Public key of keypair being used: ",
    keypair.publicKey.toBase58()
  );
  const start = Date.now();

  if (body.secret !== process.env.NEXT_PUBLIC_API_SECRET) {
    throw createError({
      statusCode: 418,
      statusMessage: "Unauthorized",
    });
  }

  console.log("CREATING SFT\n");

  // Create keypair to add as first verified creator
  const randomCreatorKeypair = Keypair.generate();
  const randomCreatorKeypairSigner: KeypairSigner = {
    publicKey: randomCreatorKeypair.publicKey,
    secretKey: randomCreatorKeypair.secretKey,
  };

  // Assemble verified creators object
  const soapCreator: CreatorInput[] = [
    {
      // main soap creator
      address: metaplex.identity().publicKey,
      share: 100,
    },
  ];

  // Create collection signer object
  const collectionSigner: KeypairSigner = {
    publicKey: metaplex.identity().publicKey,
    secretKey: metaplex.identity().secretKey!,
  };

  // Get from URL and upload jpeg to ARWeave
  const response = await axios.get(body.imageUrl, {
    responseType: "arraybuffer",
  });
  const buffer = Buffer.from(response.data);

  const imageFile: MetaplexFile = toMetaplexFile(buffer, "soap.jpg");
  const imageUrl: string = await metaplex.storage().upload(imageFile);
  console.log("Image URL on ARweave: ", imageUrl);

  // NFT Metadata
  const jsonMetadata: JsonMetadata = {
    //FIXME Get data from json request
    name: body.name,
    symbol: "SOAP",
    description: body.description,
    seller_fee_basis_points: 10000,
    image: imageUrl,
    external_url: body.external_url,
    attributes: body.attributes,
    properties: {
      creators: [
        {
          // main soap creator
          address: metaplex.identity().publicKey.toBase58(),
          share: 100,
        },
      ],
      category: "image",
    },
    collection: {
      name: "SOAP",
      family: "SOAP",
    },
  };

  const { uri } = await metaplex.nfts().uploadMetadata(jsonMetadata);

  console.log("URI of SFT metadata", uri);

  // Create CreateSftInput object
  const createSftInput: CreateSftInput = {
    tokenOwner: metaplex.identity().publicKey,
    // tokenAmount: ({basisPoints: 10, currency: null}),
    uri: uri,
    name: jsonMetadata.name!,
    sellerFeeBasisPoints: jsonMetadata.seller_fee_basis_points!,
    symbol: jsonMetadata.symbol,
    creators: soapCreator,
    isCollection: true,
    collection: new PublicKey("9McAofPndtizYttpcdPD4EnQniJZdCG7o6usF2d4JPDV"),
    collectionAuthority: collectionSigner,
    collectionIsSized: false,
  };

  // Create SFT

  const sft = await metaplex.nfts().createSft(createSftInput);
  console.log("SFT Mint Address: ", sft.mintAddress.toBase58());
  const tx_url =
    "SFT Mint: " +
    "https://solscan.io/token/" +
    sft.mintAddress.toBase58() +
    "?cluster=" +
    clusterString;
  console.log("TX URL: ", tx_url);

  const end = Date.now();
  console.log(`Execution time: ${end - start} ms\n`);

  return {
    result: "created",
    sft_address: sft.mintAddress.toBase58(),
    tx: tx_url,
  };
});
