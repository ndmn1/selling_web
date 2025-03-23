"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FaShoppingCart } from "react-icons/fa";
import { MdOutlineAccountCircle } from "react-icons/md";
import Link from "next/link";
import NavLink from "./NavLink";
import Search from "./Search";
import { IoMdArrowBack } from "react-icons/io";
import DropDownNavLink from "./DropDownNavLink";
interface NavLinkProps {
  path: string;
  name: string;
}
const Navbar = () => {
  const navLinks: NavLinkProps[] = [
    {
      path: "/all",
      name: "TẤT CẢ SẢN PHẨM",
    },
    {
      path: "/hot",
      name: "HOT",
    },
    {
      path: "/sale",
      name: "GIẢM GIÁ",
    },
    {
      path: "/about",
      name: "ABOUT US",
    },
  ];
  const shoesBrands = ["Adidas", "Nike", "Puma", "Reebok", "Vans"];

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDrop, setIsOpenDrop] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [dropDownToggle, setDropDownToggle] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  const navRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleMouseEnter = () => {
    setIsOpenDrop(true);
  };

  const handleMouseLeave = () => {
    setIsOpenDrop(false);
  };

  const toggleDropdown = () => {
    setDropDownToggle(!dropDownToggle);
  };
  const toggleNavBar = (close = false) => {
    if (close) {
      setIsOpen(false);
      return;
    }
    setIsOpen(!isOpen);
  };
  return (
    <header className="mb-16 lg:mb-24">
      <div
        className={`bg-[#1a1d23] fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
          isHeaderVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <nav
          ref={navRef}
          className="h-16 lg:h-24 flex-row flex w-full justify-between items-center text-white"
        >
          <div className="flex gap-2 mx-3 lg:hidden">
            <button
              onClick={() => {
                setIsSearch(false);
                toggleNavBar();
              }}
            >
              <MdOutlineAccountCircle fontSize="1.7em" color="white" />
            </button>
            <button
              onClick={() => {
                setIsSearch((prev) => {
                  if (prev === false) {
                    toggleNavBar(true);
                    setDropDownToggle(false);
                  }
                  return !prev;
                });
              }}
            >
              <FaShoppingCart fontSize="1.7em" color="white" />
            </button>
          </div>
          <div className="xl:ml-10">
            <a href="/">
              <Image src="/logo.png" alt="logo" width={100} height={100} />
            </a>
          </div>

          <div
            className={`h-lvh lg:h-full fixed bg-[#1a1d23] top-16 lg:top-0 lg:static flex-1 lg:translate-x-0 w-64 lg:flex lg:justify-center lg:items-center transition-transform z-40 ${
              isOpen ? "translate-x-0" : "-translate-x-64"
            }`}
          >
            <ul className="lg:flex-row flex lg:items-center justify-center flex-col lg:h-full">
              <DropDownNavLink
                mouseEnter={handleMouseEnter}
                mouseLeave={handleMouseLeave}
                dropdown={toggleDropdown}
              />
              {navLinks.map((link, idx) => (
                <NavLink key={idx} path={link.path} name={link.name} />
              ))}
            </ul>
          </div>
          <div className="flex flex-row gap-4 items-center xl:mr-10 mx-3">
            <div className="hidden lg:block">
              <Search />
            </div>
            <button>
              <MdOutlineAccountCircle fontSize="1.7em" color="white" />
            </button>
            <button>
              <FaShoppingCart fontSize="1.7em" color="white" />
            </button>
          </div>
        </nav>
        {/* Mobile Search Bar (conditionally rendered) */}
        {isSearch && (
          <div className="pb-4 lg:hidden mx-3">
            <Search />
          </div>
        )}
        {/* Mobile sidebar overlay */}
        {isOpen && (
          <div
            className="lg:hidden h-svh fixed inset-0 bg-black bg-opacity-30 z-20 top-16"
            onClick={() => toggleNavBar()}
          ></div>
        )}
        {/* Mobile sidebar overlay */}
        {dropDownToggle && (
          <div
            className="lg:hidden h-svh fixed inset-0 bg-black bg-opacity-30 z-20 top-16"
            onClick={() => toggleDropdown()}
          ></div>
        )}
        {/* Dropdown Menu */}
        {(dropDownToggle || isOpenDrop) && (
          <div
            ref={dropdownRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`h-svh lg:h-auto fixed lg:left-1/2 lg:-translate-x-1/2 w-64 lg:w-2/3 top-16 lg:top-24 bg-white text-black shadow-lg z-50 transition-transform ${
              dropDownToggle ? "translate-x-0" : "-translate-x-64"
            }`}
          >
            <div className="container mx-auto px-4 py-6 ">
              <div className="grid lg:grid-cols-4 gap-8">
                {/* Collections Section */}
                <div className="col-span-4 ">
                  <div className="relative">
                    <button
                      onClick={() => setDropDownToggle(false)}
                      className="hover:bg-gray-100 lg:hidden absolute transform -translate-y-1/2 top-1/2 p-2"
                    >
                      <IoMdArrowBack size="1.2em" id="closeDrop" />
                    </button>
                    <h3 className="font-bold text-lg flex items-center justify-center">
                      BỘ SƯU TẬP
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {shoesBrands.map((collection, idx) => (
                      <Link
                        href="#"
                        key={idx}
                        className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded"
                      >
                        <span>{collection}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
