import React from "react";
import { useScrollToTop } from "../../utils/scrollToTop";
import { Card, CardContent } from "@/components/ui/card";
import PageTitle from "@/components/PageTitle";

const CookiesPage = () => {
  useScrollToTop();

  return (
    <div className="flex flex-col min-h-full animate-fade-in">
      <section className="py-12 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-800 dark:via-gray-900 dark:to-black">
        <div className="container px-4 mx-auto max-w-4xl">
          <PageTitle subtitle="Learn about how we use cookies to enhance your shopping experience on FashionHub." className="animate-fade-in">
            Cookie Policy
          </PageTitle>
          
          <Card className="mt-8 border-orange-200 bg-white dark:bg-gray-800 dark:border-gray-700 animate-fade-in animation-delay-150">
            <CardContent className="p-8 space-y-8">
              <div className="animate-fade-in animation-delay-300">
                <h2 className="text-2xl font-bold mb-4 text-foreground">What Are Cookies?</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Cookies are small text files that are stored on your device when you visit our website. 
                  They help us provide you with a better shopping experience by remembering your preferences, keeping items in your cart, and showing you relevant products.
                </p>
              </div>

              <div className="animate-fade-in animation-delay-450">
                <h2 className="text-2xl font-bold mb-4 text-foreground">Types of Cookies We Use</h2>
                
                <div className="space-y-6 animate-fade-in animation-delay-600">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">Essential Cookies</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      These cookies are necessary for the website to function properly. They enable basic features like 
                      page navigation, access to secure areas, and authentication.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">Performance Cookies</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      These cookies collect information about how visitors use our website, such as which pages are 
                      visited most often. This data helps us improve the website's performance.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">Functionality Cookies</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      These cookies remember your shopping preferences (such as size, color preferences, and wishlist items) and provide 
                      personalized product recommendations.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">Shopping Cart Cookies</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      These cookies keep track of items in your shopping cart and maintain your session security while shopping.
                    </p>
                  </div>
                </div>
              </div>

              <div className="animate-fade-in animation-delay-750">
                <h2 className="text-2xl font-bold mb-4 text-foreground">Managing Cookies</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You can control and manage cookies in several ways:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Browser settings: Most browsers allow you to refuse or accept cookies</li>
                  <li>Delete existing cookies through your browser's privacy settings</li>
                  <li>Set your browser to notify you when cookies are being sent</li>
                  <li>Use private/incognito browsing mode</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Please note that disabling certain cookies may affect the functionality of our website.
                </p>
              </div>

              <div className="animate-fade-in animation-delay-900">
                <h2 className="text-2xl font-bold mb-4 text-foreground">Third-Party Cookies</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may use third-party services (like payment processors and analytics tools) that set their own cookies. 
                  These services help us process payments securely and improve your shopping experience. We do not control these third-party cookies.
                </p>
              </div>

              <div className="animate-fade-in animation-delay-1050">
                <h2 className="text-2xl font-bold mb-4 text-foreground">Updates to This Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this cookie policy from time to time to reflect changes in our practices or 
                  for other operational, legal, or regulatory reasons.
                </p>
              </div>

              <div className="animate-fade-in animation-delay-1200">
                <h2 className="text-2xl font-bold mb-4 text-foreground">Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about our use of cookies, please contact us through our support channels.
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

export default CookiesPage;
