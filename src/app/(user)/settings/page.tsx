import AnimatePageWrapper from '@/components/animate-page-wrapper';

export default function SettingsHomePage() {
  return (
    <AnimatePageWrapper className="space-y-6">
      <section>
        <h2 className="mb-2 text-lg font-medium">Profile</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Manage your basic information like name, bio, and social links.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <div className="mb-1 text-sm font-medium">Name</div>
          <div className="text-sm text-zinc-700 dark:text-zinc-300">Your display name</div>
        </div>
        <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <div className="mb-1 text-sm font-medium">Website</div>
          <div className="text-sm text-zinc-700 dark:text-zinc-300">Add your personal site</div>
        </div>
      </div>
    </AnimatePageWrapper>
  )
}

