import Image from "next/image";

export const Header = () => {
  return (
    <div className="flex items-center">
      <div className="aspect-square h-20 relative">
        <Image
          src="/logo-dollar.webp"
          alt="logo"
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
};
