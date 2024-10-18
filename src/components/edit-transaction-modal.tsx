import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { setTransaction } from '@/api/set-transactions';
import { toast } from 'sonner';
import { queryClient } from '@/lib/query-client';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { TableCell } from './ui/table';
import { Link } from 'react-router-dom';
import { File } from 'lucide-react';

export function EditTransactionModal({ transaction, onClose }) {
  const [formData, setFormData] = useState(transaction);

  const { mutateAsync: updateTransaction } = useMutation({
    mutationFn: setTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transação atualizada com sucesso.');
      onClose(); // Fecha o modal após a atualização
    },
    onError: () => {
      toast.error('Falha ao atualizar transação.');
    },
  });

  async function handleUpdate() {
    try {
      await updateTransaction(formData);
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  return (
    <Card className='"w-1/3 max-lg:w-1/2 max-sm:w-full'>
      <CardContent>
        <h2>Editar Transação</h2>
        <TableCell>{index + 1}{". " + t.title}</TableCell>
        <TableCell>{t.value}</TableCell>
        <TableCell>{t.category}</TableCell>
        <TableCell>{t.scheduling ? 'Sim' : 'Não'}</TableCell>
        <TableCell>{t.payment_date ? new Date(t.payment_date).toLocaleDateString() : new Date(t.created_at).toLocaleDateString()}</TableCell>
        <TableCell>
          <Link to={t.annex ? t.annex : '#'}>
            <File className="size-4 text-muted-foreground" />
          </Link>
        </TableCell>

        <button onClick={handleUpdate}>Salvar</button>
        <button onClick={onClose}>Cancelar</button>
      </CardContent>
    </Card >
  );
}

