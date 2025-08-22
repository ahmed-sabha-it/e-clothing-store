import React from "react";
import { useScrollToTop } from "../../utils/scrollToTop";
import { Card, CardContent } from "@/components/ui/card";
import PageTitle from "@/components/PageTitle";

const PrivacyPage = () => {
  useScrollToTop();

  return (
    <div className="flex flex-col min-h-full animate-fade-in">
      <section className="py-12 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-800 dark:via-gray-900 dark:to-black">
        <div className="container px-4 mx-auto max-w-4xl">
          <PageTitle subtitle="Learn how FashionHub collects, uses, and protects your personal information when shopping with us." className="animate-fade-in">
            Privacy Policy
          </PageTitle>
          
          <Card className="mt-8 border-orange-200 bg-white dark:bg-gray-800 dark:border-gray-700 animate-fade-in animation-delay-150">
            <CardContent className="p-8 space-y-8">
              <div className="animate-fade-in animation-delay-300">
                <h2 className="text-2xl font-bold mb-4 text-foreground">Information We Collect</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We collect information you provide directly to us, such as when you create an account, upload content, or contact us:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Account information (name, email, shipping address)</li>
                  <li>Order history and purchase preferences</li>
                  <li>Product reviews and ratings</li>
                  <li>Communication with our customer service team</li>
                  <li>Payment information (processed securely by our payment partners)</li>
                </ul>
              </div>

              <div className="animate-fade-in animation-delay-450">
                <h2 className="text-2xl font-bold mb-4 text-foreground">How We Use Your Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Process and fulfill your orders</li>
                  <li>Process payments and send transaction confirmations</li>
                  <li>Send order updates, shipping notifications, and delivery confirmations</li>
                  <li>Provide customer support and respond to inquiries</li>
                  <li>Send promotional offers and product recommendations (with your consent)</li>
                  <li>Improve our products, services, and shopping experience</li>
                </ul>
              </div>

              <div className="animate-fade-in animation-delay-600">
                <h2 className="text-2xl font-bold mb-4 text-foreground">Information Sharing</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, 
                  except as described in this policy. We may share information in response to legal requests or to protect our rights.
                </p>
              </div>

              <div className="animate-fade-in animation-delay-750">
                <h2 className="text-2xl font-bold mb-4 text-foreground">Data Security</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement appropriate security measures to protect your personal information against unauthorized access, 
                  alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
                </p>
              </div>

              <div className="animate-fade-in animation-delay-900">
                <h2 className="text-2xl font-bold mb-4 text-foreground">Your Rights</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Access and update your personal information</li>
                  <li>Delete your account and associated data</li>
                  <li>Opt out of certain communications</li>
                  <li>Request a copy of your data</li>
                </ul>
              </div>

              <div className="animate-fade-in animation-delay-1050">
                <h2 className="text-2xl font-bold mb-4 text-foreground">Cookies</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use cookies to remember your shopping preferences, keep items in your cart, and provide personalized product recommendations. 
                  You can control cookie settings through your browser preferences, but some features may not work properly if disabled.
                </p>
              </div>

              <div className="animate-fade-in animation-delay-1200">
                <h2 className="text-2xl font-bold mb-4 text-foreground">Changes to This Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page 
                  and updating the "Last updated" date.
                </p>
              </div>

              <div className="pt-4 border-t border-border animate-fade-in animation-delay-1350">
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

export default PrivacyPage;
