import { UserRole } from "@prisma/client";

export type User = {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
};

export type UserFormData = {
  name?: string | null;
  email: string;
  role: UserRole;
  password?: string;
};


