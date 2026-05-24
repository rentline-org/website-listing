'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <h2 className="text-4xl font-bold mb-4 text-red-600">Something went wrong!</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        We encountered an unexpected error while trying to load the tenant data. Please try again later.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Try again
        </button>
        <Link
          href="https://rentline.io"
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
