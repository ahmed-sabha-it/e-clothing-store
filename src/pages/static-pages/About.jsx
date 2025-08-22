import React from "react";
import { useScrollToTop } from "../../utils/scrollToTop";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Heart, Award } from "lucide-react";

const About = () => {
  useScrollToTop();

  const features = [
    {
      icon: Users,
      title: "Fashion Community",
      description: "Join thousands of fashion lovers discovering the latest trends and timeless styles."
    },
    {
      icon: Target,
      title: "Curated Collections",
      description: "Handpicked clothing from top brands and emerging designers for every occasion."
    },
    {
      icon: Heart,
      title: "Personal Style",
      description: "Express your unique fashion sense with our diverse range of clothing and accessories."
    },
    {
      icon: Award,
      title: "Quality Guarantee",
      description: "Premium quality clothing with hassle-free returns and exceptional customer service."
    }
  ];

  return (
    <div className="flex flex-col min-h-full animate-fade-in">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-800 dark:via-gray-900 dark:to-black">
        <div className="container px-4 mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              About FashionHub
            </span>
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-8 animate-fade-in animation-delay-150">
            Your premier destination for trendy, affordable, and high-quality clothing. 
            Discover fashion that fits your style, budget, and lifestyle.
          </p>
          <Button size="lg" variant="primary" className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 animate-fade-in animation-delay-300">
            Shop Now
          </Button>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 text-foreground animate-fade-in animation-delay-450">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-8 animate-fade-in animation-delay-600">
              At FashionHub, we believe that great style shouldn't break the bank. Our mission is to 
              make fashionable, high-quality clothing accessible to everyone. We carefully curate 
              collections from trusted brands and emerging designers to bring you the perfect blend 
              of style, comfort, and affordability.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-800 dark:via-gray-900 dark:to-black">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground animate-fade-in animation-delay-750">Why Shop With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="text-center border-orange-200 bg-white dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${900 + (index * 150)}ms` }}
              >
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 text-foreground animate-fade-in animation-delay-1500">Our Story</h2>
            <p className="text-lg text-muted-foreground mb-8 animate-fade-in animation-delay-1650">
              Founded in 2024, FashionHub started with a simple vision: to create an online 
              clothing store that combines style, quality, and affordability. What began as a 
              small collection of carefully selected pieces has grown into a comprehensive 
              fashion destination serving style-conscious customers worldwide.
            </p>
            <p className="text-lg text-muted-foreground animate-fade-in animation-delay-1800">
              Today, we're proud to offer thousands of clothing items from casual wear to formal 
              attire, helping our customers express their personal style while staying within 
              their budget. Every piece in our collection is chosen with care, ensuring you get 
              the best value for your money.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-800 dark:via-gray-900 dark:to-black">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 animate-fade-in animation-delay-1950">
            <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Ready to Upgrade Your Wardrobe?
            </span>
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto animate-fade-in animation-delay-2100">
            Discover your new favorite pieces and enjoy free shipping on orders over $50.
          </p>
          <div className="space-x-4 animate-fade-in animation-delay-2250">
            <Button size="lg" className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white">
              Shop Collection
            </Button>
            <Button size="lg" variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white dark:border-orange-400 dark:text-orange-400 dark:hover:bg-orange-400 dark:hover:text-gray-900">
              View Deals
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
