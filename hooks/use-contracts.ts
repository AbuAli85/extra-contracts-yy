"use client"

// --- Supabase setup and core utilities ---
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase" // Initialized Supabase client
import { createContract, deleteContract } from "@/app/actions/contracts"
import { useToast } from "@/hooks/use-toast"
import { devLog } from "@/lib/dev-log"
import type { Database } from "@/types/supabase"
import { useEffect } from "react"

// --- Schema definition ---
// Detailed contract type including joined relational data
// This mirrors what the `fetchContracts` query selects
export type ContractWithRelations = Database["public"]["Tables"]["contracts"]["Row"] & {
  parties_contracts_employer_id_fkey?: Database["public"]["Tables"]["parties"]["Row"] | null
  parties_contracts_client_id_fkey?: Database["public"]["Tables"]["parties"]["Row"] | null
  promoters?: Database["public"]["Tables"]["promoters"]["Row"] | null
  promoter_name_en?: string | null
  promoter_name_ar?: string | null
  // Adjust based on your actual join aliases if different
  // For example, if you aliased them:
  // employer?: Database["public"]["Tables"]["parties"]["Row"] | null
  // client?: Database["public"]["Tables"]["parties"]["Row"] | null
}
// Minimal fields required when creating a new contract
export type ContractInsert = Database["public"]["Tables"]["contracts"]["Insert"]

// --- Queries ---
// Fetch all contracts with their related party and promoter info
const fetchContracts = async (): Promise<ContractWithRelations[]> => {
  const { data, error } = await supabase
    .from("contracts")
    .select(`
      *,
      promoter_name_en:promoter_id(name_en),
      promoter_name_ar:promoter_id(name_ar),
      parties!contracts_employer_id_fkey(id,name_en,name_ar),
      parties!contracts_client_id_fkey(id,name_en,name_ar),
      promoters(id,name_en,name_ar)
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

  // --- Data fetching with React Query ---
  const queryResult = useQuery<ContractWithRelations[], Error>({
    queryKey: queryKey,
    queryFn: fetchContracts,
  })

  // --- Realtime subscription ---
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
          const message = err?.message ?? "Unknown channel error"
          console.error(`Contracts channel error (${status}):`, message)
        }
        if (status === "TIMED_OUT") {
          console.warn(`Subscription timed out (${status})`)
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

// --- Form submission: create contract ---
export const useCreateContractMutation = () => {
  const queryClient = useQueryClient()
  return useMutation<ContractWithRelations, Error, ContractInsert>({
    mutationFn: createContractInSupabase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] })
    },
  })
}

// --- Form submission: delete contract ---
const deleteContractInSupabase = async (contractId: string): Promise<void> => {
  await deleteContract(contractId)
}

export const useDeleteContractMutation = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
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
      toast({
        title: "Error",
        description: `Failed to delete contract: ${error.message}`,
        variant: "destructive",
      })
    },
  })
}
