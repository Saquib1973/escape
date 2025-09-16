import type { NextRequest } from 'next/server';
import { prisma, generateUsernameCombinations } from '@/lib';



export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const count = parseInt(searchParams.get('count') || '10');
    const limit = Math.min(Math.max(count, 1), 50);

    const usernames = generateUsernameCombinations(limit * 2);

    const existingUsernames = await prisma.user.findMany({
      where: {
        username: {
          in: usernames
        }
      },
      select: {
        username: true
      }
    });

    const takenUsernames = new Set(existingUsernames.map(user => user.username));

    const availableUsernames = usernames.filter(username => !takenUsernames.has(username));

    while (availableUsernames.length < limit) {
      const additionalUsernames = generateUsernameCombinations(limit);
      const additionalExisting = await prisma.user.findMany({
        where: {
          username: {
            in: additionalUsernames
          }
        },
        select: {
          username: true
        }
      });

      const additionalTaken = new Set(additionalExisting.map(user => user.username));
      const additionalAvailable = additionalUsernames.filter(username => !additionalTaken.has(username));

      availableUsernames.push(...additionalAvailable);

      if (availableUsernames.length >= limit * 3) break;
    }

    const finalUsernames = availableUsernames.slice(0, limit);

    return Response.json({
      success: true,
      usernames: finalUsernames,
      count: finalUsernames.length
    });

  } catch (error) {
    console.error('Error generating username recommendations:', error);
    return Response.json(
      { success: false, error: 'Failed to generate username recommendations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username } = body;

    if (!username || typeof username !== 'string') {
      return Response.json(
        { success: false, error: 'Username is required and must be a string' },
        { status: 400 }
      );
    }

    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return Response.json(
        {
          success: false,
          error: 'Username must be 3-20 characters long and contain only letters, numbers, underscores, and hyphens'
        },
        { status: 400 }
      );
    }

    // Check if username exists in database
    const existingUser = await prisma.user.findUnique({
      where: {
        username: username.toLowerCase()
      },
      select: {
        username: true
      }
    });

    const isAvailable = !existingUser;

    return Response.json({
      success: true,
      username: username.toLowerCase(),
      available: isAvailable,
      message: isAvailable ? 'Username is available' : 'Username is already taken'
    });

  } catch (error) {
    console.error('Error checking username availability:', error);
    return Response.json(
      { success: false, error: 'Failed to check username availability' },
      { status: 500 }
    );
  }
}