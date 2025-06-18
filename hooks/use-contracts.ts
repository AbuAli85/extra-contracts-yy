"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase" // Supabase client for reads
import { createContract, deleteContract } from "@/app/actions/contracts"
import { devLog } from "@/lib/dev-log"
import type { Database } from "@/types/supabase"
import { useEffect } from "react"

// Define a more detailed Contract type that includes potential related data
// This should align with what your `fetchContracts` select query returns
export type ContractWithRelations = Database["public"]["Tables"]["contracts"]["Row"] & {
  parties_contracts_employer_id_fkey?: Database["public"]["Tables"]["parties"]["Row"] | null
  parties_contracts_client_id_fkey?: Database["public"]["Tables"]["parties"]["Row"] | null
  promoters?: Database["public"]["Tables"]["promoters"]["Row"] | null
  // Adjust based on your actual join aliases if different
  // For example, if you aliased them:
  // employer?: Database["public"]["Tables"]["parties"]["Row"] | null
  // client?: Database["public"]["Tables"]["parties"]["Row"] | null
}
export type ContractInsert = Database["public"]["Tables"]["contracts"]["Insert"]

// Fetch all contracts with related data
const fetchContracts = async (): Promise<ContractWithRelations[]> => {
  const { data, error } = await supabase
    .from("contracts")
    .select(`
      id,
      created_at,
      job_title,
      contract_valid_from,
      contract_valid_until,
      status,
      pdf_url,
      first_party_id,
      second_party_id,
      promoter_id,
      parties!contracts_employer_id_fkey (id, name_en, name_ar),
      parties!contracts_client_id_fkey (id, name_en, name_ar),
      promoters (id, name_en, name_ar)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching contracts:", error)
    throw new Error(error.message)
  }
  return (data as ContractWithRelations[]) || []
}

export const useContracts = () => {
  const queryClient = useQueryClient()
  const queryKey = ["contracts"]

  const queryResult = useQuery<ContractWithRelations[], Error>({
    queryKey: queryKey,
    queryFn: fetchContracts,
  })

  useEffect(() => {
    const channel = supabase
      .channel("public-contracts-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "contracts" }, (payload) => {
        devLog("Realtime contract change received!", payload)
        queryClient.invalidateQueries({ queryKey: queryKey })
      })
      .subscribe((status, err) => {
        if (status === "SUBSCRIBED") {
          devLog("Subscribed to contracts channel!")
        }
        if (status === "CHANNEL_ERROR") {
          console.error("Channel error:", err)
        }
        if (status === "TIMED_OUT") {
          console.warn("Subscription timed out")
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient, queryKey])

  return queryResult
}

// Create a new contract
const createContractInSupabase = async (
  newContract: ContractInsert,
): Promise<ContractWithRelations> => {
  const data = await createContract(newContract)
  return data as ContractWithRelations
}

export const useCreateContractMutation = () => {
  const queryClient = useQueryClient()
  return useMutation<ContractWithRelations, Error, ContractInsert>({
    mutationFn: createContractInSupabase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] })
    },
  })
}

// Delete a contract
const deleteContractInSupabase = async (contractId: string): Promise<void> => {
  await deleteContract(contractId)
}

export const useDeleteContractMutation = () => {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>({
    // contractId is a string
    mutationFn: deleteContractInSupabase,
    onSuccess: (_data, contractId) => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] })
      // Optionally, for optimistic updates:
      // queryClient.setQueryData(['contracts'], (oldData: ContractWithRelations[] | undefined) =>
      //   oldData ? oldData.filter(contract => contract.id !== contractId) : []
      // );
    },
    onError: (error) => {
      console.error("Error deleting contract:", error)
      // Potentially show a toast notification to the user
    },
  })
}
