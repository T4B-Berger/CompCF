import { supabase } from '../../lib/supabaseClient'

export default async function EventsPage() {
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'published')
    .order('start_date', { ascending: true })

  return (
    <div style={{ padding: 40 }}>
      <h1>Published Events</h1>

      {error && <div>Error loading events</div>}

      {events?.map((event) => (
        <div key={event.id}>
          {event.name} — {event.start_date} → {event.end_date}
        </div>
      ))}
    </div>
  )
}