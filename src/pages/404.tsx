import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto mb-16 flex max-w-2xl flex-col items-start justify-center">
      <h1 className="mb-4 w-full text-center text-3xl font-bold tracking-tight text-black dark:text-white md:text-5xl">
        451 – Rekt
      </h1>
      <p className="mx-auto mb-8 text-gray-600 dark:text-gray-300">
        {`Something went wrong. Ngmi`}
      </p>
      <Link href="/">
        <a className="mx-auto mb-2 w-64 rounded-md bg-gray-200 p-1 px-5 py-2.5 text-center text-sm font-bold text-black hover:bg-gray-900 focus:ring-4  focus:ring-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-800 sm:p-4">
          Return Home
        </a>
      </Link>
    </main>
  );
}
