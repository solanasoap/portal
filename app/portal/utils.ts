import nacl from "tweetnacl";
import bs58 from "bs58";

export const decryptPayload = (
  data: string,
  nonce: string,
  sharedSecret?: Uint8Array
) => {
  if (!sharedSecret) throw new Error("missing shared secret");

  const decryptedData = nacl.box.open.after(
    bs58.decode(data),
    bs58.decode(nonce),
    sharedSecret
  );
  if (!decryptedData) {
    return null;
  }
  return JSON.parse(Buffer.from(decryptedData).toString("utf8"));
};
