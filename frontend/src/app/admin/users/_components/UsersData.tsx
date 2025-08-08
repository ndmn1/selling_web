import React from "react";
import UserList from "./UserList";
import PaginationClient from "@/components/PaginationClient";
import { getUsers } from "@/actions/admin-user";

interface UsersDataProps {
  search?: string;
  page?: string;
}

export default async function UsersData({ search, page }: UsersDataProps) {
  const currentPage = page ? parseInt(page) : 1;
  const limit = 10; // Items per page

  try {
    const { users, total } = await getUsers(search, currentPage, limit);

    return (
      <>
        <UserList initialUsers={users} />

        {total > 0 && (
          <div className="mt-6">
            <PaginationClient
              total={total}
              itemPerPage={limit}
              curPage={currentPage}
              pageParamName="page"
            />
          </div>
        )}
      </>
    );
  } catch (error) {
    console.error("Error in UsersData:", error);

    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">
          {error instanceof Error ? error.message : "Failed to load users"}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    );
  }
}
