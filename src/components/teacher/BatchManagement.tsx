import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { StudentListModal } from './StudentListModal';
import { createBatch, updateBatch, deleteBatch, fetchBatchStudents } from '@/controllers/teacherDashboardController';
import { formatDate } from '@/lib/utils';

interface Batch {
  id: string;
  name: string;
  description: string;
  start_date: string;
}

interface BatchManagementProps {
  batches: Batch[];
  onRefresh: () => void;
}

export function BatchManagement({ batches, onRefresh }: BatchManagementProps) {
  const { toast } = useToast();
  const [newBatch, setNewBatch] = useState({ name: '', description: '', start_date: '' });
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    createBatch(
      newBatch,
      () => {
        setNewBatch({ name: '', description: '', start_date: '' });
        onRefresh();
        toast({ title: 'Success', description: 'Batch created successfully!' });
      },
      (msg) => toast({ title: 'Error', description: msg, variant: 'destructive' })
    );
  };

  const handleUpdateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBatch) return;
    updateBatch(
      editingBatch,
      () => {
        setEditingBatch(null);
        onRefresh();
        toast({ title: 'Success', description: 'Batch updated successfully!' });
      },
      (msg) => toast({ title: 'Error', description: msg, variant: 'destructive' })
    );
  };

  const handleDeleteBatch = (batchId: string) => {
    deleteBatch(
      batchId,
      () => {
        onRefresh();
        toast({ title: 'Success', description: 'Batch deleted successfully!' });
      },
      (msg) => toast({ title: 'Error', description: msg, variant: 'destructive' })
    );
  };

  const handleViewStudents = (batch: Batch) => {
    setSelectedBatch(batch);
    setModalOpen(true);
    fetchBatchStudents(batch.id, setStudents, setLoadingStudents);
  };

  return (
    <div className="space-y-6">
      {/* Create/Edit Batch Form */}
      <Card>
        <CardHeader>
          <CardTitle>{editingBatch ? 'Edit Batch' : 'Create New Batch'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={editingBatch ? handleUpdateBatch : handleCreateBatch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="batch-name">Batch Name</Label>
                <Input
                  id="batch-name"
                  value={editingBatch ? editingBatch.name : newBatch.name}
                  onChange={(e) => editingBatch 
                    ? setEditingBatch({ ...editingBatch, name: e.target.value })
                    : setNewBatch({ ...newBatch, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={editingBatch ? editingBatch.start_date : newBatch.start_date}
                  onChange={(e) => editingBatch
                    ? setEditingBatch({ ...editingBatch, start_date: e.target.value })
                    : setNewBatch({ ...newBatch, start_date: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editingBatch ? editingBatch.description : newBatch.description}
                onChange={(e) => editingBatch
                  ? setEditingBatch({ ...editingBatch, description: e.target.value })
                  : setNewBatch({ ...newBatch, description: e.target.value })
                }
                required
              />
            </div>
            <div className="flex space-x-2">
              <Button type="submit">
                <Plus className="h-4 w-4 mr-2" />
                {editingBatch ? 'Update Batch' : 'Create Batch'}
              </Button>
              {editingBatch && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingBatch(null)}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Existing Batches */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Batches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {batches.map((batch) => (
              <Card key={batch.id} className="border-2">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{batch.name}</h3>
                    <Dialog open={modalOpen && selectedBatch?.id === batch.id} onOpenChange={setModalOpen}>
                      <DialogTrigger asChild>
                        <button onClick={() => handleViewStudents(batch)} title="View students in batch">
                          <ChevronRight className="-rotate-45 h-5 w-5 text-blue-600 hover:text-blue-800 transition" />
                        </button>
                      </DialogTrigger>
                      <StudentListModal students={students} loading={loadingStudents} />
                    </Dialog>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{batch.description}</p>
                  <p className="text-xs text-gray-500 mb-3">
                    Start: {formatDate(batch.start_date)}
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingBatch(batch)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteBatch(batch.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
