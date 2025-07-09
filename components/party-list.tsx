type Party = {
  id: string;
  name_en: string;
  name_ar: string;
  crn: string;
  type?: 'Employer' | 'Client' | 'Generic' | null;
  role?: string | null;
  cr_expiry_date?: string | null;
  // ...add other fields as needed
};

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import PartyDetail from './party-detail'

export default function PartyList() {
  const [parties, setParties] = useState<Party[]>([])
  const [search, setSearch] = useState('')
  const [selectedParty, setSelectedParty] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('parties').select('*').then(({ data }) => setParties(data || []))
  }, [])

  const filtered = parties.filter(p =>
    p.name_en?.toLowerCase().includes(search.toLowerCase()) ||
    p.name_ar?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder='Search parties...'
      />
      <ul>
        {filtered.map(p => (
          <li key={p.id}>
            <button onClick={() => setSelectedParty(p.id)}>
              {p.name_en} / {p.name_ar}
            </button>
          </li>
        ))}
      </ul>
      {selectedParty && <PartyDetail partyId={selectedParty} />}
    </div>
  )
}
