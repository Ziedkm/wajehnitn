// app/sitemap.ts
import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  // For now, we only have one main page.
  // If you add program pages later, you would add them here.
  return [
    {
      url: 'https://wajehnitn-app.vercel.app', // IMPORTANT: Replace with your actual live domain
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
   
  ]
}