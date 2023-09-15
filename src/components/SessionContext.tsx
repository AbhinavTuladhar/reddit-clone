'use client'

import { createContext, ReactNode, useContext } from 'react';
import { useSession, SessionContextValue } from 'next-auth/react';

// Define the type for the context value based on the Session type from next-auth
interface SessionContextType {
  session: SessionContextValue | null;
}

// Provide an initial value (empty object) to createContext
export const SessionContext = createContext<SessionContextType>({ session: null });

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const session = useSession();

  return (
    <SessionContext.Provider value={{ session }}>
      {children}
    </SessionContext.Provider>
  );
};
