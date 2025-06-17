import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, BookOpen, Bell, User } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Notice {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

interface Batch {
  id: string;
  name: string;
  description: string;
  start_date: string;
}

export default function Home() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);

  useEffect(() => {
    fetchPublicNotices();
    fetchBatches();
  }, []);

  const fetchPublicNotices = async () => {
    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .is('batch_id', null)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setNotices(data || []);
    } catch (error) {
      console.error('Error fetching notices:', error);
    }
  };

  const fetchBatches = async () => {
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
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to Jaya LMS
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Empowering students through quality education and personalized learning
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Notice Board */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-blue-600" />
                <span>Notice Board</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {notices.length > 0 ? (
                <div className="space-y-4">
                  {notices.map((notice) => (
                    <div key={notice.id} className="border-l-4 border-blue-500 pl-4 py-2">
                      <h3 className="font-semibold text-gray-900">{notice.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{notice.content}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {formatDate(notice.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No notices available</p>
              )}
            </CardContent>
          </Card>

          {/* Available Batches */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-green-600" />
                <span>Available Batches</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {batches.length > 0 ? (
                <div className="space-y-4">
                  {batches.map((batch) => (
                    <div key={batch.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{batch.name}</h3>
                        <Badge variant="outline">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(batch.start_date)}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm">{batch.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No batches available</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Jaya LMS?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Education</h3>
              <p className="text-gray-600">Expert-designed curriculum and personalized learning paths</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <User className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Teachers</h3>
              <p className="text-gray-600">Learn from experienced professionals in your field</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Bell className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Stay Updated</h3>
              <p className="text-gray-600">Real-time notifications and progress tracking</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
