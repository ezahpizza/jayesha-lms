import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, BookOpen, Bell, User } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { ImageCarousel } from '@/components/ui/ImageCarousel';
import { Snowfall } from '@/components/ui/Snowfall';

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
  <div>
      <Snowfall />
      {/* Hero Section */}
      <div className="text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to JayaLearn
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
          <Card className="bg-coral shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-blue-600" />
                <span className="font-bold">Notice Board</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {notices.length > 0 ? (
                <div className="space-y-4">
                  {notices.map((notice) => (
                    <div key={notice.id} className="border-l-4 border-tanBlack pl-4 py-2">
                      <h3 className="font-bold text-2xl text-tanBlack.">{notice.title}</h3>
                      <p className="font-semibold text-lg text-tanBlack mt-1">{notice.content}</p>
                      <p className="font-semibold text-sm text-tanBlack mt-2">
                        {formatDate(notice.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-tanBlack">No notices available</p>
              )}
            </CardContent>
          </Card>

          {/* Available Batches */}
          <Card className="bg-coral shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-green-600" />
                <span  className="font-bold">Available Batches</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {batches.length > 0 ? (
                <div className="space-y-4">
                  {batches.map((batch) => (
                    <div key={batch.id} className="border border-tanBlack rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-2xl text-tanBlack.">{batch.name}</h3>
                        <Badge variant="outline">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(batch.start_date)}
                        </Badge>
                      </div>
                      <p className="text-tanBlack text-lg">{batch.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-tanBlack">No batches available</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Carousel Section */}
      <ImageCarousel />
    </div>
  );
}
