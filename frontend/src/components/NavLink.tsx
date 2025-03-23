import React from "react";

function NavLink(props : any) {
  return (
    <li className="hover:text-gray-300 hover:bg-neutral-900 lg:h-full flex items-center px-4 text-sm h-10">
      <a href={props.path}>{props.name}</a>
    </li>
  );
}

export default NavLink;
