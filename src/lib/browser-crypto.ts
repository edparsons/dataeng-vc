
export function _arrayBufferToBase64(buffer: ArrayBuffer): string {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function _base64ToArrayBuffer(base64: string) {
  var binary_string = atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array( len );
  for (var i = 0; i < len; i++)        {
      bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes;
}


export const generateKeyPair = async () => {
  const key = await crypto.subtle.generateKey(
    {
      name: "RSASSA-PKCS1-v1_5",
      modulusLength: 512, //can be 1024, 2048, or 4096
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: { name: "SHA-256" }, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
    },
    true, //whether the key is extractable (i.e. can be used in exportKey)
    ["sign", "verify"] //can be any combination of "sign" and "verify"
  );
  //returns a keypair object
  const privateKeyData = await crypto.subtle.exportKey(
    "pkcs8", //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
    key.privateKey //can be a publicKey or privateKey, as long as extractable was true
  )

  //returns a keypair object
  const publicKeyData = await crypto.subtle.exportKey(
    "spki", //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
    key.publicKey //can be a publicKey or privateKey, as long as extractable was true
  )
  const privateKey = _arrayBufferToBase64(privateKeyData);
  const publicKey = _arrayBufferToBase64(publicKeyData);
  return { privateKey, publicKey }
}


export const signMessage = async (privateKey: string, payload: string) => {
  const privateKeyBuffer = _base64ToArrayBuffer(privateKey);
  const privateKeyData = await crypto.subtle.importKey(
    "pkcs8",
    privateKeyBuffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    true,
    ["sign"]
  );

  const enc = new TextEncoder();
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    privateKeyData,
    enc.encode(payload)
  );
  return _arrayBufferToBase64(signature);
};
