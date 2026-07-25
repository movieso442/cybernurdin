import { redirect } from 'next/navigation';

// Redirects to the canonical "/courses" instead of serving identical content
// at two URLs, which search engines treat as duplicate content.
export default function PathsIndexRedirect() {
  redirect('/courses');
}
