import MovieDetailsComponent from '@/components/movie/movie-details-component'

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params

  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const url = `${base}/api/movie?id=${encodeURIComponent(id)}`
  const res = await fetch(url, { cache: 'no-store' })
  const movie = res.ok ? await res.json() : null

  return <MovieDetailsComponent movie={movie} />
}

export default page
