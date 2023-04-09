# SOAP🧼
Soap is a cutting-edge token dispenser built on Solana that simplifies the creation and distribution of digital collectibles. It allows event organizers to issue attendance tokens, airdrop aftermovies, and send invitations for future events. For Spaces enthusiasts, it enables the distribution of Soaps for each space, while rewarding loyal fans with airdrops and exclusive content.

## Local development
### Setup
1. Create a new keypair locally using `solana-keygen new -o soapkeypair.json`. 
2. Open the `soapkeypair.json` file, and copy its contents `[18,223,250,12...]`.
3. Open your desktop wallet, and import this private key.
4. Go to [Shadow Storage](https://shadow.storage) and create a new space using the `soapkeypair` wallet. Copy the space's address.

### Run
1. Clone the repo, open in your editor
2. Rename `.env.local.example` to `.env.local`, and open it.
3. Adjust all values to your setup, and save the file.
    - `SOAP_KEYPAIR` is `soapkeypair.json`
    - `API_KEY` is not needed in case the public mainnet-beta RPC is used.
4. Search for and replace all mentions of `aquaZKhcuUU1KetKdzNzumpbzEvcyHMqbkyysnMjMWr` to your `soapkeypair.json` pubkey.
5. Run `yarn dev`, and you'll be able to create soaps on your own.

### Mintor portal
To customize the mintor portal (`/dealer`), you need to deploy your own version of the soap program. The program deployed at `soap4c4g3L9vQUQYSCJxhTbHdJYSiX3aZPzPGnp2CoN` only accepts `mintTo` transactions from `aquaZKhcuUU1KetKdzNzumpbzEvcyHMqbkyysnMjMWr`, which is the keypair running on the deployed backend. See the constraint at `/programs/src/constants.rs`.

5. Run `anchor build`, followed by `anchor keys list` to get your program's pubkey. Search and replace all `soap4c4g3L9vQUQYSCJxhTbHdJYSiX3aZPzPGnp2CoN` to your program's ID.
6. Run `anchor deploy` (deployment costs ~4.8 SOL)
7. Run `yarn solita` to generate the Solita SDK with the new program ID
8. Execute `yarn dev` to run the frontend.


# Next.JS Original docs

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
