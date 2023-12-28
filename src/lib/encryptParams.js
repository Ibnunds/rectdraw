import CryptoJS from "crypto-js";

export function encrypt(text) {
  const secretPass = "XkhZG4fW2t2W";
  const data = CryptoJS.AES.encrypt(text, secretPass).toString();

  return data;
}
