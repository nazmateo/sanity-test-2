import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container py-24 lg:py-32">
      <div className="max-w-2xl space-y-6">
        <p className="font-mono text-sm uppercase tracking-wide text-gray-500">404</p>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-gray-900">Page not found</h1>
        <p className="text-gray-700">
          The page you requested does not exist or may have moved. Check the URL or return to the homepage.
        </p>
        <Link
          href="/"
          className="inline-flex rounded-full gap-2 items-center bg-black hover:bg-blue py-3 px-6 text-white transition-colors duration-200"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
