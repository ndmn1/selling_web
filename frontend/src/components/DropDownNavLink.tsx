'use client';
import React from "react";
import { IoIosArrowDown } from "react-icons/io";

function DropDownNavLink(props: any) {
  const handleMouseEnter = () => {
    props.mouseEnter();
  };
  const handleMouseLeave = () => {
    props.mouseLeave();
  };
  const toggleDropdown = () => {
    props.dropdown();
  };
  return (
    <li
      className="hover:text-gray-300 hover:bg-neutral-900 lg:h-full flex items-center px-4 text-sm h-10 justify-between"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <a href="/sneaker">SNEAKER</a>
      <div>
        <button
          className="ml-1 flex items-center justify-center -rotate-90 lg:rotate-0 size-5 lg:size-4"
          onClick={toggleDropdown}
        >
          <IoIosArrowDown size="auto" />
        </button>
      </div>
    </li>
  );
}

export default DropDownNavLink;
