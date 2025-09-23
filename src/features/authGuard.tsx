import type { ReactNode } from "react";
import { useCurrentQuery } from '../app/services/userApi'
import { Spinner } from '@nextui-org/react';

export const AuthGuard = ({ children }: { children: ReactNode }) => {
  const { isLoading } = useCurrentQuery();

  if (isLoading) {
    return <Spinner />;
  }

  return <>{children}</>;
};
