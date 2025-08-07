import { UserRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React from 'react'
import LoadingCircle from '../LoadingCircle';

export default function AdminProtected({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  if(!session) return <LoadingCircle/>;
  if (session && session?.user.role !== UserRole.ADMIN) {
    return redirect("/");
  } 
  return children;
}
