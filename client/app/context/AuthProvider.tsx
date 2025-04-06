"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import { setUser } from "@/lib/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { User } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthProvider({
  children,
  defaultUser,
}: Readonly<{
  children: React.ReactNode;
  defaultUser: User | { error: string };
}>) {
  const router = useRouter();
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [isUserFetching, setIsUserFetching] = useState(true);

  useEffect(() => {
    dispatch(setUser(defaultUser as User));
    setIsUserFetching(false);
  }, []);

  useEffect(() => {
    if (user.id === 0 && !isUserFetching) {
      router.replace("/login");
    }
  }, [user, isUserFetching]);

  if (isUserFetching)
    return (
      <div className="h-full flex items-center">
        <LoadingSpinner />
      </div>
    );

  return <>{children}</>;
}
