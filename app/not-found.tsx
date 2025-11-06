'use client';

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center text-white">
        <div className="mb-8">
          <h1 className="text-9xl font-bold mb-4">404</h1>
          <h2 className="text-3xl font-semibold mb-2">Page Not Found</h2>
          <p className="text-lg opacity-90 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="flex items-center gap-2 bg-white text-masjid-green px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
          >
            <Home className="w-5 h-5" />
            Go to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 bg-masjid-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        <div className="mt-12 opacity-75">
          <p className="text-sm">
            If you believe this is an error, please contact the masjid administration.
          </p>
        </div>
      </div>
    </div>
  );
}
