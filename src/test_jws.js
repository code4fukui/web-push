import jws from 'jws';

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
}

const keys = generateVAPIDKeys();
const privateKey = keys.privateKey;

const header = {
  typ: 'JWT',
  alg: 'ES256'
};

const DEFAULT_EXPIRATION_SECONDS = 12 * 60 * 60;
const expiration = getFutureExpirationTimestamp(DEFAULT_EXPIRATION_SECONDS);

const audience = "https://localhost/";
const subject = "fukuno@jig.jp";

const jwtPayload = {
  aud: audience,
  exp: expiration,
  sub: subject
};

const jwt = jws.sign({
  header: header,
  payload: jwtPayload,
  privateKey: toPEM(privateKey)
});
console.log(jwt);
