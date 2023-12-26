import { Base64URL } from "https://js.sabae.cc/Base64URL.js";
import * as JWS from "./JWS_prime256v1.js";

const keys1 = JWS.genKeys();
const keys2 = JWS.genKeys();

const share1 = JWS.computeSecret({ publicKey: keys2.publicKey, privateKey: keys1.privateKey });
const share2 = JWS.computeSecret({ publicKey: keys1.publicKey, privateKey: keys2.privateKey });
console.log(share1 == share2);
console.log(share1);
console.log(share2);
