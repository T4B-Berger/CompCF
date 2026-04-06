'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ padding: 40 }}>
      <h1>CompCF</h1>

      <div style={{ marginTop: 20 }}>
        <Link href="/organizer">Organizer area</Link>
      </div>

      <div style={{ marginTop: 10 }}>
        <Link href="/events">Public events</Link>
      </div>
    </div>
  )
}