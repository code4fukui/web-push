import asn1 from 'asn1.js';

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

export function toPEM(key) {
  return ECPrivateKeyASN.encode({
    version: 1,
    privateKey: key,
    parameters: [1, 2, 840, 10045, 3, 1, 7] // prime256v1
  }, 'pem', {
    label: 'EC PRIVATE KEY'
  });
};

const ECPublicKeyASN = asn1.define("PublicKey", function () {
  this.seq().obj(
    this.key("algorithm").seq().obj(
      this.key("id").objid(),
      this.key("curve").objid()
    ),
    this.key("pub").bitstr()
  );
});

const ALGORITHM = [1, 2, 840, 10045, 2, 1];
const P256 = [1, 2, 840, 10045, 3, 1, 7];

export function toPEMPub(key) {
  return ECPublicKeyASN.encode({
    algorithm: {
      id: ALGORITHM,
      curve: P256,
    },
    pub: {
      unused: 0,
      data: key, //  new Buffer(keyPair.getPublic("array")),
    },
  }, 'pem', {
    label: 'EC PUBLIC KEY'
  });
};
