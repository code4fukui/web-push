import { Base64URL } from "https://js.sabae.cc/Base64URL.js";
import Ed25519 from "https://taisukef.github.io/forge-es/lib/ed25519.js";

// from https://github.com/code4fukui/JWS/blob/main/JWS.js

const enc = (json) => new TextEncoder().encode(JSON.stringify(json));
const dec = (s) => new TextDecoder().decode(Base64URL.decode(s));

export const getKeys = () => {
  const keys = Ed25519.generateKeyPair();
  return keys;
};

export const sign = (options) => {
  const { header, payload, privateKey } = options;
  console.log("sign", header, payload, privateKey)
  const spayload = Base64URL.encode(enc(payload));
  const protect = Base64URL.encode(enc(header)); // { alg: "ES256" }
  const message = new TextEncoder().encode(protect + "." + spayload);
  const signature = Base64URL.encode(Ed25519.sign({ privateKey: privateKey, message, encoding: "binary" }));
  return protect + "." + spayload + "." + signature;
};

export const verify = (options) => {
  const { jwt, publicKey } = options;
  const [sprotected, spayload, ssignature] = jwt.split(".");
  const payload = JSON.parse(dec(spayload));
  const protect = JSON.parse(dec(sprotected));
  if (protect.alg != "ES256") {
    throw new Error("unsupported alg:" + protect.alg);
  }
  const signature = Base64URL.decode(ssignature);
  const message = sprotected + "." + spayload;
  //console.log({ header, payload, protect, signature, message });
  
  const chk = Ed25519.verify({ signature, publicKey, message, encoding: "binary" });
  if (!chk) {
    throw new Error("can't verify");
  }
  return payload;
};