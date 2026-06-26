import Image from "next/image";
import Link from "next/link";
import { sideCards } from "@/data/Slider";

export default function SideCards() {
  return (
    <div className="flex flex-col gap-6 h-full">
      {sideCards.map((card) => (
        <Link
          key={card.id}
          href={`/products/${card.slug}`}
          className="flex-1 rounded-2xl flex items-center justify-between px-6 hover:shadow-lg transition"
          style={{ background: card.bg }}
        >
          {/* Left — text */}
          <div className="flex flex-col justify-between h-full py-6">
            <h3 className="text-xl font-semibold whitespace-pre-line text-gray-900">
              {card.title}
            </h3>
            <p className="text-sm text-gray-700">
              Save up to <span className="text-blue-600 font-semibold">{card.save}</span>
            </p>
          </div>

          {/* Right — image */}
          <div className="relative w-1/2 h-full flex items-center justify-center">
            <Image
              src={card.image}
              width={250}
              height={250}
              alt={card.title}
              className="object-contain max-h-[180px] w-auto"
            />
          </div>
        </Link>
      ))}
    </div>
  );
}