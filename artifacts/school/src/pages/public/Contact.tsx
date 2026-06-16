import { useGetSchoolInfo, useGetContact } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, MapPin, Phone, Mail, Globe, Facebook, Youtube } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Contact() {
  const { data: contact, isLoading: isContactLoading } = useGetContact();
  const { data: school, isLoading: isSchoolLoading } = useGetSchoolInfo();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-primary mb-8 text-center">Contact Us</h1>
      
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <Card>
            <CardContent className="p-6 space-y-6">
              <h2 className="text-2xl font-semibold mb-4 text-primary">Get in Touch</h2>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-full text-primary shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                  <div className="text-gray-600">
                    {isSchoolLoading ? <Skeleton className="h-4 w-48" /> : school?.address || "Khadodi Borvai, Gujarat"}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-full text-primary shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Phone & WhatsApp</h3>
                  <div className="text-gray-600">
                    {isContactLoading ? <Skeleton className="h-4 w-32" /> : contact?.phone || "+91 00000 00000"}
                  </div>
                  {contact?.whatsappNumber && (
                    <p className="text-gray-600 mt-1">WhatsApp: {contact.whatsappNumber}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-full text-primary shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <div className="text-gray-600">
                    {isContactLoading ? <Skeleton className="h-4 w-48" /> : contact?.email || "dvpatelhighschool@gmail.com"}
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>

          {(contact?.facebookUrl || contact?.youtubeUrl) && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-primary">Social Media</h3>
                <div className="flex gap-4">
                  {contact.facebookUrl && (
                    <a href={contact.facebookUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md transition-colors">
                      <Facebook size={20} />
                      <span className="font-medium">Facebook</span>
                    </a>
                  )}
                  {contact.youtubeUrl && (
                    <a href={contact.youtubeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-md transition-colors">
                      <Youtube size={20} />
                      <span className="font-medium">YouTube</span>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card className="h-full overflow-hidden">
            <CardContent className="p-0 h-full min-h-[400px]">
              {contact?.mapLink ? (
                <div 
                  className="w-full h-full min-h-[400px]"
                  dangerouslySetInnerHTML={{ __html: contact.mapLink }}
                />
              ) : (
                <div className="w-full h-full min-h-[400px] bg-gray-100 flex items-center justify-center text-gray-500">
                  Map Not Available
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
