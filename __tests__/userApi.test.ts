import { userApi } from "@/api/fitness";

const mockGet = jest.fn();

jest.mock("@/api/client", () => ({
  apiClient: {
    getClient: () => ({
      get: mockGet,
    }),
  },
}));

describe("userApi.getMe", () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  it("returns user when response is wrapped", async () => {
    mockGet.mockResolvedValue({
      data: { user: { email: "test@example.com", selectedCourses: [] } },
    });

    await expect(userApi.getMe()).resolves.toEqual({
      email: "test@example.com",
      selectedCourses: [],
    });
  });

  it("returns user when response is direct", async () => {
    mockGet.mockResolvedValue({
      data: { email: "direct@example.com", selectedCourses: ["c1"] },
    });

    await expect(userApi.getMe()).resolves.toEqual({
      email: "direct@example.com",
      selectedCourses: ["c1"],
    });
  });
});
