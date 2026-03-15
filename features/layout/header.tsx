import Image from "next/image";

export const Header = () => {
  return (
    <div className="flex items-center py-2 md:py-0">
      <div className="aspect-square h-10 md:h-20 relative">
        <Image
          src="/logo-dollar.webp"
          alt="logo"
          fill
          className="md:object-contain object-cover dark:invert"
        />
      </div>
    </div>
  );
};
