
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import FeatureCarouselEnhanced from "./FeatureCarouselEnhanced";

const Features = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why MaliGo Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Mali the Meerkat makes saving money fun, accessible, and rewarding for everyone - 
            from smartphone users to those with feature phones.
          </p>
        </div>
        
        <FeatureCarouselEnhanced />
      </div>
    </section>
  );
};

export default Features;
