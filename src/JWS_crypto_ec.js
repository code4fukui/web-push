import { Base64URL } from "https://js.sabae.cc/Base64URL.js";

export const sign = async ({ header, payload, publicKey, privateKey }) => {
  const enc = (json) => new TextEncoder().encode(JSON.stringify(json));
  const message = Base64URL.encode(enc(header)) + "." + Base64URL.encode(enc(payload));
  console.log(message);
  const publicKeyBin = Base64URL.decode(publicKey);

  const key0 = {
    kty: 'EC',
    crv: 'P-256',
    x: Base64URL.encode(publicKeyBin.subarray(1, 33)),
    y: Base64URL.encode(publicKeyBin.subarray(33, 65)),
    d: privateKey,
  };

  const key = await crypto.subtle.importKey('jwk', key0, {
    name: 'ECDSA', namedCurve: 'P-256',
  }, true, ['sign']);

  const signature = await crypto.subtle.sign({
      name: 'ECDSA',
      hash: {
        name: 'SHA-256',
      },
    }, key, new TextEncoder().encode(message));
  
  return message + "." + Base64URL.encode(new Uint8Array(signature));
};
