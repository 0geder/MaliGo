
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Thabo M.",
      location: "Johannesburg",
      quote: "Mali helped me save R500 in my first month! The daily challenges make it feel like a game, not a chore.",
      avatar: "👨🏿‍🎓"
    },
    {
      name: "Nomsa K.",
      location: "Cape Town", 
      quote: "I love that I can use MaliGo on my old phone with USSD. Mali's messages always make me smile while I save.",
      avatar: "👩🏿‍💼"
    },
    {
      name: "Sipho R.",
      location: "Durban",
      quote: "The budgeting games taught me more about money in 2 weeks than I learned in years. Mali is like having a financial friend!",
      avatar: "👨🏿‍💻"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-maligo-green/5 to-maligo-blue/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            What Early Users Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of South Africans who are already transforming their 
            financial habits with Mali's help.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div>
                    <CardTitle className="text-lg text-gray-900">{testimonial.name}</CardTitle>
                    <CardDescription className="text-maligo-green">{testimonial.location}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 italic leading-relaxed">
                  "{testimonial.quote}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
