"use client";

import { store } from "@/store";
import { Provider } from "react-redux";
import { AuthProvider } from "./AuthProvider";
import { CheckAuth } from "./CheckAuth";

export default function StateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <AuthProvider>
        <CheckAuth>{children}</CheckAuth>
      </AuthProvider>
    </Provider>
  );
}
