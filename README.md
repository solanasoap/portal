# SOAP🧼
Soap is a cutting-edge token dispenser built on Solana that simplifies the creation and distribution of digital collectibles. It allows event organizers to issue attendance tokens, airdrop aftermovies, and send invitations for future events. For Spaces enthusiasts, it enables the distribution of Soaps for each space, while rewarding loyal fans with airdrops and exclusive content.

## Mobile first
A key innovation of Soap is its mobile-first approach. The portal is designed to work seamlessly with mobile browsers, allowing users to connect their Phantom or Solflare wallets easily. It's buttery smooth.

![deeplink_demo](/static/deeplink_demo.gif)

## Creator Portal
The Soap Creator Portal, developed for the Grizzlython Hackathon, enables users to easily create and distribute their own Soaps. Users simply upload an image, name their Soap, and generate it with a single click. To cover minting costs, they can then add funds to a Pot. Each Soap redemption costs 0.0021 SOL, so 100 Soaps would amount to 0.21 SOL. While this method isn't as cost-effective as compression, it is well-suited for the current use case since wallet support for compression is lacking. However, a transition to compression can be made once wallet support becomes available.

### Soap Program
The Soap Program manages the creation, minting, and funding of Soaps using the address soap4c4g3L9vQUQYSCJxhTbHdJYSiX3aZPzPGnp2CoN. It works in conjunction with the Metaplex token metadata program to produce SFTs. The program heavily relies on Program Derived Accounts (PDAs) since Pots are PDAs themselves. Each Soap has its own Pot, which serves as both the rent payer and mint authority. The entire process is open-source and accessible to all users.


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
