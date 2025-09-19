import AnimatePageWrapper from '@/components/animate-page-wrapper';

export default function UsernameSettingsPage() {
  return (
    <AnimatePageWrapper className="space-y-4">
      <h2 className="text-lg font-medium">Username</h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Update your public username. It must be unique and 3–20 characters.
      </p>
      {/* Replace with your actual form */}
      <div className="rounded-lg border border-dashed border-zinc-300 p-6 text-sm dark:border-zinc-700">
        Username form goes here.
      </div>
    </AnimatePageWrapper>
  )
}