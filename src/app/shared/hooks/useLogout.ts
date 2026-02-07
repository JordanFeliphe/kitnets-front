import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth";

export function useLogout() {
  const navigate = useNavigate();

  return useMutation<void, Error, void>({
    mutationFn: authService.logout,
    onSuccess: () => {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      navigate("/login");
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      // Even if logout fails, clear session and redirect
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      navigate("/login");
    }
  });
}