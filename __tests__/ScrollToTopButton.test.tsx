import { fireEvent, render, screen } from "@testing-library/react";
import ScrollToTopButton from "@/components/ScrollToTopButton/ScrollToTopButton";

describe("ScrollToTopButton", () => {
  it("scrolls to top on click", () => {
    const scrollToMock = jest.fn();
    Object.defineProperty(window, "scrollTo", {
      value: scrollToMock,
      writable: true,
    });

    render(<ScrollToTopButton />);

    fireEvent.click(screen.getByRole("button", { name: "Прокрутить наверх" }));

    expect(scrollToMock).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  });
});
