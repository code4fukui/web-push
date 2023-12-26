import { Base64URL } from "https://js.sabae.cc/Base64URL.js";
import { Base16 } from "https://code4fukui.github.io/Base16/Base16.js";
//import elliptic from "npm:elliptic";
import EC from "../../elliptic/lib/elliptic/ec/index.js";
import { Buffer } from "https://taisukef.github.io/buffer/Buffer.js";
import crypto from "node:crypto";
import formatEcdsa from "https://code4fukui.github.io/node-ecdsa-sig-formatter/src/ecdsa-sig-formatter.js";

//const EC = elliptic.ec;
const ec = new EC('p256'); // p256 == prime256v1

const enc = (json) => new TextEncoder().encode(JSON.stringify(json));
const dec = (s) => new TextDecoder().decode(Base64URL.decode(s));

const b2s = (buf) => {
  if (typeof buf == "string") {
    return buf;
  }
  if (buf instanceof Uint8Array) {
    const s = new TextDecoder().decode(buf);
    console.log(s);
    return s;
  }
  console.log("AAA", typeof buf, buf)
  const s = new TextDecoder().decode(buf.toUint8Array());
  //const s = buf.toString();
  console.log("b2s", s);
  return s;
};

const hex2b64 = (hex) => Base64URL.encode(Base16.decode(hex));
const b642hex = (b64) => {
  if (b64 instanceof Uint8Array) {
    return Base16.encode(b64);
  }
  return Base16.encode(Base64URL.decode(b64));
};

function _sign(thing, secret) { // NG
  //return new Uint8Array(await crypto.subtle.digest('SHA-256', data));
  //checkIsSecretKey(secret);
  //thing = normalizeInput(thing);
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(thing);
  const sig = hmac.digest('base64url');
  //console.log("SIG", sig)
  return sig; //fromBase64(sig);
}
function _sign2(thing, privateKey) { // NG
    const signer = crypto.createSign('RSA-SHA256'); // Deno has panicked
    signer.update(thing)
    const sig = signer.sign(privateKey, 'base64');
    const signature = formatEcdsa.derToJose(sig, 'ES256');
    return signature;
}

export const genKeys = () => {
  const keys = ec.genKeyPair();
  const privateKey = hex2b64(keys.getPrivate("hex"));
  const publicKey = hex2b64(keys.getPublic().encode('hex'));
  return { publicKey, privateKey };
};

export const sign = ({ header, payload, privateKey }) => {
  const spayload = Base64URL.encode(enc(payload));
  const protect = Base64URL.encode(enc(header)); // { alg: "ES256" }
  //console.log({ protect, spayload });
  const message = new TextEncoder().encode(protect + "." + spayload);
  //const signature = Base64URL.encode(Ed25519.sign({ privateKey: privateKey, message, encoding: "binary" }));
  const privateKey2 = b642hex(privateKey); 
  const keys = ec.keyFromPrivate(privateKey2, "hex");
  
  //const sig = keys.sign(Base16.encode(message), "hex");
  //const sig = _sign2(message, Base16.decode(privateKey2));
  //const sig = _sign(message, Base16.decode(privateKey2));
  //const der = sig;

  const sig = keys.sign(message);
  //console.log(Base16.encode(message), privateKey2, sig); // , sig.toDER());
  const der = Base64URL.encode(sig.toDER());

  const jose = formatEcdsa.derToJose(der, 'ES256');
  //console.log("DER", der);
  //console.log("JOSE", jose);
  const signature = jose;
  //const signature = sig; //Base64URL.encode(sig);
  return protect + "." + spayload + "." + signature;
};

export const verify = (jwt, publicKey) => {
  const [sprotected, spayload, ssignature] = jwt.split(".");
  const payload = JSON.parse(dec(spayload));
  const protect = JSON.parse(dec(sprotected));
  if (protect.alg != "ES256") {
    throw new Error("unsupported alg:" + protect.alg);
  }

  // deno ok
  /*
  const jose = ssignature;
  const signature = formatEcdsa.joseToDer(jose, 'ES256');
  */
  //const signature = Base64URL.decode(ssignature); // NG
  //const signature = formatEcdsa.derToJose(ssignature, 'ES256'); // NG
  const signature = formatEcdsa.joseToDer(ssignature, 'ES256');
  
  //const message = new TextEncoder().encode(sprotected + "." + spayload);
  const message = new TextEncoder().encode(protect + "." + payload);
  //const message = sprotected + "." + spayload;
  console.log({ payload, protect, signature, message });
  //console.log(new TextDecoder().decode(message).split(".").map(i => new TextDecoder().decode(Base64URL.decode(i))));

  //const chk = Ed25519.verify({ signature, publicKey, message, encoding: "binary" });
  const keys = ec.keyFromPublic(b642hex(publicKey), "hex");
  console.log({ message, signature });
  const chk = keys.verify(Base16.encode(message), Base16.encode(signature));
  if (!chk) {
    throw new Error("can't verify");
  }
  return payload;
};

export const computeSecret = (privateKey, publicKey) => {
  const keys = ec.keyFromPrivate(b642hex(privateKey), "hex");
  const otherPub = ec.keyFromPublic(b642hex(publicKey), "hex").getPublic();
  const out = otherPub.mul(keys.getPrivate()).getX();
  return formatReturnValue(out, "hex"); // , ec.curveType.byteLength);
};

function formatReturnValue (bn, enc, len) {
  if (!Array.isArray(bn)) {
    bn = bn.toArray()
  }
  var buf = new Buffer(bn)
  if (len && buf.length < len) {
    var zeros = new Buffer(len - buf.length)
    zeros.fill(0)
    buf = Buffer.concat([zeros, buf])
  }
  if (!enc) {
    return buf
  } else {
    return buf.toString(enc)
  }
};
