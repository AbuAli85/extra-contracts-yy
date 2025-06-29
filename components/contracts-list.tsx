"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, FileText, Loader2, RefreshCw } from "lucide-react"
import { useContractsStore } from "@/lib/stores/contracts-store"
import { useRealtimeContracts } from "@/hooks/use-realtime-contracts"
import { toast } from "@/hooks/use-toast"

const statusColors = {
  pending: "bg-gray-100 text-gray-800",
  queued: "bg-blue-100 text-blue-800",
  processing: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
}

const statusIcons = {
  pending: <FileText className="h-4 w-4" />,
  queued: <Loader2 className="h-4 w-4 animate-spin" />,
  processing: <Loader2 className="h-4 w-4 animate-spin" />,
  completed: <Download className="h-4 w-4" />,
  failed: <RefreshCw className="h-4 w-4" />,
}

export function ContractsList() {
  const { contracts, loading, error, fetchContracts, generateContract } = useContractsStore()

  // Enable real-time updates
  useRealtimeContracts()

  useEffect(() => {
    fetchContracts()
  }, [fetchContracts])

  const handleGenerate = async (contractNumber: string) => {
    try {
      await generateContract(contractNumber)
      toast({
        title: "Contract Generation Started",
        description: `Contract ${contractNumber} has been queued for generation.`,
      })
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to start contract generation. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDownload = (pdfUrl: string, contractNumber: string) => {
    const link = document.createElement("a")
    link.href = pdfUrl
    link.download = `contract-${contractNumber}.pdf`
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading && contracts.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading contracts...</span>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-red-600">
            <p>Error: {error}</p>
            <Button onClick={fetchContracts} variant="outline" className="mt-4 bg-transparent">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Contracts</span>
          <Button onClick={fetchContracts} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {contracts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No contracts found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contract Number</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium">{contract.contract_number}</TableCell>
                  <TableCell>{contract.title || "Untitled Contract"}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={statusColors[contract.status]}>
                      <span className="flex items-center gap-1">
                        {statusIcons[contract.status]}
                        {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(contract.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {contract.status === "pending" && (
                        <Button onClick={() => handleGenerate(contract.contract_number)} size="sm" variant="default">
                          <FileText className="h-4 w-4 mr-1" />
                          Generate
                        </Button>
                      )}
                      {contract.status === "completed" && contract.pdf_url && (
                        <Button
                          onClick={() => handleDownload(contract.pdf_url!, contract.contract_number)}
                          size="sm"
                          variant="outline"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      )}
                      {contract.status === "failed" && (
                        <Button
                          onClick={() => handleGenerate(contract.contract_number)}
                          size="sm"
                          variant="destructive"
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Retry
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
