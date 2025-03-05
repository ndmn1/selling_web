import ImageCarousel from "@/components/ImageCarousel/ImageCarousel";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="my-20 lg:my-28">
      <ImageCarousel />

      <div>
        <h1 className="text-4xl font-semibold text-center my-16">
          Welcome to our store
        </h1>
        <p className="text-lg text-center">
          We have the best selection of products for you. Browse our catalog and
          find what you need.
        </p>
      </div>
      <div className="grid grid-cols-2 my-16 w-[96%] mx-auto h-96 overflow-hidden">
        <div className="relative w-full h-full hover:scale-105 transition-transform duration-500">
          <Link href="/sale">
            <Image
              src="/sale.jpeg"
              alt="Sale promotion"
              fill
              className="object-fill"
            />
          </Link>
        </div>
        <div className="relative w-full h-full hover:scale-105 transition-transform duration-500">
          <Image
            src="/trending.jpg"
            alt="Trending items"
            fill
            className="object-fill"
          />
        </div>
      </div>
    </div>
  );
}
