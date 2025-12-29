import Activity from '@/components/ui/activity/activity'
import AnimatePageWrapper from '@/components/animate-page-wrapper'

export const revalidate = 0

const ProfilePage = async () => {


  return (
    <AnimatePageWrapper className="text-gray-300 p-2">
      <Activity />
    </AnimatePageWrapper>
  )
}

export default ProfilePage
