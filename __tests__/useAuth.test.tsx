import { render } from "@testing-library/react";
import { useAuth } from "@/context/AuthContext";

describe("useAuth", () => {
  it("throws outside AuthProvider", () => {
    const Consumer = () => {
      useAuth();
      return null;
    };

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<Consumer />)).toThrow("useAuth must be used within an AuthProvider");

    consoleErrorSpy.mockRestore();
  });
});
