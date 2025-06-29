'use client';
import { useEffect } from 'react';
import { useContractsStore } from './stores/contractsStore';
import SupabaseListener from './supabase-listener';

export default function HomePage() {
  const { contracts, setContracts } = useContractsStore();

  useEffect(() => {
    supabase
      .from('contracts')
      .select('*')
      .then(({ data }) => data && setContracts(data));
  }, [setContracts]);

  const generate = async (number: string) => {
    await fetch('/api/generate-contract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contract_number: number })
    });
  };

  return (
    <>
      <SupabaseListener />
      <table className="min-w-full">
        <thead><tr><th>Number</th><th>Status</th><th>Action</th><th>Download</th></tr></thead>
        <tbody>
          {contracts.map(c => (
            <tr key={c.contract_number}>
              <td>{c.contract_number}</td>
              <td>{c.status}</td>
              <td>
                <button
                  disabled={c.status !== 'pending'}
                  onClick={() => generate(c.contract_number)}
                >Generate</button>
              </td>
              <td>{c.pdf_url && <a href={c.pdf_url}>Download</a>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
