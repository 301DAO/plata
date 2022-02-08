import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <div className="flex flex-col justify-center items-start max-w-2xl mx-auto mb-16">
        <h1 className="w-full font-bold text-3xl md:text-5xl tracking-tight mb-4 text-black dark:text-white text-center">
          451 – Rekt
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          {` Why show a generic 404 when I can make it sound mysterious? It seems
          you've found something that used to exist, or you spelled something
          wrong. I'm guessing you spelled something wrong. Can you double check
          that URL?`}
        </p>
        <Link href="/">
          <a className="p-1 sm:p-4 w-64 font-bold mx-auto bg-gray-200 dark:bg-gray-800 text-center rounded-md text-black dark:text-white">
            Return Home
          </a>
        </Link>
      </div>
    </main>
  );
}
