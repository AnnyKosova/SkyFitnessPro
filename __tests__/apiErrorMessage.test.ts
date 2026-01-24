import { getErrorMessage } from "@/api/fitness";

describe("getErrorMessage", () => {
  it("returns message from API error", () => {
    const error = { response: { data: { message: "Ошибка API" } } };
    expect(getErrorMessage(error)).toBe("Ошибка API");
  });

  it("returns message from Error instance", () => {
    expect(getErrorMessage(new Error("Boom"))).toBe("Boom");
  });

  it("returns fallback for unknown error", () => {
    expect(getErrorMessage(123)).toBe("Произошла неизвестная ошибка");
  });
});
