import { AUTH_DATA_KEY } from "./constants";

function bytesToBase64(bytes) {
  const binString = Array.from(bytes, (byte) =>
    String.fromCodePoint(byte)
  ).join("");
  return btoa(binString);
}

function base64ToBytes(base64) {
  const binString = atob(base64);
  return Uint8Array.from(binString, (m) => m.codePointAt(0));
}

function secretReplace(plain) {
  return plain
    .replace(/[a]/g, "?x_")
    .replace(/[m]/g, "?n_")
    .replace(/[z]/g, "?a_")
    .replace(/[\=]/g, "");
}
function secretReplaceReverse(plain) {
  return plain
    .replace(/(\?x_)/g, "a")
    .replace(/(\?n_)/g, "m")
    .replace(/(\?a_)/g, "z");
}

export function encode(text) {
  // replace carriage returns and new line feeds
  text = text.replace(/[\r\n]/g, "", new TextEncoder().encode(text));

  // base64 encode
  const base64Encoded = bytesToBase64(
    Uint8Array.from(text, (m) => m.codePointAt(0))
  );

  // replace a, b, c
  const replaced = secretReplace(base64Encoded);

  // return string
  return replaced;
}

export function decode(text) {
  // replace a, b, c
  const replaced = text;

  // decode
  return new TextDecoder().decode(
    base64ToBytes(secretReplaceReverse(replaced))
  );
}

//reding and writing local storage data
export function getData(key) {
  if (!localStorage.getItem(encode(key))?.length) {
    return "";
  }

  return decode(localStorage.getItem(encode(key)));
  //    return localStorage.getItem(key)
}

export function getDataObject(key) {
  return JSON.parse(getData(key) || "{}");
}

//reuseable function for putting data into local storage
export function setData(key, value) {
  localStorage.setItem(
    encode(key),
    encode(typeof value === "string" ? value : JSON.stringify(value))
  );
}

// reueable function for accessToken
export async function get(urlPath) {
  const token = getDataObject(AUTH_DATA_KEY).accessToken;

  return fetch(urlPath, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// reueable function for user login
export async function post(urlPath, data = {}) {
  const token = getDataObject(AUTH_DATA_KEY).accessToken;
  return fetch(urlPath, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
