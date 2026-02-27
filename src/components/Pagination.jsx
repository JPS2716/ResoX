export function Pagination({ page, pageCount, onPrev, onNext }) {
  if (pageCount <= 1) return null;

  return (
    <div className="pagination" aria-label="Pagination">
      <span className="pagination-meta">Page {page} of {pageCount}</span>
      <button className="btn btn-ghost btn-small" onClick={onPrev} disabled={page <= 1}>
        Prev
      </button>
      <button
        className="btn btn-ghost btn-small"
        onClick={onNext}
        disabled={page >= pageCount}
      >
        Next
      </button>
    </div>
  );
}

