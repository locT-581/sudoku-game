import CryptoJS, { AES } from 'crypto-js';

const key = 'sudoku';
export const saveFile = async (blob: any) => {
  const a = document.createElement('a');
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const milliseconds = date.getMilliseconds();
  a.download = `${day}_${month + 1}_${year}_${milliseconds}.sdk`;
  a.href = URL.createObjectURL(blob);
  // revoke ObjectURL
  a.addEventListener('click', () => {
    setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
  });
  a.click();
};
export const encrypt = (rawFile: string): string => {
  const encrypted = AES.encrypt(rawFile, key).toString();
  return encrypted;
};

export const decrypt = (rawFile: string): string => {
  const bytes = AES.decrypt(rawFile, key);
  const decryptedPlaintext = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedPlaintext;
};
