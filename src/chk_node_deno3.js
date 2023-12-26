//import JWS from "../../node-jws/index.js";
//import * as JWS from "./JWS_prime256v1.js";
import { toPEM, toPEMPub } from "./toPEM.mjs";
import { Buffer } from "https://taisukef.github.io/buffer/Buffer.js";
import { Base64URL } from "https://js.sabae.cc/Base64URL.js";
import * as JWS from "./JWS_crypto_ec.js";

const publicKey = "BAnjUlDKJRB5GGE_kVbXlH7WB66cVS_mMGhbDpLwwb8VPYujtgxfrzBcPKlsQr0v2-ckYwy0gIfXUNUWzL451Hs";
const privateKey = "XrM3elAzmPJAZuKgbmel2fr-ZIZCMEMhmJHfA5aFZZw";

// deno
//const jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJodHRwczovL3dlYi5wdXNoLmFwcGxlLmNvbSIsImV4cCI6MTcwMzYyNDQ2MCwic3ViIjoibWFpbHRvOmZ1a3Vub0BqaWcuanAifQ.xtMUJydQKTgJB2ByZjNUoA8DQ0tyQ2evg0FowQsEhKWmsrGYdQ_4yOzwQWwgICSeircyVc1AeGNGOFKZRC5vXw";
//const jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJodHRwczovL3dlYi5wdXNoLmFwcGxlLmNvbSIsImV4cCI6MTcwMzYyNTIwOSwic3ViIjoibWFpbHRvOmZ1a3Vub0BqaWcuanAifQ.MEUCIQCoVzRqNSUazjeTU3aHpkki8gKAJSnFjTgfwodJXGiDRQIgON2-ydRE3ZM5aDi7C3Dmmi9oxaJmgreRBwqe_Vcmmfc";
//const jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJodHRwczovL3dlYi5wdXNoLmFwcGxlLmNvbSIsImV4cCI6MTcwMzYzMzg4Nywic3ViIjoibWFpbHRvOmZ1a3Vub0BqaWcuanAifQ.MEUCIQCoVzRqNSUazjeTU3aHpkki8gKAJSnFjTgfwodJXGiDRQIgON2-ydRE3ZM5aDi7C3Dmmi9oxaJmgreRBwqe_Vcmmfc";
//const jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJodHRwczovL3dlYi5wdXNoLmFwcGxlLmNvbSIsImV4cCI6MTcwMzY2MDAwMiwic3ViIjoibWFpbHRvOmZ1a3Vub0BqaWcuanAifQ.qFc0ajUlGs43k1N2h6ZJIvICgCUpxY04H8KHSVxog0U43b7J1ETdkzloOLsLcOaaL2jFomaCt5EHCp79VyaZ9w";
// node
//const jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJodHRwczovL3dlYi5wdXNoLmFwcGxlLmNvbSIsImV4cCI6MTcwMzYyNDU1Niwic3ViIjoibWFpbHRvOmZ1a3Vub0BqaWcuanAifQ.MEUCIQCoVzRqNSUazjeTU3aHpkki8gKAJSnFjTgfwodJXGiDRQIgON2-ydRE3ZM5aDi7C3Dmmi9oxaJmgreRBwqe_Vcmmfc";
//const jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJodHRwczovL3dlYi5wdXNoLmFwcGxlLmNvbSIsImV4cCI6MTcwMzY1ODc0NCwic3ViIjoibWFpbHRvOmZ1a3Vub0BqaWcuanAifQ.GJPxtkFfBkAaPx1TqRRAq7yJ9NL5gIrSOMU5uPFq5c3GAJpXVqBMr4K_v2zL6nDRx8d8-V4FrFKN6lksikE1ag";
const jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJodHRwczovL3dlYi5wdXNoLmFwcGxlLmNvbSIsImV4cCI6MTcwMzY2MDA5Miwic3ViIjoibWFpbHRvOmZ1a3Vub0BqaWcuanAifQ.JkBRg2JloXALkDzK8ojP-_tr-4Oa_9m8W2lP4aoJd9Y4ETYruewmlJFDX3Qpit4mVCqmXyDZ5uACvHtJP5zGlA";

//console.log(JWS.verify({ jwt, publicKey }));

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
//const jwt0 = JWS.sign({ header, payload, privateKey: toPEM(Buffer.from(privateKey, 'base64url')) });
const jwt0 = JWS.sign({ header, payload, privateKey });
console.log("sign", jwt0);
const ss = jwt0.split(".");
console.log(Buffer.from(ss[2], "base64url").toString("hex"))
*/
{
  const ss = jwt.split(".");
  const header = JSON.parse(Buffer.from(ss[0], "base64url").toString());
  const payload = JSON.parse(Buffer.from(ss[1], "base64url").toString());
  const sig = ss[2];
  const jwt1 = await JWS.sign({ header, payload, privateKey, publicKey });
  const ss2 = jwt1.split(".");
  const sig2 = ss2[2]; //Buffer.from(ss[2], "base64url");
  console.log(sig2);
  console.log(sig);
  console.log(sig2 == sig);
  //console.log(header + "." + payload + "." + )
}


//console.log(JWS.verify(jwt0, "ES256", toPEMPub(Buffer.from(publicKey, "base64url"))))

