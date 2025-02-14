const crypto = require('crypto');
const asn1 = require('asn1.js');
const jws = require('jws');
const fs = require("fs");

/*
import jws from 'jws';
import crypto from 'crypto';
import asn1 from 'asn1.js';
*/

const ECPrivateKeyASN = asn1.define('ECPrivateKey', function() {
  this.seq().obj(
    this.key('version').int(),
    this.key('privateKey').octstr(),
    this.key('parameters').explicit(0).objid()
      .optional(),
    this.key('publicKey').explicit(1).bitstr()
      .optional()
  );
});

function generateVAPIDKeys() {
  const curve = crypto.createECDH('prime256v1');
  curve.generateKeys();

  let publicKeyBuffer = curve.getPublicKey();
  let privateKeyBuffer = curve.getPrivateKey();

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
    publicKeyBuffer = Buffer.concat([padding, publicKeyBuffer]);
  }

  return {
    publicKey: publicKeyBuffer.toString('base64url'),
    privateKey: privateKeyBuffer.toString('base64url')
  };
}

function getFutureExpirationTimestamp(numSeconds) {
  const futureExp = new Date();
  futureExp.setSeconds(futureExp.getSeconds() + numSeconds);
  return Math.floor(futureExp.getTime() / 1000);
}

function toPEM(key) {
  return ECPrivateKeyASN.encode({
    version: 1,
    privateKey: key,
    parameters: [1, 2, 840, 10045, 3, 1, 7] // prime256v1
  }, 'pem', {
    label: 'EC PRIVATE KEY'
  });
};

const getKeys = () => {
  try {
    const keys = JSON.parse(fs.readFileSync("vapidKeys.json", "utf-8"));
    keys.privateKey = Buffer.from(keys.privateKey, "base64url");
    keys.publicKey = Buffer.from(keys.publicKey, "base64url");
    return keys;
  } catch (e) {
    const keys = generateVAPIDKeys();
    return keys;    
  }
};

const keys = getKeys();

let privateKey = keys.privateKey;

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

privateKey = Buffer.from(privateKey, 'base64url');

console.log(header, jwtPayload, privateKey);
const jwt = jws.sign({
  header: header,
  payload: jwtPayload,
  privateKey: toPEM(privateKey)
});
console.log(jwt);

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
