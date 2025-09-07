import Link from 'next/link'

export const Building = () => {
  return (
    <section className="relative grid place-content-center overflow-hidden px-4 py-24 text-slate-200">
      <div className="relative z-10 flex flex-col items-center">
        <span className="text-4xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Building in progress
        </span>

        <p className="my-8 max-w-2xl text-center text-lg leading-relaxed text-slate-300 md:text-xl md:leading-relaxed">
          We&apos;re working hard to bring you an incredible experience. Come
          back later to explore this page.
        </p>
      </div>
      <Link
        href={'/'}
        className="bg-dark-gray w-fit mx-auto px-4 py-2 my-4 text-gray-300 cursor-pointer"
      >
        Please Take Me Home
      </Link>
    </section>
  )
}

export default Building
