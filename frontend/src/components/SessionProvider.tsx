import { SessionProvider as AuthSessionProvider } from "next-auth/react";

function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthSessionProvider>
      {children}
    </AuthSessionProvider>
  )
}

export default SessionProvider
