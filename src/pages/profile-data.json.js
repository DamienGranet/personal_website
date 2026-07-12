// Exposes the current profile data at /profile-data.json so the browser-based
// editor at /edit/ can load it. This is the same information already rendered
// on the public site — nothing extra is exposed.
import profile from '../data/profile.json';

export function GET() {
  return new Response(JSON.stringify(profile, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
