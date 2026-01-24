import { validateEmail, validatePassword, validatePasswordMatch } from "@/utils/authValidation";

describe("authValidation utils", () => {
  it("validates email format", () => {
    expect(validateEmail("test@example.com")).toBeNull();
    expect(validateEmail("bad-email")).toBe("Введите корректный Email");
  });

  it("validates password rules", () => {
    expect(validatePassword("Ab!1")).toBe("Пароль должен содержать не менее 6 симоволов");
    expect(validatePassword("Abcdef!")).toBe("Пароль должен содержать не менее 2 спецсимволов");
    expect(validatePassword("abcdef!!")).toBe(
      "Пароль должен содержать как минимум одну заглавную букву"
    );
    expect(validatePassword("Abcdef!!")).toBeNull();
  });

  it("validates password match", () => {
    expect(validatePasswordMatch("pass", "pass")).toBeNull();
    expect(validatePasswordMatch("pass", "pass1")).toBe("Пароли не совпадают");
  });
});
