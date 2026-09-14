"use client";

import { apiService } from "@/services/apiService";
import { useUserStore } from "@/stores/userDetails";
import { User } from "@/types/User";
import { useEffect } from "react";

interface UserResponse {
  user: User;
}

export default function UserInitializer() {
  const setUserDetail = useUserStore((state) => state.setUserDetail);

  useEffect(() => {
    const getUserDetail = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      // No authentication available
      if (!accessToken && !refreshToken) {
        return;
      }

      try {
        const response =
          await apiService.get<UserResponse>("/api/user");

        setUserDetail(response.user);
      } catch (error) {
        console.log("User restore error:", error);
      }
    };

    getUserDetail();
  }, [setUserDetail]);

  return null;
}