import { Metaplex } from "@metaplex-foundation/js";
import { Connection } from "@solana/web3.js";

export const connection = new Connection(
  "https://rpc.helius.xyz/?api-key=c977f917-c416-4986-8045-463b1364224b",
  "processed"
);

export const metaplex = new Metaplex(connection);
