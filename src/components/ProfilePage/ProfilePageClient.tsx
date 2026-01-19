"use client";

import { useCallback, useState } from "react";
import ProfilePage from "./ProfilePage";
import SelectWorkoutModal from "@/components/SelectWorkoutModal/SelectWorkoutModal";

export default function ProfilePageClient() {
  const IS_SELECT_WORKOUT_PREVIEW = false;
  const [isModalOpen, setIsModalOpen] = useState(IS_SELECT_WORKOUT_PREVIEW);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <>
      <ProfilePage onSelectWorkout={openModal} />
      <SelectWorkoutModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}

