import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

interface Notice {
  id: string;
  title: string;
  content: string;
  created_at: string;
  batch_id: string | null;
}

interface StudentNoticesProps {
  notices: Notice[];
}

export function StudentNotices({ notices }: StudentNoticesProps) {
  if (!notices.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Notices</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">No notices available at the moment.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Notices</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notices.map((notice) => (
            <div key={notice.id} className="border-l-4 border-blue-500 pl-3 sm:pl-4 py-3 bg-blue-50 rounded-r-lg">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base sm:text-lg truncate">{notice.title}</h3>
                  <p className="text-gray-700 mt-2 text-sm sm:text-base break-words">{notice.content}</p>
                </div>
                <Badge variant={notice.batch_id ? "default" : "secondary"} className="flex-shrink-0">
                  {notice.batch_id ? "Batch Specific" : "General"}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-3">
                {formatDate(notice.created_at)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
