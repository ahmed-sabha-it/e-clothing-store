import React from "react";
import { useScrollToTop } from "../../utils/scrollToTop";
import { Card, CardContent } from "@/components/ui/card";
import PageTitle from "@/components/PageTitle";
import { Palette, Users, Search, Shield, Zap, Heart } from "lucide-react";

const features = [
  {
    icon: Palette,
    title: "Curated Collections",
    description: "Discover handpicked clothing from top brands and emerging designers. Our style experts curate the latest trends just for you."
  },
  {
    icon: Users,
    title: "Fashion Community",
    description: "Join thousands of fashion lovers sharing style tips, reviews, and outfit inspiration in our vibrant community."
  },
  {
    icon: Search,
    title: "Smart Search & Filters",
    description: "Find exactly what you're looking for with advanced filters by size, color, brand, price, and style preferences."
  },
  {
    icon: Shield,
    title: "Secure Shopping",
    description: "Shop with confidence using our secure payment system and buyer protection. Your personal and payment data is always safe."
  },
  {
    icon: Zap,
    title: "Fast Delivery",
    description: "Lightning-fast shipping with same-day delivery in select cities. Free shipping on orders over $50 nationwide."
  },
  {
    icon: Heart,
    title: "Wishlist & Reviews",
    description: "Save your favorite items, read authentic customer reviews, and get personalized recommendations based on your style."
  }
];

const FeaturesPage = () => {
  useScrollToTop();

  return (
    <div className="flex flex-col min-h-full animate-fade-in">
      <section className="py-12 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-800 dark:via-gray-900 dark:to-black">
        <div className="container px-4 mx-auto max-w-6xl">
          <PageTitle subtitle="Discover all the amazing features that make FashionHub your go-to destination for stylish, affordable clothing." className="animate-fade-in">
            <span className="animate-fade-in animation-delay-150">Why Shop With Us</span>
          </PageTitle>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:shadow-orange-200/40 dark:hover:shadow-orange-900/20 border-orange-200 bg-white dark:bg-gray-800 dark:border-gray-700 animate-fade-in" style={{ animationDelay: `${300 + (index * 150)}ms` }}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 text-white mr-4">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="mt-16 border-orange-200 bg-white dark:bg-gray-800 dark:border-gray-700 animate-fade-in animation-delay-1200">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent animate-fade-in animation-delay-1350">
                Ready to upgrade your wardrobe?
              </h2>
              <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto animate-fade-in animation-delay-1500">
                Join thousands of satisfied customers who trust FashionHub for quality clothing at unbeatable prices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animation-delay-1650">
                <button className="px-8 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
                  Shop Now
                </button>
                <button className="px-8 py-3 border border-border text-foreground rounded-lg font-semibold hover:bg-muted transition-all duration-300">
                  View Collections
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;
