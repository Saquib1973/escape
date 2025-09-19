import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/config/auth'
import prisma from '@/lib/config/prisma'

export async function DELETE() {
  try {
    // Get the current session
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is already deleted
    const existingUser = await prisma.user.findUnique({
      where: {
        id: session.user.id,
        isDeleted: false
      },
      select: { id: true }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found or already deleted' },
        { status: 404 }
      )
    }

    // Soft delete the user
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        // Clear sensitive data but keep posts/comments for data integrity
        email: null,
        password: null,
        name: 'Deleted User',
        image: null,
        // Invalidate all sessions by updating the user
        sessions: {
          deleteMany: {}
        }
      }
    })

    return NextResponse.json(
      { message: 'Account deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting account:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
