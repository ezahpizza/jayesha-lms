import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';

interface Batch {
  id: string;
  name: string;
}

interface Enrollment {
  id: string;
  status: string;
  batches: Batch;
}

interface StudentHomeworkProps {
  enrollments: Enrollment[];
  selectedBatchId: string;
  setSelectedBatchId: (id: string) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  uploading: boolean;
  handleFileUpload: () => void;
}

export function StudentHomework({ enrollments, selectedBatchId, setSelectedBatchId, selectedFile, setSelectedFile, uploading, handleFileUpload }: StudentHomeworkProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Upload Homework</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="batch-select" className="text-sm font-medium">Select Batch</Label>
            <select
              id="batch-select"
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="w-full p-2 border rounded-md mt-1 text-sm"
            >
              <option value="">Select a batch</option>
              {enrollments
                .filter(e => e.status === 'approved')
                .map((enrollment) => (
                  <option key={enrollment.id} value={enrollment.batches.id}>
                    {enrollment.batches.name}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <Label htmlFor="homework-file" className="text-sm font-medium">Upload PDF File</Label>
            <Input
              id="homework-file"
              type="file"
              accept=".pdf"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="mt-1"
            />
          </div>
          <Button
            onClick={handleFileUpload}
            disabled={!selectedFile || !selectedBatchId || uploading}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload Homework'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
