import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <h1>Aktieskolan</h1>
      <p>Lär dig grunderna i svensk börsinvestering — en lektion i taget.</p>
      <Link href="/lektioner">Börja här</Link>
    </main>
  );
}
