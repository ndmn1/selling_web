import React, { Suspense } from "react";
import UsersData from "./_components/UsersData";
import UserSearch from "./_components/UserSearch";
import LoadingCircle from "@/components/LoadingCircle";
import UsersHeader from "./_components/UsersHeader";

interface UsersPageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const resolvedParams = await searchParams;
  const { search, page } = resolvedParams;

  return (
    <div className="space-y-4">
      <UsersHeader />

      <div className="bg-white rounded-lg p-6">
        <div className="mb-6 flex justify-between items-center">
          <UserSearch />
        </div>
        <Suspense
          key={JSON.stringify(resolvedParams)}
          fallback={<LoadingCircle />}
        >
          <UsersData search={search} page={page} />
        </Suspense>
      </div>
    </div>
  );
}
