import { getSession } from '@/lib/auth'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import UserProfileTabSection from '@/components/user-profile-tab-section'

//temporary data
const userData = {
  follower: 10,
  following: 12,
  Watched: 3,
  favourites: [
    { name: 'Saiyara', release: '2025' },
    { name: 'Pushpa 2', release: '2025' },
  ],
}
export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex justify-center">
      <div className="max-w-5xl w-full mx-auto py-8">
        <HeaderComponent />
        <UserProfileTabSection />
        {children}
      </div>
    </div>
  )
}

const HeaderComponent = async () => {
  const session = await getSession()

  if (!session) {
    redirect('/signin')
  }
  return (
    <div className="flex justify-between p-6 px-0">
      <div className="flex items-center gap-4">
        {session.user.image ? (
          <div className="w-16 h-16 rounded-full overflow-hidden">
            <Image
              src={session.user.image}
              alt={`${session.user.name || 'User'}'s profile picture`}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-lg font-medium">
            {session.user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-white mb-1">
            {session.user.name || 'User'}
          </h1>
          <p className="text-sm text-gray-300 capitalize">
            {session.user.role || 'user'}
          </p>
          <p className="text-sm text-gray-400 mt-1">{session.user.email}</p>
        </div>
      </div>
      <div className="flex text-sm text-gray-300 items-center justify-center gap-4">
        <div className="flex flex-col items-center">
          <span>{userData.follower}</span>
          Follower
        </div>
        <div className="h-12 w-0.5 bg-dark-gray-2" />
        <div className="flex flex-col items-center">
          <span>{userData.following}</span>
          Following
        </div>
        <div className="h-12 w-0.5 bg-dark-gray-2" />
        <div className="flex flex-col items-center">
          <span>{userData.Watched}</span>
          Watched
        </div>
      </div>
    </div>
  )
}
