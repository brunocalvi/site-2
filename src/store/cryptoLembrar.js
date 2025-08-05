import CryptoJS from 'crypto-js';

const key = process.env.VUE_APP_KEY_CRYPTO;

export default {
  encryptData(value) {
    value = JSON.stringify(value);
    const encrypted = CryptoJS.AES.encrypt(value, key).toString();
    return encrypted;
  },
  decryptData(encrypted) {
    let decrypted = CryptoJS.AES.decrypt(encrypted, key).toString(CryptoJS.enc.Utf8);
    decrypted = JSON.parse(decrypted)
    return decrypted;
  },
}
