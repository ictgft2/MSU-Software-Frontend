
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define the allowed origins.
// In a real application, you would load these from environment variables.
const allowedOrigins = [
  'http://127.0.0.1:3000',
  'https://staging.api.msu.ftapp.ng'
];

// Add your development origins here.
const allowedDevOrigins = [
  'http://127.0.0.1:3000',
  'https://staging.api.msu.ftapp.ng'
];

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const origin = requestHeaders.get('origin');
  // Check if the request's origin is in the allowed list.
  // The origin header is typically only present for cross-origin requests.
  if (origin) {
    // Determine the list of allowed origins based on the environment.
    const currentAllowedOrigins = process.env.NODE_ENV === 'development'
      ? [...allowedOrigins, ...allowedDevOrigins]
      : allowedOrigins;

    if (currentAllowedOrigins.includes(origin)) {
      requestHeaders.set('Access-Control-Allow-Origin', origin);
    } else {
      // If the origin is not allowed, you can choose to reject the request.
      return new NextResponse(null, {
        status: 403, // Forbidden
        statusText: 'Forbidden',
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }
  } else {
    // If there is no origin header, it is a same-origin request.
    // Allow the request to proceed.
    // In a real application, you might add some additional logic here
    // for security.
  }

  // Set the standard CORS headers.
  requestHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  requestHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle the OPTIONS preflight request.
  if (request.method === 'OPTIONS') {
    return NextResponse.json({}, { headers: requestHeaders });
  }

  // Rewrite the response to include the new headers.
  // This is crucial for the headers to be passed back to the client.
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Copy the CORS headers to the response to ensure the client receives them.
  response.headers.set('Access-Control-Allow-Origin', requestHeaders.get('Access-Control-Allow-Origin') || '');
  response.headers.set('Access-Control-Allow-Methods', requestHeaders.get('Access-Control-Allow-Methods') || '');
  response.headers.set('Access-Control-Allow-Headers', requestHeaders.get('Access-Control-Allow-Headers') || '');

  return response;
}

// Specify the paths where the middleware should run.
// This is a powerful feature for optimizing performance.
export const config = {
  matcher: '/api/:path*',
};
