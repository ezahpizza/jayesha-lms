import { DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';

interface StudentListModalProps {
  students: { id: string; name: string; phone_number: string }[];
  loading: boolean;
}

export function StudentListModal({ students, loading }: StudentListModalProps) {
  return (
    <DialogContent>
      <DialogTitle>Enrolled Students</DialogTitle>
      <DialogDescription>List of students enrolled in this batch.</DialogDescription>
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : students.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No students enrolled in this batch.</div>
      ) : (
        <ul className="space-y-2 mt-4">
          {students.map((student) => (
            <li key={student.id} className="border rounded p-2">
              <div className="font-medium">{student.name}</div>
              <div className="text-xs text-gray-500">Phone: {student.phone_number}</div>
            </li>
          ))}
        </ul>
      )}
      <DialogClose asChild>
      </DialogClose>
    </DialogContent>
  );
}
