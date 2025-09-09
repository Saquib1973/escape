import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'
import Link from 'next/link'
import React from 'react'


const socialLinks = [
  {
    name: 'Instagram',
    link: 'https://instagram.com',
    icon: (
      <Instagram className='size-4' />
    ),
  },
  {
    name: 'Twitter',
    link: 'https://twitter.com',
    icon: (
      <Twitter className="size-4"
      />
    ),
  },
  {
    name: 'Facebook',
    link: 'https://facebook.com',
    icon: (
      <Facebook className="size-4" />
    ),
  },
  {
    name: 'YouTube',
    link: 'https://youtube.com',
    icon: (
      <Youtube className='size-4' />
    ),
  },
]

const Footer = () => {
  return (
    <footer className="flex items-center justify-center w-full text-gray-300">
      <div className="max-w-6xl w-full mx-auto px-4 py-3">
        <div className=" flex justify-between items-center">
          <div className="text-sm text-gray-400">
            © 2025 Escape. All rights reserved.
          </div>
          <div className="flex justify-center md:justify-start md:gap-2">
            {socialLinks.map((social, index) => (
              <Link
                key={index + social.name}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200 p-1 md:p-2"
                aria-label={social.name}
              >
                {social.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
