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

      // Fetch basic contract data
      const { data: basicData, error: basicError } = await supabase
        .from("contracts")
        .select("*")
        .eq("id", contractId)
        .single()

      if (basicError) {
        setError(basicError.message)
        return
      }

      // Enhanced query with relations
      let enhancedData: ContractDetail = { 
        id: basicData.id,
        status: basicData.status || undefined,
        created_at: basicData.created_at,
        employer_id: basicData.first_party_id,
        client_id: basicData.second_party_id,
        promoter_id: basicData.promoter_id,
        contract_start_date: basicData.contract_valid_from || undefined,
        contract_end_date: basicData.contract_valid_until || undefined,
        job_title: basicData.job_title || undefined,
        work_location: basicData.work_location || undefined,
        email: basicData.email || undefined,
        pdf_url: basicData.pdf_url || undefined
      }
      
      // Fetch related parties separately
      if (basicData.first_party_id) {
        const { data: employerData } = await supabase
          .from("parties")
          .select("name_en, name_ar, crn")
          .eq("id", basicData.first_party_id)
          .single()
        
        if (employerData) {
          enhancedData.employer = employerData
        }
      }
      
      if (basicData.second_party_id) {
        const { data: clientData } = await supabase
          .from("parties")
          .select("name_en, name_ar, crn")
          .eq("id", basicData.second_party_id)
          .single()
        
        if (clientData) {
          enhancedData.client = clientData
        }
      }
      
      if (basicData.promoter_id) {
        const { data: promoterData } = await supabase
          .from("promoters")
          .select("id, name_en, name_ar, id_card_number")
          .eq("id", basicData.promoter_id)
          .single()
        
        if (promoterData) {
          enhancedData.promoters = [promoterData]
        }
      }
      
      setContract(enhancedData)
      setActivityLogs(mockActivityLogs)
    } catch (err) {
      setError("Failed to load contract")
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
