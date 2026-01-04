interface VerdictBadgeProps {
  verdict: string | null;
  className?: string;
}

export function VerdictBadge({ verdict, className = "" }: VerdictBadgeProps) {
  if (!verdict) return <span className="text-muted-foreground text-sm font-medium">Pending</span>;

  let badgeClass = "bg-gray-100 text-gray-800 border-gray-200";

  switch (verdict.toLowerCase()) {
    case 'blockbuster':
      badgeClass = "badge-blockbuster";
      break;
    case 'super hit':
      badgeClass = "badge-superhit";
      break;
    case 'hit':
      badgeClass = "badge-hit";
      break;
    case 'average':
      badgeClass = "badge-average";
      break;
    case 'flop':
      badgeClass = "badge-flop";
      break;
    case 'disaster':
      badgeClass = "badge-disaster";
      break;
  }

  return (
    <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide border shadow-sm ${badgeClass} ${className}`}>
      {verdict}
    </span>
  );
}
