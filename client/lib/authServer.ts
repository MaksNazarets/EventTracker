import API from "@/utils/api";
import { cookies } from "next/headers";

export const getMe = async () => {
  try {
    const cookieStore = (await cookies()) as any;
    const userToken = cookieStore.get("token")?.value;

    const res = await API.get("/me", {
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${userToken}`,
      },
    });

    return res.data.user;
  } catch (error: any) {
    if (error.response?.status === 401) {
      return { id: 0, name: "", email: "", error: "You are not logged in" };
    } else if (error.response?.data?.error)
      return { error: error.response.data.error };
    else {
      console.error(error);
      return { error: "Unexpected error" };
    }
  }
};
