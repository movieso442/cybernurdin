import { redirect } from 'next/navigation';

// Redirects to the canonical "/" instead of serving identical content at two
// URLs, which search engines treat as duplicate content and split ranking
// signal between.
export default function HomeRedirect() {
  redirect('/');
}
