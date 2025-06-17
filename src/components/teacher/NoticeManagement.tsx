import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Bell, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createNotice } from '@/controllers/teacherDashboardController';
import { formatDate } from '@/lib/utils';

interface Batch {
  id: string;
  name: string;
  description: string;
  start_date: string;
}

interface Notice {
  id: string;
  title: string;
  content: string;
  created_at: string;
  batch_id: string | null;
  batches?: Batch;
}

interface NoticeManagementProps {
  notices: Notice[];
  batches: Batch[];
  onRefresh: () => void;
}

export function NoticeManagement({ notices, batches, onRefresh }: NoticeManagementProps) {
  const { toast } = useToast();
  const [newNotice, setNewNotice] = useState({ title: '', content: '', batch_id: '' });

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    createNotice(
      {
        title: newNotice.title,
        content: newNotice.content,
        batch_id: newNotice.batch_id || null
      },
      () => {
        setNewNotice({ title: '', content: '', batch_id: '' });
        onRefresh();
        toast({ title: 'Success', description: 'Notice created successfully!' });
      },
      (msg) => toast({ title: 'Error', description: msg, variant: 'destructive' })
    );
  };

  const getBatchName = (batchId: string | null) => {
    if (!batchId) return 'Broadcast';
    const batch = batches.find(b => b.id === batchId);
    return batch?.name || 'Unknown Batch';
  };

  return (
    <div className="space-y-6">
      {/* Create Notice Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Notice</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateNotice} className="space-y-4">
            <div>
              <Label htmlFor="notice-title">Title</Label>
              <Input
                id="notice-title"
                value={newNotice.title}
                onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                required
                placeholder="Enter notice title"
              />
            </div>
            <div>
              <Label htmlFor="notice-content">Content</Label>
              <Textarea
                id="notice-content"
                value={newNotice.content}
                onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                required
                placeholder="Enter notice content"
              />
            </div>
            <div>
              <Label>Target Batch (Leave empty for broadcast)</Label>
              <Select
                value={newNotice.batch_id === null ? "broadcast" : newNotice.batch_id}
                onValueChange={(value) =>
                  setNewNotice({ ...newNotice, batch_id: value === "broadcast" ? null : value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select batch (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="broadcast">Broadcast to all</SelectItem>
                  {batches.map((batch) => (
                    <SelectItem key={batch.id} value={batch.id}>
                      {batch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">
              <Plus className="h-4 w-4 mr-2" />
              Create Notice
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Existing Notices */}
      <Card>
        <CardHeader>
          <CardTitle>Published Notices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notices.length > 0 ? (
              notices.map((notice) => (
                <div key={notice.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{notice.title}</h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant={notice.batch_id ? "default" : "secondary"}>
                        <Bell className="h-3 w-3 mr-1" />
                        {getBatchName(notice.batch_id)}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-2">{notice.content}</p>
                  <p className="text-xs text-gray-500">
                    {formatDate(notice.created_at)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No notices published yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
