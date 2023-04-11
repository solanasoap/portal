import { Buffer } from "buffer";

export default defineNuxtPlugin((nuxt) => {
  window.Buffer = window.Buffer || Buffer;
});
