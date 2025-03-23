import Link from "next/link"
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { CgMail } from "react-icons/cg";
import { FaArrowUp } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
export default function Footer() {
  return (
    <footer className="bg-[#1a1d23] text-gray-300 py-12 relative">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Contact Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-white font-bold tracking-wider text-2xl">
                SNEAKE<span className="border-b-2 border-white">R</span> <br />
                VAUL<span className="border-b-2 border-white">T</span>
              </h2>
            </div>
            <div className="space-y-1">
              <h3 className="text-white font-bold text-lg">SNEAKER VAULT - 100% AUTHENTIC</h3>
              <p>Địa chỉ: Dĩ An – Bình Dương</p>
              <p>Hotline: 0987 xxx 321</p>
              <p>Email: sneakervlt@vn.com</p>
            </div>
          </div>

          {/* Introduction Section */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg">GIỚI THIỆU</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Sneakers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Giảm giá
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Tất cả sản phẩm
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Giày kí gửi
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Giày order giá rẻ
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies Section */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg">CHÍNH SÁCH</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Chính sách hàng kí gửi
                </Link>
              </li>
            </ul>
          </div>

          {/* Support and Connect Section */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-white font-bold text-lg">HỖ TRỢ</h3>
              <p>Tư vấn 24/7, hiện tại của hàng đang sửa chữa mặt bằng nên chỉ bán online</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-bold text-lg">KẾT NỐI CHÚNG TÔI</h3>
              <div className="flex space-x-2">
                <Link href="#" className="bg-white rounded-full p-2 hover:opacity-80 transition-opacity">
                <FaFacebookF size="1.5em" color="blue" />
                </Link>
                <Link href="#" className="bg-white rounded-full p-2 hover:opacity-80 transition-opacity">
                <FaTwitter size="1.5em" color="blue" />
                </Link>
                <Link href="#" className="bg-white rounded-full p-2 hover:opacity-80 transition-opacity">
                  <CgMail size="1.5em" color="red" />
                </Link>
                <Link href="#" className="bg-white rounded-full p-2 hover:opacity-80 transition-opacity">
                <FaInstagram size="1.5em" color="red" />
                </Link>
                <Link href="#" className="bg-white rounded-full p-2 hover:opacity-80 transition-opacity">
                <FaYoutube size="1.5em" color="red" />
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-bold text-lg">NHẬN TIN KHUYẾN MÃI</h3>
              <div className="inline-flex rounded-2xl overflow-hidden">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="rounded-r-none bg-white text-black focus-visible:ring-0 focus-visible:ring-offset-0 p-2 "
                />
                <button type="submit" className="rounded-l-none bg-[#00b4ff] hover:bg-[#00a0e0] p-2">
                  <IoIosSend size="1.5em" color="white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mt-12 pt-6 border-t border-gray-700">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>
            Bản quyền thuộc về SNEAKER VAULT | Cung cấp bởi{" "}
            <Link href="#" className="text-[#00b4ff] hover:underline">
              QWER
            </Link>
          </p>
        </div>
      </div>

      {/* Floating Buttons */}
      <Link
        href="#"
        className="fixed bottom-6 right-6 bg-[#00b4ff] text-white p-3 rounded-full shadow-lg hover:bg-[#00a0e0] transition-colors z-10"
        aria-label="Back to top"
      >
        <FaArrowUp size="1.5em" />
      </Link>
    </footer>
  )
}

