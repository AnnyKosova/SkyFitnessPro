import { fireEvent, render, screen } from "@testing-library/react";
import WorkoutProgressModal from "@/components/WorkoutProgressModal/WorkoutProgressModal";

describe("WorkoutProgressModal", () => {
  const exercises = [
    { name: "Упражнение 1", quantity: 10, _id: "ex1" },
    { name: "Упражнение 2", quantity: 12, _id: "ex2" },
  ];

  it("renders inputs for exercises and uses initial values", () => {
    render(
      <WorkoutProgressModal
        onClose={jest.fn()}
        onSave={jest.fn()}
        exercises={exercises}
        initialProgressData={[3, 5]}
      />
    );

    expect(screen.getByText(/Сколько раз вы сделали Упражнение 1/i)).toBeInTheDocument();
    const inputs = screen.getAllByPlaceholderText("0");
    expect(inputs).toHaveLength(2);
    expect(inputs[0]).toHaveValue("3");
    expect(inputs[1]).toHaveValue("5");
  });

  it("calls onSave with numeric values", () => {
    const onSave = jest.fn();
    render(
      <WorkoutProgressModal
        onClose={jest.fn()}
        onSave={onSave}
        exercises={exercises}
      />
    );

    const inputs = screen.getAllByPlaceholderText("0");
    fireEvent.change(inputs[0], { target: { value: "7" } });
    fireEvent.change(inputs[1], { target: { value: "2" } });

    fireEvent.click(screen.getByRole("button", { name: "Сохранить" }));

    expect(onSave).toHaveBeenCalledWith([7, 2]);
  });
});
