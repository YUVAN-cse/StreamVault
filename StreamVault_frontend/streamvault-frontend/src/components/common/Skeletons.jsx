export function VideoCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden border border-brand-border bg-brand-card">
      <div className="aspect-video skeleton" />
      <div className="p-3 flex gap-3">
        <div className="w-8 h-8 rounded-full skeleton shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 skeleton rounded w-full" />
          <div className="h-3.5 skeleton rounded w-3/4" />
          <div className="h-3 skeleton rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function CommentSkeleton() {
  return (
    <div className="flex gap-3 animate-pulse">
      <div className="w-8 h-8 rounded-full bg-brand-muted shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-brand-muted rounded w-1/4" />
        <div className="h-3 bg-brand-muted rounded w-full" />
        <div className="h-3 bg-brand-muted rounded w-3/4" />
      </div>
    </div>
  );
}

export function ChannelSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-36 bg-brand-muted rounded-xl mb-4" />
      <div className="flex items-end gap-4 px-4 -mt-10">
        <div className="w-20 h-20 rounded-full bg-brand-muted ring-4 ring-brand-dark" />
        <div className="space-y-2 pb-2">
          <div className="h-5 bg-brand-muted rounded w-32" />
          <div className="h-3 bg-brand-muted rounded w-24" />
        </div>
      </div>
    </div>
  );
}
