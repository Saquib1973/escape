import UserProfileTabSection from '@/components/page/profile/user-profile-tab-section'
import { getSession, prisma } from '@/lib'
import Image from 'next/image'
import { redirect } from 'next/navigation'

export default async function ProfileLayout({
  children,
}: {
  readonly children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect('/signin')
  }
  const userData = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      name: true,
      username: true,
      image: true,
      _count: {
        select: {
          followers: true,
          following: true,
        },
      },
    },
  })

  // Merge with actual follower/following counts from database
  const userDataWithCounts = userData ? {
    ...userData,
    follower: userData._count.followers,
    following: userData._count.following,
    Watched: 0, // You can add actual watched count logic here
  } : null

  return (
    <div className="flex justify-center">
      <div className="max-w-5xl w-full mx-auto py-8">
        <HeaderComponent userData={userDataWithCounts} />
        <UserProfileTabSection />
        {children}
      </div>
    </div>
  )
}
interface UserData {
  name: string | null
  username: string
  image: string | null
  follower?: number
  following?: number
  Watched?: number
}

const HeaderComponent = ({ userData }: { userData: UserData | null }) => {
  return (
    <div className="flex gap-3 max-md:flex-col items-start justify-between p-6 px-2 md:px-0">
      <div className="flex items-center gap-4">
        {userData?.image ? (
          <div className="w-16 h-16 rounded-full overflow-hidden">
            <Image
              src={userData.image}
              alt={`user profile picture`}
              width={64}
              height={64}
              unoptimized={userData.image.includes("dicebear")}
              className="w-full bg-light-green h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-lg font-medium">
            {userData?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}
        <div className="flex flex-col ">
          <h1 className="text-2xl font-semibold text-white">
            {userData?.name || 'User'}
          </h1>
          <p className="text-sm text-gray-300 capitalize">
            @{userData?.username || 'username'}
          </p>
        </div>
      </div>
      <div className="flex text-sm max-md:p-2 text-gray-300 items-center justify-center gap-4">
        <div className="flex max-md:gap-2 md:flex-col items-center">
          <span>{userData?.follower || 0}</span>
          <span>Follower</span>
        </div>
        <div className="h-12 w-0.5 max-md:hidden bg-dark-gray-2" />
        <div className="flex max-md:gap-2 md:flex-col items-center">
          <span>{userData?.following || 0}</span>
          <span>Following</span>
        </div>
        <div className="h-12 w-0.5 max-md:hidden bg-dark-gray-2" />
        <div className="flex max-md:gap-2 md:flex-col items-center">
          <span>{userData?.Watched || 0}</span>
          <span>Watched</span>
        </div>
      </div>
    </div>
  )
}
