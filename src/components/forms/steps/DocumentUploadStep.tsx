import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, FileText, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DocumentUploadStepProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  acceptedTypes: string[];
  documentType: string;
  onDataExtracted: (data: any) => void;
  extractedData?: any;
}

export function DocumentUploadStep({
  title,
  description,
  icon,
  acceptedTypes,
  documentType,
  onDataExtracted,
  extractedData
}: DocumentUploadStepProps) {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const base64 = reader.result as string;
        
        // Call edge function to parse and extract data
        const { data, error } = await supabase.functions.invoke('parse-document', {
          body: {
            file: base64,
            fileName: file.name,
            documentType: documentType
          }
        });

        if (error) throw error;

        onDataExtracted(data.extractedData);
        
        toast({
          title: "Document processed successfully",
          description: "Your information has been extracted and populated.",
        });
      };

      reader.onerror = () => {
        throw new Error("Failed to read file");
      };

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to process document",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center space-x-2">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{description}</p>
        
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          {!extractedData ? (
            <>
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <Label htmlFor={`file-${documentType}`} className="cursor-pointer">
                <div className="text-sm font-medium mb-2">
                  {file ? file.name : "Choose a file or drag it here"}
                </div>
                <input
                  id={`file-${documentType}`}
                  type="file"
                  accept={acceptedTypes.join(',')}
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="text-xs text-muted-foreground">
                  Accepted: {acceptedTypes.join(', ')}
                </div>
              </Label>
              
              {file && (
                <Button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="mt-4"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Upload & Analyze
                    </>
                  )}
                </Button>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <CheckCircle2 className="w-12 h-12 mx-auto text-success" />
              <div className="text-sm font-medium text-success">
                Document processed successfully
              </div>
              <div className="text-xs text-muted-foreground">
                Data has been extracted and populated in the form
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setFile(null);
                  onDataExtracted(null);
                }}
              >
                Upload Different Document
              </Button>
            </div>
          )}
        </div>

        <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <strong>Supported documents:</strong> Bank statements, pay stubs, tax returns, 
              invoices, platform earnings reports, utility bills, and other financial documents.
              Our AI will automatically extract relevant information.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
