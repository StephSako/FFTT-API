import crypto from "crypto";
console.log(crypto.createHash('md5').update('test').digest("hex"))