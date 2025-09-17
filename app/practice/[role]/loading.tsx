export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <div className="space-y-2">
          <h2 className="text-xl font-heading font-semibold text-foreground">Preparing Your Practice Session</h2>
          <p className="text-muted-foreground">Setting up your AI conversation partner...</p>
        </div>
      </div>
    </div>
  )
}
