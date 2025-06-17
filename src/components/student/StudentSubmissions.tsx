import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatDate } from '@/lib/utils';

interface Batch {
  id: string;
  name: string;
}

interface Submission {
  id: string;
  pdf_url: string;
  submitted_at: string;
  batches: Batch;
}

interface StudentSubmissionsProps {
  submissions: Submission[];
}

export function StudentSubmissions({ submissions }: StudentSubmissionsProps) {
  const handleViewSubmission = (pdfUrl: string) => {
    const { data } = supabase.storage
      .from('submissions')
      .getPublicUrl(pdfUrl);
    window.open(data.publicUrl, '_blank');
  };

  if (!submissions.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">My Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">No submissions yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">My Submissions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div key={submission.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 border rounded-lg space-y-3 sm:space-y-0">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm sm:text-base truncate">{submission.batches.name}</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Submitted: {formatDate(submission.submitted_at)}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewSubmission(submission.pdf_url)}
                className="w-full sm:w-auto flex-shrink-0"
              >
                <Download className="h-4 w-4 mr-2" />
                View
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
