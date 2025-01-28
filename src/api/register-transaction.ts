import { api } from '@/lib/axios';

export interface TransactionBody {
  title: string;
  value: number; // Número diretamente
  type: string;
  category: string;
  scheduling: boolean; // Booleano diretamente
  annex?: File | null; // Arquivo ou nulo
  payment_date: Date | null; // Objeto Date
  pay: boolean; // Booleano diretamente
  details: string | null; // String ou nulo
  method: string;
  nf: string | null;
  account: string;
}

export async function registerTransaction(formData: FormData) {
  try {
    const response = await api.post('/transaction/', formData, {
      
      headers: {
        'Content-Type': 'multipart/form-data', // Deixe explícito para evitar erros de interpretação
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao registrar a transação:', error);
    throw error;
  }
}