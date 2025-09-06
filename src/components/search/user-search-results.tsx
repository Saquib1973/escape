import React from 'react'
import Image from 'next/image'
import { type SearchUserResult } from '@/app/(user)/search/action'
import Link from 'next/link'

interface UserSearchResultsProps {
  users: SearchUserResult[]
  query: string
}

const UserSearchResults = ({ users, query }: UserSearchResultsProps) => {
  if (users.length === 0) {
    return (
      <div className="w-[30%] px-4">
        <h1 className="text-lg font-medium mb-4">Users related to &apos;{query}&apos;</h1>
        <p className="text-gray-400 text-sm">No users found</p>
      </div>
    )
  }

  return (
    <div className="w-[30%] px-4">
      <h1 className="text-lg font-medium mb-4">Users related to &apos;{query}&apos;</h1>
      <div className='flex flex-col gap-1 py-4'>
        {users.map((user, index) => {
          return (
            <Link
              href={`/u/${user.username}`}
              key={index + user.id}
              className="hover:bg-dark-gray-hover p-3 cursor-pointer py-2  transition-colors"
            >
              <div className="flex gap-2 items-center">
                <Image
                  className="rounded-full"
                  src={user.image ?? ''}
                  alt="user image"
                  width={48}
                  height={48}
                />
                <div>
                  <h1 className="font-medium">{user.name}</h1>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default UserSearchResults
