"use client";

import { store } from "@/lib/store";
import { Provider } from "react-redux";
import AuthProvider from "./context/AuthProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthProvider>{children}</AuthProvider>
    </Provider>
  );
}
