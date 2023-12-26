//import { JWS } from "https://github.com/code4fukui/JWS/blob/main/JWS.js";
import * as crypto from "https://code4fukui.github.io/encrypted-content-encoding/denojs/crypto_node.js"
import { Buffer } from "https://taisukef.github.io/buffer/Buffer.js";
import { toUint8Array } from "./toUint8Array.js";
import * as JWS from "./JWS.js";
import fs from "node:fs";

/*
import jws from 'jws';
import crypto from 'crypto';
import asn1 from 'asn1.js';
*/

/*
eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJodHRwczovL3dlYi5wdXNoLmFwcGxlLmNvbSIsImV4cCI6MTcwMzUyNTU5OCwic3ViIjoibWFpbHRvOmZ1a3Vub0BqaWcuanAifQ.iJK1bOikO9-MAcPHb-eRILFzbYdSs4Zc2KEOlDEN7sdj0u0Ha1T62w6XHYuKCYFP1cSpdQXa51hh7xgUyP3Snw

eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJodHRwczovL3dlYi5wdXNoLmFwcGxlLmNvbSIsImV4cCI6MTcwMzUyNTU5OCwic3ViIjoibWFpbHRvOmZ1a3Vub0BqaWcuanAifQ.NYCgIo2_xK7AMHt8j1sI2FcAEKx5H7P2J9eC9284SgGqFDBRrNpGSEHcjRzonSJ-omEE9SpC8ti8VME-Ur-y-A  
*/


function generateVAPIDKeys() {
  
  // secp521r1;secp384r1;prime256v1;secp256k1;secp224r1;secp224k1;prime192v1
  const curve = crypto.createECDH('prime256v1'); // -> 65byte, 32byte
  //const curve = crypto.createECDH('secp521r1'); // invalid curve
  //const curve = crypto.createECDH('secp256k1'); // NISP P-256 (RPC4492)? Deno has panicked. // secp256k1 32byte, 32byte? Koblitz曲線 prime256v1とは別物
  //const curve = crypto.createECDH('secp224r1'); // 57byte, 28byte
  curve.generateKeys();

  let publicKeyBuffer = curve.getPublicKey(); // 65byte
  let privateKeyBuffer = curve.getPrivateKey(); // 32byte
  console.log("pub", toUint8Array(publicKeyBuffer), "pri", toUint8Array(privateKeyBuffer));

  // Occassionally the keys will not be padded to the correct lengh resulting
  // in errors, hence this padding.
  // See https://github.com/web-push-libs/web-push/issues/295 for history.
  if (privateKeyBuffer.length < 32) {
    const padding = Buffer.alloc(32 - privateKeyBuffer.length);
    padding.fill(0);
    privateKeyBuffer = Buffer.concat([padding, privateKeyBuffer]);
  }

  if (publicKeyBuffer.length < 65) {
    const padding = Buffer.alloc(65 - publicKeyBuffer.length);
    padding.fill(0);
    console.log(publicKeyBuffer)
    publicKeyBuffer = Buffer.concat([padding, publicKeyBuffer]);
    console.log(publicKeyBuffer)
  }

  return {
    publicKey: toUint8Array(publicKeyBuffer),
    privateKey: toUint8Array(privateKeyBuffer),
  };
}


function getFutureExpirationTimestamp(numSeconds) {
  const futureExp = new Date();
  futureExp.setSeconds(futureExp.getSeconds() + numSeconds);
  return Math.floor(futureExp.getTime() / 1000);
}

const getKeys = () => {
  try {
    throw new Error();
    const keys = JSON.parse(fs.readFileSync("vapidKeys.json", "utf-8"));
    keys.privateKey = toUint8Array(Buffer.from(keys.privateKey, "base64url"));
    keys.publicKey = toUint8Array(Buffer.from(keys.publicKey, "base64url"));
    return keys;
  } catch (e) {
    const keys = generateVAPIDKeys();
    return keys;    
  }
};

const keys = getKeys();

const privateKey = keys.privateKey;

const header = {
  typ: 'JWT',
  alg: 'ES256'
};

const DEFAULT_EXPIRATION_SECONDS = 12 * 60 * 60;
const expiration = 1703525598; // getFutureExpirationTimestamp(DEFAULT_EXPIRATION_SECONDS);

const audience = "https://web.push.apple.com";
const subject = "mailto:fukuno@jig.jp";

const jwtPayload = {
  aud: audience,
  exp: expiration,
  sub: subject
};

//privateKey = Buffer.from(privateKey, 'base64url');

console.log(header, jwtPayload, privateKey);
/*
const jwt = jws.sign({
  header: header,
  payload: jwtPayload,
  privateKey: toPEM(privateKey)
});
*/
const jwt = JWS.sign({ header, payload: jwtPayload, privateKey });
console.log(jwt);

const res = JWS.verify({ jwt, publicKey: keys.publicKey });
console.log(res);

/*
  console.log("jwt", header, jwtPayload, privateKey, jwt)
jwt { typ: 'JWT', alg: 'ES256' } {
  aud: 'https://web.push.apple.com',
  exp: 1703525598,
  sub: 'mailto:fukuno@jig.jp'
}
privatekey <Buffer 5e b3 37 7a 50 33 98 f2 40 66 e2 a0 6e 67 a5 d9 fa fe 64 86 42 30 43 21 98 91 df 03 96 85 65 9c>
jwt
 eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJodHRwczovL3dlYi5wdXNoLmFwcGxlLmNvbSIsImV4cCI6MTcwMzUyNTU5OCwic3ViIjoibWFpbHRvOmZ1a3Vub0BqaWcuanAifQ.iJK1bOikO9-MAcPHb-eRILFzbYdSs4Zc2KEOlDEN7sdj0u0Ha1T62w6XHYuKCYFP1cSpdQXa51hh7xgUyP3Snw
jwt 
{"statusCode":201,"body":"","headers":{"content-type":"text/plain; charset=UTF-8","content-length":"0","apns-id":"A1DE868A-374F-7E04-D0A2-06A719464A19"}}

*/
