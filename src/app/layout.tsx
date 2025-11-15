import './globals.css'
import type { Metadata } from 'next'
import { Old_Standard_TT, Karla } from 'next/font/google'

const oldStandard = Old_Standard_TT({ 
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-serif',
})

const karla = Karla({ 
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'River Life RV Resort | Luxury RV Sites on the Tennessee River',
  description: 'Experience riverside luxury at River Life RV Resort in Chattanooga, TN. Full-hookup RV sites with stunning river and mountain views. Book your slice of heaven today!',
  keywords: ['RV resort Chattanooga', 'Tennessee River camping', 'luxury RV sites', 'full hookup RV park', 'Chattanooga camping'],
  authors: [{ name: 'River Life RV Resort' }],
  openGraph: {
    title: 'River Life RV Resort - Riverside Luxury in Chattanooga',
    description: 'Full-hookup RV sites with breathtaking Tennessee River views',
    url: 'https://riverlifervresort.com',
    siteName: 'River Life RV Resort',
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${oldStandard.variable} ${karla.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#bfe4f2" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="font-sans bg-gray-900 text-white">
        {children}
      </body>
    </html>
  )
}
