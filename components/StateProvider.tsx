"use client";

import { store, persistor } from "@/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { AuthProvider } from "./AuthProvider";
import { CheckAuth } from "./CheckAuth";

export default function StateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <CheckAuth>{children}</CheckAuth>
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}
