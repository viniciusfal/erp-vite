import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMutation } from '@tanstack/react-query';
import { setTransaction } from '@/api/set-transactions';
import { queryClient } from '@/lib/query-client';
import { toast } from 'sonner';
import type { Transactions } from '@/hooks/listing-transactions';

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transactions | null;
}

export function EditTransactionModal({ isOpen, onClose, transaction }: EditTransactionModalProps) {
  const [editedData, setEditedData] = useState<Partial<Transactions>>(transaction || {});

  const { mutateAsync: updateTransaction } = useMutation({
    mutationFn: setTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactionsByDate'] });
      toast.success('Transação atualizada com sucesso');
      onClose();
    },
    onError: () => {
      toast.error('Falha ao atualizar transação');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'date') {
      setEditedData({ ...editedData, [name]: value });
    } else {
      setEditedData({ ...editedData, [name]: value });
    }
  };

  const handleSave = async () => {
    if (transaction) {
      try {
        const paymentDate =
          editedData.payment_date && typeof editedData.payment_date === 'string'
            ? new Date(editedData.payment_date)
            : transaction.payment_date ?? null;

        await updateTransaction({
          id: transaction.transaction_id,
          title: editedData.title ?? transaction.title,
          category: editedData.category ?? transaction.category,
          value: editedData.value ? parseFloat(editedData.value.toString()) : transaction.value,
          type: editedData.type ?? transaction.type,
          scheduling: editedData.scheduling ?? transaction.scheduling,
          payment_date: paymentDate ? paymentDate.toISOString() : null,
          created_at: transaction.created_at,
          updated_at: new Date(),
          details: editedData.details ?? transaction.details,
        });
      } catch (err) {
        console.error('Erro ao atualizar transação:', err);
        toast.error('Erro ao atualizar a transação');
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Transação</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="title" className="text-right">
              Título
            </label>
            <Input
              id="title"
              name="title"
              value={editedData.title}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="value" className="text-right">
              Valor
            </label>
            <Input
              id="value"
              name="value"
              type="number"
              value={editedData.value}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="category" className="text-right">
              Categoria
            </label>
            <Input
              id="category"
              name="category"
              value={editedData.category}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="scheduling" className="text-right">
              Status
            </label>
            <Select
              name="scheduling"
              onValueChange={(value) => setEditedData({ ...editedData, scheduling: value === 'agendado' })}
              value={editedData.scheduling ? 'agendado' : 'pago'}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agendado">Agendado</SelectItem>
                <SelectItem value="pago">Pago</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="payment_date" className="text-right">
              Data de Pagamento
            </label>
            <Input
              id="payment_date"
              name="payment_date"
              type="date"
              value={editedData.payment_date ? new Date(editedData.payment_date).toISOString().split('T')[0] : ''}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar Alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}