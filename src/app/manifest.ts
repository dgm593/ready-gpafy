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
        src: 'https://picsum.photos/seed/gpafy_app_192/192/192',
        sizes: '192x192',
        type: 'image/jpeg',
        purpose: 'maskable',
      },
      {
        src: 'https://picsum.photos/seed/gpafy_app_192/192/192',
        sizes: '192x192',
        type: 'image/jpeg',
        purpose: 'any',
      },
      {
        src: 'https://picsum.photos/seed/gpafy_app_512/512/512',
        sizes: '512x512',
        type: 'image/jpeg',
        purpose: 'any',
      },
    ],
    categories: ['education', 'productivity'],
    display_override: ['standalone', 'window-controls-overlay'],
  }
}
