import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { StudentListModal } from './StudentListModal';
import { Users, Eye, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { groupStudentsByBatch, extractStudentListFromEnrollments, approveOrRejectEnrollment, removeEnrollment } from '@/controllers/teacherDashboardController';

interface Batch {
  id: string;
  name: string;
  description: string;
  start_date: string;
}

interface Enrollment {
  id: string;
  status: string;
  enrolled_at: string;
  batches: Batch;
  users: {
    id: string;
    name: string;
    phone_number: string;
  } | null;
}

interface BatchStudents {
  batch: Batch;
  students: Enrollment[];
}

interface StudentManagementProps {
  enrollments: Enrollment[];
  onRefresh: () => void;
}

export function StudentManagement({ enrollments, onRefresh }: StudentManagementProps) {
  const { toast } = useToast();
  const [selectedStudents, setSelectedStudents] = useState<{ id: string; name: string; phone_number: string }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const studentsByBatch: Record<string, BatchStudents> = groupStudentsByBatch(enrollments);

  const handleViewStudents = (students: Enrollment[]) => {
    setLoading(true);
    const studentList = extractStudentListFromEnrollments(students);
    setSelectedStudents(studentList);
    setIsModalOpen(true);
    setLoading(false);
  };

  const handleUpdateStatus = (enrollmentId: string, status: 'approved' | 'rejected') => {
    approveOrRejectEnrollment(
      enrollmentId,
      status,
      () => {
        toast({ title: "Success", description: `Student ${status} successfully` });
        onRefresh();
      },
      (msg) => toast({ title: "Error", description: msg, variant: "destructive" })
    );
  };

  const handleDeleteEnrollment = (enrollmentId: string) => {
    if (!window.confirm('Are you sure you want to delete this student enrollment?')) return;
    removeEnrollment(
      enrollmentId,
      () => {
        toast({ title: 'Success', description: 'Student enrollment deleted.' });
        onRefresh();
      },
      (msg) => toast({ title: 'Error', description: msg, variant: 'destructive' })
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {Object.entries(studentsByBatch).map(([batchId, { batch, students }]) => (
        <Card key={batchId}>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span className="text-base sm:text-lg">{batch.name}</span>
                <Badge variant="secondary" className="text-xs">{students.length} students</Badge>
              </CardTitle>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewStudents(students)}
                    className="w-full sm:w-auto"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View All Students
                  </Button>
                </DialogTrigger>
                <StudentListModal 
                  students={selectedStudents} 
                  loading={loading}
                />
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {students.slice(0, 6).map((enrollment) => {
                if (!enrollment.users) {
                  return (
                    <div key={enrollment.id} className="p-3 border rounded-lg bg-red-50">
                      <h4 className="font-medium text-red-500 text-sm">Invalid student data</h4>
                    </div>
                  );
                }
                return (
                  <div key={enrollment.id} className="p-3 border rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-sm sm:text-base truncate">{enrollment.users.name}</h4>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                          Phone: {enrollment.users.phone_number}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Enrolled: {new Date(enrollment.enrolled_at).toLocaleDateString()}
                        </p>
                        <Badge 
                          variant={enrollment.status === 'approved' ? "secondary" : 
                                 enrollment.status === 'rejected' ? "destructive" : 
                                 "outline"}
                          className="mt-2"
                        >
                          {enrollment.status}
                        </Badge>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        {enrollment.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => handleUpdateStatus(enrollment.id, 'approved')}
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => handleUpdateStatus(enrollment.id, 'rejected')}
                            >
                              <XCircle className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteEnrollment(enrollment.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {students.length > 6 && (
                <div className="p-3 border rounded-lg bg-gray-50 flex items-center justify-center">
                  <span className="text-sm text-gray-600">
                    +{students.length - 6} more students
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      
      {Object.keys(studentsByBatch).length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No students enrolled yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
