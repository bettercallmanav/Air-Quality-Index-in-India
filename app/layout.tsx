import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React from 'react'
import './globals.css'
import 'leaflet/dist/leaflet.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AQI Checker - Real-time Air Quality Index',
  description: 'Check real-time air quality index (AQI) for cities worldwide. Get detailed information about air pollutants and forecasts.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
