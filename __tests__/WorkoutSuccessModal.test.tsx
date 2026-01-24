import { render, screen } from "@testing-library/react";
import WorkoutSuccessModal from "@/components/WorkoutSuccessModal/WorkoutSuccessModal";

describe("WorkoutSuccessModal", () => {
  it("renders success message", () => {
    render(<WorkoutSuccessModal onClose={jest.fn()} />);

    expect(screen.getByText("Ваш прогресс засчитан!")).toBeInTheDocument();
  });
});
