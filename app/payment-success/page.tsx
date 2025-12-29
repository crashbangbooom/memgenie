// app/payment-success/page.tsx

'use client';
import { CheckCircle, Download, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import Maxwidth from '@/components/Maxwidth';

export default function PaymentSuccess() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-700">
      <Maxwidth className="max-w-md py-8">
        <Card className="bg-gray-800 border border-green-500">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-green-500 text-lg">
              Payment Successful!
            </CardTitle>
            <CardDescription className="text-white">
              Thank you for your purchase. Your subscription has been activated
              successfully.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Next Steps */}
            <div className="space-y-4">
              <div className="space-y-3">
                <Button
                  className="w-full bg-yellow-500/30 text-yellow-500 hover:bg-yellow-500/30 border border-yellow-500 hover:text-yellow-600"
                  onClick={() =>
                    (window.location.href = 'https://memgenie.net/')
                  }
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Continue
                </Button>

                {/* <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download Receipt
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Receipt
                </Button>
              </div> */}
              </div>
            </div>

            {/* Additional Info */}
            {/* <div className="bg-blue-50 p-4 rounded-lg">
            <p className="font-sm text-blue-800">
              <strong>Important:</strong> A confirmation email has been sent to
              your registered email address. Please keep this for your records.
            </p>
          </div> */}

            {/* Support */}
            {/* <div className="text-center pt-4">
            <p className="font-sm text-gray-600">
              Need help?{' '}
              <a
                href="#"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Contact Support
              </a>
            </p>
          </div> */}
          </CardContent>
        </Card>
      </Maxwidth>
    </div>
  );
}
