export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-16 text-muted gap-3">
      <span className="h-4 w-4 rounded-full border-2 border-bronze border-t-transparent animate-spin" />
      {label}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="text-center py-16">
      <p className="text-danger mb-3">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-outline">
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="text-center py-16">
      <p className="text-champagne font-medium mb-1">{title}</p>
      {subtitle && <p className="text-muted text-sm">{subtitle}</p>}
    </div>
  );
}
