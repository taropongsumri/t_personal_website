// The site has no per-visitor data, so build every page to static HTML at build time.
// Vercel then serves plain files from its CDN instead of running a server function per visit.
export const prerender = true;
