import { Typography } from "@material-tailwind/react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="flex w-full flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 py-6 text-center lg:px-6">
      <Typography color="white" className="font-normal font-poppins">
        {year} Drawcode by @Ibnuard
      </Typography>
    </footer>
  );
}
