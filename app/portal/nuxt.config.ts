export default defineNuxtConfig({
  builder: "vite",
  ssr: true,
  modules: ["@nuxtjs/tailwindcss"],
  css: [
    "~/assets/css/main.css",
    "vue-toast-notification/dist/theme-default.css",
  ],
  tailwindcss: {
    configPath: "./tailwind.config.cjs",
  },
  app: {
    head: {
      script: [
        {
          children: `window.global = window;`,
        },
      ],
    },
  },
  runtimeConfig: {
    soapKeypair: process.env.SOAP_KEYPAIR,
    public: {
      apiSecret: process.env.API_SECRET,
      rpcEndpoint: process.env.RPC_ENDPOINT,
      heliusApiKey: process.env.HELIUS_API_KEY,
      shadowSoapBucket: process.env.PUBLIC_SHDW_SOAP_BUCKET,
      soapPubkey: process.env.SOAP_PUBKEY,
      baseUrl: process.env.BASE_URL,
    },
  },

  typescript: {
    tsConfig: {
      esModuleInterop: true,
    },
  },
  vite: {
    esbuild: {
      target: "esnext",
    },
    build: {
      target: "esnext",
    },
    optimizeDeps: {
      include: ["@project-serum/anchor", "@solana/web3.js", "buffer"],
      esbuildOptions: {
        target: "esnext",
      },
    },
    define: {
      "process.env.BROWSER": true,
      "process.env.NODE_DEBUG": JSON.stringify(""),
    },
    resolve: {
      alias: {
        stream: "stream-browserify",
        crypto: "crypto-browserify",
        assert: "assert",
        http: "stream-http",
        https: "https-browserify",
        url: "url",
      },
    },
  },
});
