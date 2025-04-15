import Link from "next/link";
import React from "react";

interface NavLinkProps {
  path: string;
  name: string;
  onClick?: () => void;
}

function NavLink(props: NavLinkProps) {
  return (
    <li className="hover:text-gray-300 hover:bg-neutral-900 lg:h-full flex items-center px-4 text-sm h-10">
      <Link href={props.path} onClick={props.onClick}>
        {props.name}
      </Link>
    </li>
  );
}

export default NavLink;
