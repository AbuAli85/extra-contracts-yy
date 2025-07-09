"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Promoter } from "@/lib/types"

export default function TestPromotersPage() {
  const [promoters, setPromoters] = useState<Promoter[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPromoters() {
      console.log("Fetching promoters...")
      setIsLoading(true)
      setError(null)

      try {
        const { data, error } = await supabase
          .from("promoters")
          .select("*")
          .order("name_en")

        console.log("Supabase response:", { data, error })

        if (error) {
          console.error("Error fetching promoters:", error)
          setError(error.message)
        } else {
          console.log("Promoters fetched successfully:", data)
          setPromoters(data || [])
        }
      } catch (err) {
        console.error("Unexpected error:", err)
        setError("Unexpected error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPromoters()
  }, [])

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Test Promoters Page</h1>
        <p>Loading promoters...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Test Promoters Page</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Promoters Page</h1>
      <ul className="space-y-2">
        {promoters.map((promoter) => (
          <li key={promoter.id} className="border rounded p-4 bg-white shadow">
            <div className="font-semibold">{promoter.name_en} / {promoter.name_ar}</div>
            <div className="text-sm text-gray-500">ID: {promoter.id_card_number}</div>
            <div className="text-sm text-gray-500">Status: {promoter.status}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
