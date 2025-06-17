
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, BookOpen, Users, Calendar } from 'lucide-react';

export default function Portfolio() {
  return (
    <div>
      {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl text-coral md:text-5xl font-bold mb-4">
              Meet our experienced educator
            </h1>
          </div>
        </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Section */}
        <Card className="mb-8 bg-rosaWhite shadow-lg rounded-lg">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              <div className="w-80 aspect-square overflow-hidden rounded-full">
                <img
                  src="/profile.webp"
                  alt="Jayashree Mohapatra"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Jayashree Mohapatra</h2>
                <p className="text-xl text-blue-600 mb-4">Senior Educator & Tutorial Specialist</p>
                <p className="text-gray-600 leading-relaxed">
                  With over 15 years of experience in education, I am passionate about helping students 
                  achieve their academic goals through personalized learning approaches and innovative 
                  teaching methodologies.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Qualifications */}
        <Card className="mb-8 bg-rosaWhite shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-yellow-600" />
              <span>Qualifications & Certifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Badge variant="secondary">B.Ed</Badge>
                <span>Bachelor of Education - Premier College (2013)</span>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="secondary">Certified</Badge>
                <span>Teaching Excellence Certificate (2020)</span>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="secondary">Licensed</Badge>
                <span>Professional Teaching License</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Experience & Expertise */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="bg-rosaWhite shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-green-600" />
                <span>Teaching Expertise</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Mathematics</span>
                  <Badge>Expert</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Science</span>
                  <Badge>Advanced</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Physics</span>
                  <Badge>Expert</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>English</span>
                  <Badge>Advanced</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-rosaWhite shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-600" />
                <span>Teaching Statistics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Students Taught</span>
                  <span className="font-semibold">800+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Years of Experience</span>
                  <span className="font-semibold">15+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Success Rate</span>
                  <span className="font-semibold">95%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Active Batches</span>
                  <span className="font-semibold">8</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Teaching Philosophy */}
        <Card className="mb-8 bg-rosaWhite shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle>Teaching Philosophy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="text-gray-600 leading-relaxed mb-4">
                I believe that every student has the potential to excel when provided with the right guidance, 
                support, and learning environment. My teaching approach focuses on:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Personalized learning plans tailored to individual student needs</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Interactive and engaging teaching methodologies</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Regular assessment and feedback for continuous improvement</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Building confidence and critical thinking skills</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card className="bg-rosaWhite shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-red-600" />
              <span>Teaching Schedule</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Morning Batches (During Summer holidays)</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Monday - Friday: 9:00 AM - 12:00 PM</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Evening Batches</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Monday - Friday: 5:30 PM - 7:30 PM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
