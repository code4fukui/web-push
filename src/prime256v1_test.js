import elliptic from "npm:elliptic";

const EC = elliptic.ec;
const ec = new EC('p256'); // p256 == prime256v1

// gen keypair
const keys = ec.genKeyPair();
//console.log(keys);
const privateKey = keys.getPrivate("hex");
const publicKey = keys.getPublic().encode('hex');
console.log({ publicKey, privateKey });

// ECDSA sign
const msg = "abc"
const signature = keys.sign(msg, "hex", { privateKey });
const sign = new Uint8Array(signature.toDER());
console.log(sign);
//sign[0]++; // check

// ECDSA verify
const keys2 = ec.keyFromPublic(publicKey, "hex");
const b = keys2.verify(msg, sign);
console.log(b);
