// components/Pagination.jsx
import { Icon } from "@iconify/react";

/* Build a compact page list: 1 … 4 5 [6] 7 8 … 25 */
function buildPages(current, total, siblings = 1) {
  const pages = [];
  const left = Math.max(2, current - siblings);
  const right = Math.min(total - 1, current + siblings);

  pages.push(1);
  if (left > 2) pages.push("start-ellipsis");
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total - 1) pages.push("end-ellipsis");
  if (total > 1) pages.push(total);

  return pages;
}

export default function Pagination({
  page,
  total = 25,
  onChange,
  loading = false,
}) {
  const pages = buildPages(page, total, 1);

  const go = (p) => {
    if (p < 1 || p > total || p === page || loading) return;
    onChange(p);
  };

  return (
    <div className="mt-12 flex flex-col items-center gap-4">
      {/* Info line */}
      <p className="text-xs uppercase tracking-widest text-base-content/50">
        Page <span className="font-bold text-base-content">{page}</span> of{" "}
        {total}
      </p>

      {/* Controls */}
      <nav
        aria-label="Pagination"
        className="flex flex-wrap items-center justify-center gap-1 rounded-2xl border border-base-300/60 bg-base-100/70 p-2 shadow-sm backdrop-blur"
      >
        {/* First */}
        <button
          type="button"
          aria-label="First page"
          onClick={() => go(1)}
          disabled={page === 1 || loading}
          className="btn btn-ghost btn-sm gap-1 rounded-xl px-2 text-base-content/70 disabled:opacity-30 sm:px-3"
        >
          <Icon icon="mdi:chevron-double-left" className="text-lg" />
          <span className="hidden sm:inline">First</span>
        </button>

        {/* Prev */}
        <button
          type="button"
          aria-label="Previous page"
          onClick={() => go(page - 1)}
          disabled={page === 1 || loading}
          className="btn btn-ghost btn-sm gap-1 rounded-xl px-2 text-base-content/70 disabled:opacity-30 sm:px-3"
        >
          <Icon icon="mdi:chevron-left" className="text-lg" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        <div className="mx-1 hidden h-6 w-px bg-base-300 sm:block" />

        {/* Numbered pages */}
        <ul className="flex items-center gap-1">
          {pages.map((p, i) =>
            typeof p === "number" ? (
              <li key={p}>
                <button
                  type="button"
                  onClick={() => go(p)}
                  disabled={loading}
                  aria-current={p === page ? "page" : undefined}
                  className={`btn btn-sm min-w-9 rounded-xl border-0 font-semibold transition-all ${
                    p === page
                      ? "btn-primary shadow-md shadow-primary/30 scale-105"
                      : "btn-ghost text-base-content/70 hover:bg-base-200"
                  } disabled:opacity-60`}
                >
                  {p}
                </button>
              </li>
            ) : (
              <li
                key={`${p}-${i}`}
                className="grid h-8 w-8 place-items-center text-base-content/40"
              >
                <Icon icon="mdi:dots-horizontal" className="text-lg" />
              </li>
            ),
          )}
        </ul>

        <div className="mx-1 hidden h-6 w-px bg-base-300 sm:block" />

        {/* Next */}
        <button
          type="button"
          aria-label="Next page"
          onClick={() => go(page + 1)}
          disabled={page === total || loading}
          className="btn btn-ghost btn-sm gap-1 rounded-xl px-2 text-base-content/70 disabled:opacity-30 sm:px-3"
        >
          <span className="hidden sm:inline">Next</span>
          <Icon icon="mdi:chevron-right" className="text-lg" />
        </button>

        {/* Last */}
        <button
          type="button"
          aria-label="Last page"
          onClick={() => go(total)}
          disabled={page === total || loading}
          className="btn btn-ghost btn-sm gap-1 rounded-xl px-2 text-base-content/70 disabled:opacity-30 sm:px-3"
        >
          <span className="hidden sm:inline">Last</span>
          <Icon icon="mdi:chevron-double-right" className="text-lg" />
        </button>
      </nav>
    </div>
  );
}
