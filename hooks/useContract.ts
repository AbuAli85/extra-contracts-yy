import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ContractDetail, ActivityLog } from '@/types/contract'

// Mock activity logs - replace with real data fetch later
const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    action: 'created',
    description: 'Contract was created and initialized',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: '2',
    action: 'generated',
    description: 'Google document was generated successfully',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: '3',
    action: 'reviewed',
    description: 'Contract was reviewed by legal team',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: '4',
    action: 'sent',
    description: 'Contract was sent to parties for review',
    created_at: new Date(Date.now() - 3600000 * 6).toISOString()
  },
  {
    id: '5',
    action: 'downloaded',
    description: 'PDF document was downloaded',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  }
]

interface UseContractResult {
  contract: ContractDetail | null
  activityLogs: ActivityLog[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useContract(contractId: string): UseContractResult {
  const [contract, setContract] = useState<ContractDetail | null>(null)
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContract = async () => {
    try {
      setLoading(true)
      setError(null)

      // Use the same query structure as use-contracts.ts
      let { data, error } = await supabase
        .from("contracts")
        .select(
          `
          *,
          first_party:parties!contracts_first_party_id_fkey(id,name_en,name_ar,crn,type),
          second_party:parties!contracts_second_party_id_fkey(id,name_en,name_ar,crn,type),
          promoters(id,name_en,name_ar,id_card_number,id_card_url,passport_url,status)
        `,
        )
        .eq("id", contractId)
        .single()

      // If the new schema fails, try the old schema (employer_id, client_id)
      if (error && error.message.includes('foreign key')) {
        console.log("New schema failed, trying old schema...")
        const { data: oldData, error: oldError } = await supabase
          .from("contracts")
          .select(
            `
            *,
            first_party:parties!contracts_employer_id_fkey(id,name_en,name_ar,crn,type),
            second_party:parties!contracts_client_id_fkey(id,name_en,name_ar,crn,type),
            promoters(id,name_en,name_ar,id_card_number,id_card_url,passport_url,status)
          `,
          )
          .eq("id", contractId)
          .single()
        
        if (oldError) {
          console.log("Both schemas failed:", oldError)
          throw new Error(oldError.message)
        }
        
        data = oldData
        error = null
      }

      if (error) {
        console.log("Error fetching contract:", error)
        throw new Error(error.message)
      }

      if (!data) {
        setError("Contract not found")
        return
      }

      // Debug: Log the fetched data to see what we're getting
      // console.log('📊 Fetched contract data:', data)
      
      // Cast to ContractDetail type
      setContract(data as ContractDetail)
      setActivityLogs(mockActivityLogs)
    } catch (err) {
      setError("Failed to load contract")
      console.error('Contract fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => {
    if (contractId) {
      fetchContract()
    }
  }

  useEffect(() => {
    if (contractId) {
      fetchContract()
    }
  }, [contractId])

  return {
    contract,
    activityLogs,
    loading,
    error,
    refetch
  }
}
