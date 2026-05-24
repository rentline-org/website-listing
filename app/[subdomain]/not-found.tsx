import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <h2 className="text-4xl font-bold mb-4">404 - Subdomain Not Found</h2>
      <p className="text-gray-600 mb-8">
        We could not find the tenant or property listing associated with this URL. 
        It might have been removed, or the URL might be incorrect.
      </p>
      <Link href="https://rentline.io" className="text-blue-500 hover:underline">
        Return to main Rentline site
      </Link>
    </div>
  );
}
