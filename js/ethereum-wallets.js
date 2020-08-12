function generateETHPK(password, salt, iterations = 1000) {
  var encoder = new TextEncoder('utf-8');
  var passphraseKey = encoder.encode(password); // email
  var saltBuffer = encoder.encode(salt);  // pass

  window.crypto.subtle.importKey(
    'raw',
    passphraseKey,
    {name: 'PBKDF2'},
    false,
    ['deriveBits', 'deriveKey']
  ).then(function(key) {

    return window.crypto.subtle.deriveKey(
      { "name": 'PBKDF2',
        "salt": saltBuffer,
        // don't get too ambitious, or at least remember
        // that low-power phones will access your app
        "iterations": iterations,
        "hash": 'SHA-256'
      },
      key,

      // Note: for this demo we don't actually need a cipher suite,
      // but the api requires that it must be specified.
      // For AES the length required to be 128 or 256 bits (not bytes)
      { "name": 'AES-CBC', "length": 256 },

      // Whether or not the key is extractable (less secure) or not (more secure)
      // when false, the key can only be passed as a web crypto object, not inspected
      true,

      // this web crypto object will only be allowed for these functions
      [ "encrypt", "decrypt" ]
    )
  }).then(function (webKey) {

    return crypto.subtle.exportKey("raw", webKey);

  }).then(function (buffer) {

      console.log(bytesToHexString(buffer), bytesToHexString(saltBuffer));
       //document.getElementById("key").value= bytesToHexString(buffer);
      // document.getElementById("salt").value= bytesToHexString(saltBuffer);
  });
}


function bytesToHexString(bytes) {
  if (!bytes)
            return null;

        bytes = new Uint8Array(bytes);
        var hexBytes = [];

        for (var i = 0; i < bytes.length; ++i) {
            var byteString = bytes[i].toString(16);
            if (byteString.length < 2)
                byteString = "0" + byteString;
            hexBytes.push(byteString);
        }

        return hexBytes.join("");
}
