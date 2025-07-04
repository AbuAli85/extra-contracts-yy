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

      // Debug: Log the raw data to see what fields are available
      console.log('Raw contract data from database:', basicData)

      // Enhanced query with relations
      let enhancedData: ContractDetail = { 
        id: basicData.id,
        status: basicData.status || undefined,
        created_at: basicData.created_at,
        updated_at: basicData.updated_at,
        
        // Party IDs
        employer_id: basicData.first_party_id || basicData.employer_id,
        client_id: basicData.second_party_id || basicData.client_id,
        promoter_id: basicData.promoter_id,
        
        // Party Names (direct fields)
        first_party_name_en: basicData.first_party_name_en,
        first_party_name_ar: basicData.first_party_name_ar,
        second_party_name_en: basicData.second_party_name_en,
        second_party_name_ar: basicData.second_party_name_ar,
        
        // Contract Details
        contract_start_date: basicData.contract_start_date || basicData.contract_valid_from || undefined,
        contract_end_date: basicData.contract_end_date || basicData.contract_valid_until || undefined,
        contract_type: basicData.contract_type || undefined,
        contract_number: basicData.contract_number || undefined,
        
        // Employment Details
        job_title: basicData.job_title || undefined,
        department: basicData.department || undefined,
        work_location: basicData.work_location || undefined,
        email: basicData.email || undefined,
        id_card_number: basicData.id_card_number || undefined,
        
        // Financial
        salary: basicData.salary || undefined,
        currency: basicData.currency || undefined,
        
        // Documents
        google_doc_url: basicData.google_doc_url || undefined,
        pdf_url: basicData.pdf_url || undefined,
        
        // Error handling
        error_details: basicData.error_details || undefined
      }
      
      // Fetch related parties separately
      if (basicData.first_party_id || basicData.employer_id) {
        const partyId = basicData.first_party_id || basicData.employer_id
        const { data: employerData } = await supabase
          .from("parties")
          .select("id, name_en, name_ar, crn, email, phone, address")
          .eq("id", partyId)
          .single()
        
        if (employerData) {
          enhancedData.employer = employerData
        }
      }
      
      if (basicData.second_party_id || basicData.client_id) {
        const partyId = basicData.second_party_id || basicData.client_id
        const { data: clientData } = await supabase
          .from("parties")
          .select("id, name_en, name_ar, crn, email, phone, address")
          .eq("id", partyId)
          .single()
        
        if (clientData) {
          enhancedData.client = clientData
        }
      }
      
      if (basicData.promoter_id) {
        const { data: promoterData } = await supabase
          .from("promoters")
          .select("id, name_en, name_ar, id_card_number, email, phone")
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
