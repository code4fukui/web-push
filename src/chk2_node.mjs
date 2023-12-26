import ellipticcurve from "starkbank-ecdsa";
var Ecdsa = ellipticcurve.Ecdsa;
var PrivateKey = ellipticcurve.PrivateKey;
var Signature = ellipticcurve.Signature;
import formatEcdsa from "ecdsa-sig-formatter";
import { toPEM } from "./toPEM.mjs";

//import { Base64URL } from "https://js.sabae.cc/Base64URL.js";
//import * as JWS from "./JWS_prime256v1.js";
//import { toPEM, toPEMPub } from "./toPEM.mjs";

const publicKey = "BAnjUlDKJRB5GGE_kVbXlH7WB66cVS_mMGhbDpLwwb8VPYujtgxfrzBcPKlsQr0v2-ckYwy0gIfXUNUWzL451Hs";
const privateKey = "XrM3elAzmPJAZuKgbmel2fr-ZIZCMEMhmJHfA5aFZZw";

// deno
//const jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJodHRwczovL3dlYi5wdXNoLmFwcGxlLmNvbSIsImV4cCI6MTcwMzYyNDQ2MCwic3ViIjoibWFpbHRvOmZ1a3Vub0BqaWcuanAifQ.xtMUJydQKTgJB2ByZjNUoA8DQ0tyQ2evg0FowQsEhKWmsrGYdQ_4yOzwQWwgICSeircyVc1AeGNGOFKZRC5vXw";
//const jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJodHRwczovL3dlYi5wdXNoLmFwcGxlLmNvbSIsImV4cCI6MTcwMzYyNTIwOSwic3ViIjoibWFpbHRvOmZ1a3Vub0BqaWcuanAifQ.MEUCIQCoVzRqNSUazjeTU3aHpkki8gKAJSnFjTgfwodJXGiDRQIgON2-ydRE3ZM5aDi7C3Dmmi9oxaJmgreRBwqe_Vcmmfc";
//const jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJodHRwczovL3dlYi5wdXNoLmFwcGxlLmNvbSIsImV4cCI6MTcwMzYzMzg4Nywic3ViIjoibWFpbHRvOmZ1a3Vub0BqaWcuanAifQ.MEUCIQCoVzRqNSUazjeTU3aHpkki8gKAJSnFjTgfwodJXGiDRQIgON2-ydRE3ZM5aDi7C3Dmmi9oxaJmgreRBwqe_Vcmmfc";
//const jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJodHRwczovL3dlYi5wdXNoLmFwcGxlLmNvbSIsImV4cCI6MTcwMzY1ODYzMiwic3ViIjoibWFpbHRvOmZ1a3Vub0BqaWcuanAifQ.qFc0ajUlGs43k1N2h6ZJIvICgCUpxY04H8KHSVxog0U43b7J1ETdkzloOLsLcOaaL2jFomaCt5EHCp79VyaZ9w";
// node
//const jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJodHRwczovL3dlYi5wdXNoLmFwcGxlLmNvbSIsImV4cCI6MTcwMzYyNDU1Niwic3ViIjoibWFpbHRvOmZ1a3Vub0BqaWcuanAifQ.MEUCIQCoVzRqNSUazjeTU3aHpkki8gKAJSnFjTgfwodJXGiDRQIgON2-ydRE3ZM5aDi7C3Dmmi9oxaJmgreRBwqe_Vcmmfc";
//const jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJodHRwczovL3dlYi5wdXNoLmFwcGxlLmNvbSIsImV4cCI6MTcwMzY1MTEzNCwic3ViIjoibWFpbHRvOmZ1a3Vub0BqaWcuanAifQ.qFc0ajUlGs43k1N2h6ZJIvICgCUpxY04H8KHSVxog0U43b7J1ETdkzloOLsLcOaaL2jFomaCt5EHCp79VyaZ9w";
//const jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJodHRwczovL3dlYi5wdXNoLmFwcGxlLmNvbSIsImV4cCI6MTcwMzY1Nzc2Niwic3ViIjoibWFpbHRvOmZ1a3Vub0BqaWcuanAifQ.OkB0u4648Q8UGsCKZjWGz7_LySsMAmLTdLrE9Om75V1BPLMfEaeuU9zfc1tCryh2sxLETKXiPyoJPPOtZqkbYA";
const jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJodHRwczovL3dlYi5wdXNoLmFwcGxlLmNvbSIsImV4cCI6MTcwMzY1ODc0NCwic3ViIjoibWFpbHRvOmZ1a3Vub0BqaWcuanAifQ.GJPxtkFfBkAaPx1TqRRAq7yJ9NL5gIrSOMU5uPFq5c3GAJpXVqBMr4K_v2zL6nDRx8d8-V4FrFKN6lksikE1ag";

/*
const header = {
  typ: 'JWT',
  alg: 'ES256'
};
const payload = {
  aud: "https://web.push.apple.com",
  exp: 1703525598,
  sub: "mailto:fukuno@jig.jp",
};

const jwt0 = JWS.sign({ header, payload, privateKey: toPEM(Buffer.from(privateKey, 'base64url')) });
console.log("sign", jwt0);
const ss = jwt0.split(".");
console.log(Buffer.from(ss[2], "base64url").toString("hex;"))

//console.log(JWS.verify(jwt0, "ES256", toPEMPub(Buffer.from(publicKey, "base64url"))))


signature = Ecdsa.sign(message, privateKey);

// Generate Signature in base64. This result can be sent to Stark Bank in header as Digital-Signature parameter
console.log(signature.toBase64());
console.log(signature.toDer());
console.log(signature.toDer().length);

// To double check if message matches the signature
let publicKey = privateKey.publicKey();
*/
const ss = jwt.split(".");
const header = ss[0];
const body = ss[1];
const signature = ss[2];
//const signature = "qFc0ajUlGs43k1N2h6ZJIvICgCUpxY04H8KHSVxog0U43b7J1ETdkzloOLsLcOaaL2jFomaCt5EHCp79VyaZ9w";
console.log(signature);
// MEUCIQCoVzRqNSUazjeTU3aHpkki8gKAJSnFjTgfwodJXGiDRQIgON2-ydRE3ZM5aDi7C3Dmmi9oxaJmgreRBwqe_Vcmmfc

// Generate privateKey from PEM string
const pem = toPEM(privateKey);
console.log(pem);
const privateKey2 = PrivateKey.fromPem(pem);
const publicKey2 = privateKey2.publicKey();
console.log("der", publicKey2.toString(), "pub", publicKey)
//const message = header + "." + body;
//const message = Buffer.from(new TextEncoder().encode(header + "." + body)).toString("hex");
const message = new TextEncoder().encode(header + "." + body);
console.log("message", message);
//const sig = Buffer.from(signature, "base64url");
const der = formatEcdsa.joseToDer(signature, "ES256").toString("base64url");
console.log("DER", der)
const sig = Signature.fromBase64(der);
console.log(sig);
console.log(Ecdsa.verify(message, sig, publicKey2));


const signature2 = Ecdsa.sign(message, privateKey2, null, 0);
console.log(signature2.toBase64());

console.log(Ecdsa.verify(message, signature2, publicKey2));
