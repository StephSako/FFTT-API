import xml2js from 'xml2js';
let httpBuildQuery = require('http-build-query');

// XML string to be parsed to JSON
const xml = `<?xml version="1.0" encoding="utf-8"?>
<user>
    <verification>0</verification>
    <erreur>Cryptage incorrect</erreur>
</user>`;

let value = xml2js.parseString(xml, { mergeAttrs: true, trim : true, explicitRoot : false, explicitArray : false }, (err: any, result: any) => {
    console.log(result);
    
    return result.erreur;
});

var obj = {
  id: 777,
  message: 'hello',
  token: 'x2s7d'
};
 
console.log(httpBuildQuery(obj, '', ', '));