import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col justify-center items-start max-w-2xl mx-auto mb-16">
      <h1 className="w-full font-bold text-3xl md:text-5xl tracking-tight mb-4 text-black dark:text-white text-center">
        451 – Rekt
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8 mx-auto">
        {`Something went wrong. Ngmi`}
      </p>
      <Link href="/">
        <a className="p-1 sm:p-4 w-64 font-bold mx-auto bg-gray-200 dark:bg-gray-800 text-center rounded-md text-black dark:text-white hover:bg-gray-900 focus:ring-4 focus:ring-gray-300  text-sm px-5 py-2.5 mb-2 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800">
          Return Home
        </a>
      </Link>
    </main>
  );
}
