import { expect, test, describe } from "bun:test";

test("2 + 2", () => {
  expect(2 + 2).toBe(4);
});

describe("sample", () => {
    test("テストです", () => {
        expect(1 === 1).toEqual(true);
    })
})