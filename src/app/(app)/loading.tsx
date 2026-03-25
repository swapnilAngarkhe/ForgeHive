export default function Loading() {
  return (
    <div className="flex items-center justify-center h-[80vh] w-full">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        <p className="text-sm text-muted-foreground font-medium">Loading ForgeHive...</p>
      </div>
    </div>
  );
}
