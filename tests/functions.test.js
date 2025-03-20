import { decode, encode, getData, getDataObject, setData } from "@/functions";
import { describe, test, it, expect, beforeEach, vi } from "vitest";

describe('encode and decode', () => {
    test('should correctly encode text', () => {
        const text = "Hello World!";
        const encoded = encode(text);

        expect(encoded).not.toBe(text)
    });
    test('should correctly decode text', () => {
        const text = "Hello World decoded!";
        const encoded = encode(text);
        const decoded = decode(encoded);

        expect(decoded).toBe(text)
    });

    test('should handle encoding of empty string', () => {
        const text = ""; 
        const encoded = encode(text);

        expect(encoded).toBe(text);
    });
});

describe('Local Storage Functions', () => {

    beforeEach(() => {
        // Mock localStorage methods before each test
        globalThis.localStorage = {
          getItem: vi.fn(),
          setItem: vi.fn(),
        };
    });

    test('setData and getData should store and retrieve correctly', () => {
        const key = "user";
        const value = { name: "John Doe", age: 30 };
        const encodedKey = encode(key);
        const encodedValue = encode(JSON.stringify(value));
  
        setData(key, value);
        expect(localStorage.setItem).toHaveBeenCalledWith(encodedKey, encodedValue);

        getData(key);
        expect(localStorage.getItem).toHaveBeenCalledWith(encodedKey); 
    });

})
