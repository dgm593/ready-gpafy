import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'GPAfy: Academic Utility',
    short_name: 'GPAfy',
    description: 'Minimal academic utility for modern students.',
    start_url: '/',
    id: '/',
    display: 'standalone',
    background_color: '#F8FAFC',
    theme_color: '#B8860B',
    orientation: 'portrait',
    icons: [
      {
      src: 'https://dummyimage.com/192x192/4f46e5/ffffff.png&text=GPA',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any',
    },
    {
      src: 'https://dummyimage.com/512x512/4f46e5/ffffff.png&text=GPA',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any',
    },
    ],
    categories: ['education', 'productivity'],
    display_override: ['standalone', 'window-controls-overlay'],
  }
}
