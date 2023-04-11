import { useToast } from "vue-toast-notification";

export default defineNuxtPlugin((nuxt) => {
  const toast = useToast();
  return {
    provide: {
      toast,
    },
  };
});
