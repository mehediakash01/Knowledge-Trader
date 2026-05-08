import Link from "next/link";

const footerColumns = [
  {
    title: "Marketplace",
    links: ["Explore Skills", "Teacher Profiles", "Trade Requests"],
  },
  {
    title: "Resources",
    links: ["Guides", "Trust Center", "API"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Contact"],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white/70 dark:border-white/10 dark:bg-zinc-950">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Link href="/" className="text-base font-semibold tracking-tight">
            Knowledge Trader
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            A focused exchange for practical expertise, skill trades, and
            reputation-backed learning.
          </p>
        </div>
        {footerColumns.map((column) => (
          <div key={column.title}>
            <h2 className="text-sm font-semibold text-zinc-950 dark:text-slate-50">
              {column.title}
            </h2>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="text-sm text-zinc-600 transition-colors hover:text-blue-600 dark:text-zinc-400 dark:hover:text-cyan-300"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-zinc-200 px-4 py-5 text-center text-xs text-zinc-500 dark:border-white/10 dark:text-zinc-500">
        © 2026 Knowledge Trader. All rights reserved.
      </div>
    </footer>
  );
}
