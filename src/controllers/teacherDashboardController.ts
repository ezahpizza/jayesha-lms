import { supabase } from '@/integrations/supabase/client';

export async function fetchBatches(setBatches: (batches: any[]) => void) {
  try {
    const { data, error } = await supabase
      .from('batches')
      .select('*')
      .order('start_date', { ascending: true });
    if (error) throw error;
    setBatches(data || []);
  } catch (error) {
    console.error('Error fetching batches:', error);
  }
}

export async function fetchEnrollments(setEnrollments: (enrollments: any[]) => void, profile: any) {
  try {
    const { data, error } = await supabase
      .from('enrollments')
      .select(`*, batches:batch_id (*), users:student_id (*)`)
      .order('enrolled_at', { ascending: false });
    if (error) throw error;
    setEnrollments(data || []);
    if ((data?.length ?? 0) === 0 && profile?.role === 'teacher') {
      console.warn('No enrollments found. This may be due to RLS policy.');
    }
  } catch (error) {
    console.error('Error fetching enrollments:', error);
  }
}

export async function fetchNotices(setNotices: (notices: any[]) => void) {
  try {
    const { data, error } = await supabase
      .from('notices')
      .select(`*, batches:batch_id (*)`)
      .order('created_at', { ascending: false });
    if (error) throw error;
    setNotices(data || []);
  } catch (error) {
    console.error('Error fetching notices:', error);
  }
}

export async function fetchSubmissions(setSubmissions: (submissions: any[]) => void) {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select(`*, batches:batch_id (*), users:student_id (*)`)
      .order('submitted_at', { ascending: false });
    if (error) throw error;
    setSubmissions(data || []);
  } catch (error) {
    console.error('Error fetching submissions:', error);
  }
}

export async function createBatch(newBatch, onSuccess, onError) {
  try {
    const { error } = await supabase.from('batches').insert([newBatch]);
    if (error) throw error;
    onSuccess();
  } catch (error) {
    onError(error.message);
  }
}

export async function updateBatch(editingBatch, onSuccess, onError) {
  try {
    const { error } = await supabase.from('batches').update(editingBatch).eq('id', editingBatch.id);
    if (error) throw error;
    onSuccess();
  } catch (error) {
    onError(error.message);
  }
}

export async function deleteBatch(batchId, onSuccess, onError) {
  try {
    const { error } = await supabase.from('batches').delete().eq('id', batchId);
    if (error) throw error;
    onSuccess();
  } catch (error) {
    onError(error.message);
  }
}

export async function fetchBatchStudents(batchId, setStudents, setLoading) {
  setLoading(true);
  const { data, error } = await supabase
    .from('enrollments')
    .select('*, users:student_id (id, name, phone_number)')
    .eq('batch_id', batchId)
    .eq('status', 'approved');
  setStudents(data?.map(e => e.users).filter(Boolean) || []);
  setLoading(false);
}

export async function createNotice(newNotice, onSuccess, onError) {
  try {
    const { error } = await supabase.from('notices').insert([newNotice]);
    if (error) throw error;
    onSuccess();
  } catch (error) {
    onError(error.message);
  }
}

export async function updateEnrollmentStatus(enrollmentId, action, onSuccess, onError) {
  try {
    const { error } = await supabase.from('enrollments').update({ status: action }).eq('id', enrollmentId);
    if (error) throw error;
    onSuccess();
  } catch (error) {
    onError(error.message);
  }
}

export async function updateEnrollmentStatusAndRefresh(enrollmentId, action, onSuccess, onError, onRefresh) {
  try {
    const { error } = await supabase.from('enrollments').update({ status: action }).eq('id', enrollmentId);
    if (error) throw error;
    onSuccess();
    if (onRefresh) onRefresh();
  } catch (error) {
    onError(error.message);
  }
}

// Moves enrollment status update logic from DashboardOverview
export async function handleEnrollmentActionController(enrollmentId: string, action: 'approved' | 'rejected') {
  const { error } = await supabase
    .from('enrollments')
    .update({ status: action })
    .eq('id', enrollmentId);
  if (error) throw error;
}

// Moves submission download logic from DashboardOverview
export async function getSubmissionDownloadUrlController(pdfUrl: string): Promise<string> {
  // pdfUrl may be a path or just a filename
  const filePath = pdfUrl.startsWith('submissions/') ? pdfUrl.slice('submissions/'.length) : pdfUrl;
  const { data, error } = await supabase.storage
    .from('submissions')
    .createSignedUrl(filePath, 60);
  if (error) throw error;
  if (!data?.signedUrl) throw new Error('No signed URL returned.');
  return data.signedUrl;
}

// Moves grouping logic from StudentManagement
export function groupStudentsByBatch(enrollments: any[]) {
  return enrollments.filter(e => e.status === 'approved').reduce((acc, enrollment) => {
    const batchId = enrollment.batches.id;
    if (!acc[batchId]) {
      acc[batchId] = {
        batch: enrollment.batches,
        students: []
      };
    }
    acc[batchId].students.push(enrollment);
    return acc;
  }, {} as Record<string, { batch: any; students: any[] }>);
}

// Moves student extraction logic from StudentManagement
export function extractStudentListFromEnrollments(students: any[]): { id: string; name: string; phone_number: string }[] {
  return students
    .filter((enrollment: any) => enrollment.users)
    .map((enrollment: any) => ({
      id: enrollment.users.id,
      name: enrollment.users.name,
      phone_number: enrollment.users.phone_number
    }));
}
