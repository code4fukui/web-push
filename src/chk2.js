import { Base64URL } from "https://js.sabae.cc/Base64URL.js";
import { Base16 } from "https://code4fukui.github.io/Base16/Base16.js";
//import * as JWS from "./JWS_prime256v1.js";
import JWS from "../../node-jws/index.js";
import { toPEM, toPEMPub } from "./toPEM.mjs";
import { Buffer } from "https://taisukef.github.io/buffer/Buffer.js";

const publicKey = "BAnjUlDKJRB5GGE_kVbXlH7WB66cVS_mMGhbDpLwwb8VPYujtgxfrzBcPKlsQr0v2-ckYwy0gIfXUNUWzL451Hs";
const privateKey = "XrM3elAzmPJAZuKgbmel2fr-ZIZCMEMhmJHfA5aFZZw";

//const s = "eyJhdWQiOiJodHRwczovL3dlYi5wdXNoLmFwcGxlLmNvbSIsImV4cCI6MTcwMzYyNDU1Niwic3ViIjoibWFpbHRvOmZ1a3Vub0BqaWcuanAifQ";
const s = "eyJhdWQiOiJodHRwczovL3dlYi5wdXNoLmFwcGxlLmNvbSIsImV4cCI6MTcwMzYzMDkwNCwic3ViIjoibWFpbHRvOmZ1a3Vub0BqaWcuanAifQ";
console.log(new TextDecoder().decode(Base64URL.decode(s)));

const header = {
  typ: 'JWT',
  alg: 'ES256'
};
const payload = {
  aud: "https://web.push.apple.com",
  exp: 1703525598,
  sub: "mailto:fukuno@jig.jp",
};

const jwt0 = JWS.sign({ header, payload, privateKey: toPEM(Buffer.from(privateKey, "base64url")) });
//const jwt0 = JWS.sign({ header, payload, privateKey: Base16.encode(Base64URL.decode(privateKey)) });
console.log("sign", jwt0);

console.log(JWS.verify(jwt0, publicKey))

// deno
//const jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJodHRwczovL3dlYi5wdXNoLmFwcGxlLmNvbSIsImV4cCI6MTcwMzYyNDQ2MCwic3ViIjoibWFpbHRvOmZ1a3Vub0BqaWcuanAifQ.xtMUJydQKTgJB2ByZjNUoA8DQ0tyQ2evg0FowQsEhKWmsrGYdQ_4yOzwQWwgICSeircyVc1AeGNGOFKZRC5vXw";
//const jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJodHRwczovL3dlYi5wdXNoLmFwcGxlLmNvbSIsImV4cCI6MTcwMzYyNTIwOSwic3ViIjoibWFpbHRvOmZ1a3Vub0BqaWcuanAifQ.MEUCIQCoVzRqNSUazjeTU3aHpkki8gKAJSnFjTgfwodJXGiDRQIgON2-ydRE3ZM5aDi7C3Dmmi9oxaJmgreRBwqe_Vcmmfc";
const jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJodHRwczovL3dlYi5wdXNoLmFwcGxlLmNvbSIsImV4cCI6MTcwMzYzMzg4Nywic3ViIjoibWFpbHRvOmZ1a3Vub0BqaWcuanAifQ.MEUCIQCoVzRqNSUazjeTU3aHpkki8gKAJSnFjTgfwodJXGiDRQIgON2-ydRE3ZM5aDi7C3Dmmi9oxaJmgreRBwqe_Vcmmfc";
// node
//const jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJodHRwczovL3dlYi5wdXNoLmFwcGxlLmNvbSIsImV4cCI6MTcwMzYyNDU1Niwic3ViIjoibWFpbHRvOmZ1a3Vub0BqaWcuanAifQ.MEUCIQCoVzRqNSUazjeTU3aHpkki8gKAJSnFjTgfwodJXGiDRQIgON2-ydRE3ZM5aDi7C3Dmmi9oxaJmgreRBwqe_Vcmmfc";
//console.log(JWS.verify(jwt, publicKey));

// node ok! -> but can't verify
const jwt_node1 = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJodHRwczovL3dlYi5wdXNoLmFwcGxlLmNvbSIsImV4cCI6MTcwMzUyNTU5OCwic3ViIjoibWFpbHRvOmZ1a3Vub0BqaWcuanAifQ.X51ISoXLk1BbNNMUw1UdU1WfjadtOo8QHWilf57Rv2c0xalxYKEuA1RQuXlSa4Lht7MsFRR9M2Ljn5R2TIHUWA";
//console.log("jwt_node", JWS.verify(jwt_node, publicKey))

// deno ng
const jwt_deno1 = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJodHRwczovL3dlYi5wdXNoLmFwcGxlLmNvbSIsImV4cCI6MTcwMzUyNTU5OCwic3ViIjoibWFpbHRvOmZ1a3Vub0BqaWcuanAifQ.MEUCIQCoVzRqNSUazjeTU3aHpkki8gKAJSnFjTgfwodJXGiDRQIgON2-ydRE3ZM5aDi7C3Dmmi9oxaJmgreRBwqe_Vcmmfc";
//console.log("jwt_deno", JWS.verify(jwt_deno, publicKey))
const jwt_deno2 = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJodHRwczovL3dlYi5wdXNoLmFwcGxlLmNvbSIsImV4cCI6MTcwMzUyNTU5OCwic3ViIjoibWFpbHRvOmZ1a3Vub0BqaWcuanAifQ.9_bTBYAPkTx0_PhS4ZZqLJsT9yMPyT1-Thb2klJipnc";
