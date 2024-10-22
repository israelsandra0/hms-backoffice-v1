function bytesToBase64(bytes) {
    const binString = Array.from(bytes, (byte) =>
        String.fromCodePoint(byte),
    ).join("");
    return btoa(binString);
}

function secretReplace(plain) {
    return plain
        .replace(/[a]/g, '?x_')
        .replace(/[m]/g, '?n_')
        .replace(/[z]/g, '?a_')
}
function secretReplaceReverse(plain) {
    return plain
        .replace(/(\?x_)/g, 'a')
        .replace(/(\?n_)/g, 'm')
        .replace(/(\?a_)/g, 'z')
}


export function encode(text) {
    // replace carriage returns and new line feeds
    text = text.replace(/[\r\n]/g, '', new TextEncoder().encode(text))


    // base64 encode
    const base64Encoded = bytesToBase64(Uint8Array.from(text, (m) => m.codePointAt(0)))
    console.log('Here: ', { base64Encoded })

    // replace a, b, c
    const replaced = secretReplace(base64Encoded)

    // return string
    return replaced
}
function base64ToBytes(base64) {
    const binString = atob(base64);
    return Uint8Array.from(binString, (m) => m.codePointAt(0));
}



export function decode(text) {
    // replace a, b, c
    const replaced = text

    // decode
    return new TextDecoder().decode(base64ToBytes(secretReplaceReverse(replaced)))
}