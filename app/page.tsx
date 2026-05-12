import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24 sm:py-32">
      <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
        Aktieskolan
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-neutral-600 sm:text-xl">
        Lär dig grunderna i svensk börsinvestering — en lektion i taget. 10
        lektioner, 5–10 minuter styck, helt utan jargong.
      </p>
      <Link
        href="/lektioner"
        className="mt-10 inline-flex items-center rounded-full bg-primary px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-primary-dark"
      >
        Börja här →
      </Link>
    </main>
  );
}
