import { api } from "@/lib/axios";

interface AnaliticsResponse {
  total_balance: number
  total_entries: number
  total_outcomes: number
}

export async function getAnalysesTransactions()  {
  const response = await api.get<AnaliticsResponse>("/transaction/analitics")

  return response.data
} 