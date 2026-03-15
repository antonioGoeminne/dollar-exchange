export const Today = () => {
  const today = new Date().toLocaleDateString("es", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "Etc/GMT-3",
  });
  return (
    <p className="font-medium text-sm md:text-base first-letter:uppercase">
      {today}
    </p>
  );
};
