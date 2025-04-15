"use client";
import Link from "next/link";
import { MdOutlineAccountCircle  } from "react-icons/md";
import { useSession } from "next-auth/react";
import { logout } from "@/actions/logout";

function ProfileButton() {
  const session = useSession();
  return (
    <div className="relative group">
      {session.status === "authenticated" ? (
        <>
          <Link className="flex items-center" href="/profile">
            <MdOutlineAccountCircle fontSize="1.7em" color="white" />
          </Link>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
            <div className="px-4 py-2 text-sm text-gray-700 border-b">
              {session.data.user?.name || session.data.user?.email}
            </div>
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Profile
            </Link>
            <button
              onClick={() => {
                logout();
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Sign out
            </button>
          </div>
        </>
      ) : (
        <Link href="/login">
          <MdOutlineAccountCircle fontSize="1.7em" color="white" />
        </Link>
      )}
    </div>
  );
}

export default ProfileButton;
