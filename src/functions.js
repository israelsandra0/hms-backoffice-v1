import { AUTH_DATA_KEY, BACKEND_URL } from "./constants";

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
  if (!plain) return '';
  return plain
    .replace(/(\?x_)/g, "a")
    .replace(/(\?n_)/g, "m")
    .replace(/(\?a_)/g, "z");
}
// function secretReplaceReverse(plain) {
//   return plain
//     .replace(/(\?x_)/g, "a")
//     .replace(/(\?n_)/g, "m")
//     .replace(/(\?a_)/g, "z");
// }

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

  const fullUrl = `${BACKEND_URL}${urlPath}`;

  return fetch(fullUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// reueable function for user login
// export async function post(urlPath, data = {}, method = 'POST') {

//   const token = getDataObject(AUTH_DATA_KEY).accessToken;
//   const fullUrl = `${BACKEND_URL}${urlPath}`;

//   const formData = new FormData()
//   for (let key in data) {
//     if (Array.isArray(data[key])) {

//       let i = 0;
//       for (const arrayItem of data[key]) {
//         formData.append(`${key}[${i++}]`, arrayItem)
//       }
//       continue
//     }
//     formData.append(key, data[key])
//   }

//   return fetch(fullUrl, {
//     method,
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//     body: formData,
//   });
// }

export async function post(urlPath, data = {}, method = 'POST') {
  const token = getDataObject(AUTH_DATA_KEY).accessToken;
  const fullUrl = `${BACKEND_URL}${urlPath}`;

  let body;
  let headers = {
    Authorization: `Bearer ${token}`,
  };

  if (data instanceof FormData) {
    body = data;
  } else {
    const formData = new FormData();
    for (let key in data) {
      if (Array.isArray(data[key])) {
        let i = 0;
        for (const arrayItem of data[key]) {
          formData.append(`${key}[${i++}]`, arrayItem);
        }
      } else {
        formData.append(key, data[key]);
      }
    }
    body = formData;
  }

  // else if (typeof data[key] === 'object' && !(data[key] instanceof File)) {
  //       // formData.append(key, data[key]);
  //       formData.append(key, JSON.stringify(data[key]));
  //     } else {
  //       formData.append(key, data[key]);
  //     }

  return fetch(fullUrl, {
    method,
    headers,
    body,
  });
}

export async function apiDelete(urlPath) {
  return post(urlPath, {}, 'DELETE')
}

export async function put(urlPath, data) {
  return post(urlPath, data, 'PUT')
}

export async function databaseRequest(id) {
  try {
    const response = await post(`/hotels/${id}/update-database`, {id})

    if (!response.ok) {
      throw new Error(`Response error! status: ${response.status}`);
    }

    return response;

  } catch (error) {
    console.error('Request error:', error);
    throw error;
  }
}

export function isProduction() {
  return window.location.host.includes("theinnvista")
}

export function isDevelopment() {
  return window.location.host.includes("localhost")
}


