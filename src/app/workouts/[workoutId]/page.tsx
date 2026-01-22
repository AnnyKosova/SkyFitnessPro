"use client";

import WorkoutPage from "@/components/WorkoutPage/WorkoutPage";

export default function WorkoutPageRoute({ params }: { params: { workoutId: string } }) {
  return <WorkoutPage workoutId={params.workoutId} />;
}
