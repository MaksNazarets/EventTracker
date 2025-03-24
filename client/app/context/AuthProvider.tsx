"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import { getMe } from "@/lib/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [isUserFetching, setIsUserFetching] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      await dispatch(getMe());
      setIsUserFetching(false);
    };

    fetchUser();
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
