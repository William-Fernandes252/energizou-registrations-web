import { UserContext, UserSetterContext, getJWT } from '@/contexts/auth';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { useState } from 'react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<
    (EnergizouRegistrations.Models.User & JwtPayload) | null
  >(getJWT() ? jwtDecode(getJWT() as string) : null);

  return (
    <UserContext.Provider value={user}>
      <UserSetterContext.Provider value={setUser}>
        {children}
      </UserSetterContext.Provider>
    </UserContext.Provider>
  );
}
