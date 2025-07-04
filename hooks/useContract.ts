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

      // Handle the data using any type to work with actual database schema
      const data: any = basicData

      // Enhanced query with relations - handle actual database structure
      let enhancedData: ContractDetail = { 
        id: data.id,
        status: data.status || undefined,
        created_at: data.created_at,
        updated_at: data.updated_at,
        
        // Party IDs - use actual field names from your JSON data
        employer_id: data.employer_id,
        client_id: data.client_id,
        promoter_id: data.promoter_id,
        
        // Party Names (handle null values from your JSON)
        first_party_name_en: data.first_party_name_en || undefined,
        first_party_name_ar: data.first_party_name_ar || undefined,
        second_party_name_en: data.second_party_name_en || undefined,
        second_party_name_ar: data.second_party_name_ar || undefined,
        
        // Contract Details (available in your JSON)
        contract_start_date: data.contract_start_date || undefined,
        contract_end_date: data.contract_end_date || undefined,
        contract_type: data.contract_type || undefined,
        contract_number: data.contract_number || undefined,
        
        // Employment Details - handle missing fields gracefully
        job_title: data.job_title || undefined,
        department: data.department || undefined,
        work_location: data.work_location || undefined,
        email: data.email || undefined,
        id_card_number: data.id_card_number || undefined,
        
        // Financial
        salary: data.salary || undefined,
        currency: data.currency || undefined,
        
        // Documents
        google_doc_url: data.google_doc_url || undefined,
        pdf_url: data.pdf_url || undefined,
        
        // Error handling
        error_details: data.error_details || undefined
      }
      
      // Fetch related parties separately - use the IDs we have
      if (enhancedData.employer_id) {
        try {
          const { data: employerData } = await supabase
            .from("parties")
            .select("id, name_en, name_ar, crn")
            .eq("id", enhancedData.employer_id)
            .single()
          
          if (employerData) {
            enhancedData.employer = employerData
            // If party names are not in contract, use party data
            if (!enhancedData.first_party_name_en && employerData.name_en) {
              enhancedData.first_party_name_en = employerData.name_en
            }
            if (!enhancedData.first_party_name_ar && employerData.name_ar) {
              enhancedData.first_party_name_ar = employerData.name_ar
            }
          }
        } catch (err) {
          console.log('Could not fetch employer data:', err)
        }
      }
      
      if (enhancedData.client_id) {
        try {
          const { data: clientData } = await supabase
            .from("parties")
            .select("id, name_en, name_ar, crn")
            .eq("id", enhancedData.client_id)
            .single()
          
          if (clientData) {
            enhancedData.client = clientData
            // If party names are not in contract, use party data
            if (!enhancedData.second_party_name_en && clientData.name_en) {
              enhancedData.second_party_name_en = clientData.name_en
            }
            if (!enhancedData.second_party_name_ar && clientData.name_ar) {
              enhancedData.second_party_name_ar = clientData.name_ar
            }
          }
        } catch (err) {
          console.log('Could not fetch client data:', err)
        }
      }
      
      if (data.promoter_id) {
        try {
          const { data: promoterData } = await supabase
            .from("promoters")
            .select("id, name_en, name_ar, id_card_number")
            .eq("id", data.promoter_id)
            .single()
          
          if (promoterData) {
            enhancedData.promoters = [promoterData]
          }
        } catch (err) {
          console.log('Could not fetch promoter data:', err)
        }
      }
      
      console.log('Enhanced contract data:', enhancedData)
      setContract(enhancedData)
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
