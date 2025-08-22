import React from "react";
import { useScrollToTop } from "../../utils/scrollToTop";
import { Card, CardContent } from "@/components/ui/card";
import PageTitle from "@/components/PageTitle";

const TermsPage = () => {
  useScrollToTop();

  return (
    <div className="flex flex-col min-h-full animate-fade-in">
      <section className="py-12 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-800 dark:via-gray-900 dark:to-black">
        <div className="container px-4 mx-auto max-w-4xl">
          <PageTitle subtitle="Please read these terms and conditions carefully before shopping with FashionHub." className="animate-fade-in">
            Terms of Service
          </PageTitle>
          
          <Card className="mt-8 border-orange-200 bg-white dark:bg-gray-800 dark:border-gray-700 animate-fade-in animation-delay-150">
            <CardContent className="p-8 space-y-8">
              <div className="animate-fade-in animation-delay-300">
                <h2 className="text-2xl font-bold mb-4 text-foreground">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using FashionHub, you accept and agree to be bound by the terms and provision of this agreement. 
                  If you do not agree to abide by the above, please do not use this service or make any purchases.
                </p>
              </div>

              <div className="animate-fade-in animation-delay-450">
                <h2 className="text-2xl font-bold mb-4 text-foreground">2. User Accounts</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  To access certain features of the service, you must register for an account. You agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain the security of your password</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                </ul>
              </div>

              <div className="animate-fade-in animation-delay-600">
                <h2 className="text-2xl font-bold mb-4 text-foreground">3. Orders and Payments</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  When placing an order, you agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Provide accurate billing and shipping information</li>
                  <li>Pay all charges incurred by your account</li>
                  <li>Accept that prices may change without notice</li>
                  <li>Understand that orders are subject to availability</li>
                </ul>
              </div>

              <div className="animate-fade-in animation-delay-750">
                <h2 className="text-2xl font-bold mb-4 text-foreground">4. Returns and Refunds</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We offer a 30-day return policy for unworn items in original condition with tags attached. 
                  Refunds will be processed to the original payment method within 5-7 business days after we receive your return.
                </p>
              </div>

              <div className="animate-fade-in animation-delay-900">
                <h2 className="text-2xl font-bold mb-4 text-foreground">5. Privacy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, 
                  to understand our practices.
                </p>
              </div>

              <div className="animate-fade-in animation-delay-1050">
                <h2 className="text-2xl font-bold mb-4 text-foreground">6. Shipping and Delivery</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We ship to addresses within the United States. Delivery times vary by location and shipping method selected. 
                  We are not responsible for delays caused by shipping carriers or customs.
                </p>
              </div>

              <div className="pt-4 border-t border-border animate-fade-in animation-delay-1200">
                <p className="text-sm text-muted-foreground">
                  Last updated: January 2024
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default TermsPage;
