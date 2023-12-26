var ellipticcurve = require("starkbank-ecdsa");
var Ecdsa = ellipticcurve.Ecdsa;
var PrivateKey = ellipticcurve.PrivateKey;

// Generate privateKey from PEM string
var privateKey = PrivateKey.fromPem("-----BEGIN EC PARAMETERS-----\nBgUrgQQACg==\n-----END EC PARAMETERS-----\n-----BEGIN EC PRIVATE KEY-----\nMHQCAQEEIODvZuS34wFbt0X53+P5EnSj6tMjfVK01dD1dgDH02RzoAcGBSuBBAAK\noUQDQgAE/nvHu/SQQaos9TUljQsUuKI15Zr5SabPrbwtbfT/408rkVVzq8vAisbB\nRmpeRREXj5aog/Mq8RrdYy75W9q/Ig==\n-----END EC PRIVATE KEY-----\n");

// Create message from json
let message = JSON.stringify({
    "transfers": [
        {
            "amount": 100000000,
            "taxId": "594.739.480-42",
            "name": "Daenerys Targaryen Stormborn",
            "bankCode": "341",
            "branchCode": "2201",
            "accountNumber": "76543-8",
            "tags": ["daenerys", "targaryen", "transfer-1-external-id"]
        }
    ]
});

signature = Ecdsa.sign(message, privateKey);

// Generate Signature in base64. This result can be sent to Stark Bank in header as Digital-Signature parameter
console.log(signature.toBase64());
console.log(signature.toDer());
console.log(signature.toDer().length);

// To double check if message matches the signature
let publicKey = privateKey.publicKey();

console.log(Ecdsa.verify(message, signature, publicKey));
