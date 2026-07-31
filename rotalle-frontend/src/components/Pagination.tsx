interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <button
        className="btn-outline text-sm !py-1.5 disabled:opacity-40"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
      >
        Previous
      </button>
      <span className="text-muted text-sm px-2">
        Page {page} of {totalPages}
      </span>
      <button
        className="btn-outline text-sm !py-1.5 disabled:opacity-40"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
      >
        Next
      </button>
    </div>
  );
}
