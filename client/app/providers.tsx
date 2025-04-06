"use client";

import { store } from "@/lib/store";
import { Provider } from "react-redux";
import AuthProvider from "./context/AuthProvider";
import { User } from "@/types";

export default function Providers({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User | { error: string };
}) {
  return (
    <Provider store={store}>
      <AuthProvider defaultUser={user}>{children}</AuthProvider>
    </Provider>
  );
}
