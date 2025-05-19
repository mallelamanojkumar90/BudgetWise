import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/dashboard');
  // The redirect function throws an error, so no need to return null.
  // Next.js handles the interruption of the render process.
}
