import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Samson Mokoena",
      role: "Student, University of Johannesburg",
      avatar: "👨‍🎓",
      rating: 5,
      testimonial: "MaliGo helped me save R500 in just 2 months! The daily missions made saving fun instead of a chore. I love how Mali reminds me to stay consistent with my savings goals.",
      achievement: "30-day streak champion",
      location: "Johannesburg, Gauteng"
    },
    {
      name: "Miche Nkosi",
      role: "Young Professional, Cape Town",
      avatar: "👩‍💼",
      rating: 5,
      testimonial: "As someone who struggled with budgeting, the budget game was a game-changer! Now I can easily tell my needs from wants. My financial literacy has improved so much.",
      achievement: "Completed 50+ missions",
      location: "Cape Town, Western Cape"
    },
    {
      name: "Chiko Banda",
      role: "Entrepreneur, Durban",
      avatar: "👨‍💼",
      rating: 5,
      testimonial: "The chat feature is incredible! Mali gives me personalized advice about my business finances. It's like having a financial mentor in my pocket 24/7.",
      achievement: "Level 15 savings expert",
      location: "Durban, KwaZulu-Natal"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-maligo-green/5 to-maligo-blue/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            What Our Early Users Say
          </h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Be part of the financial literacy movement in South Africa. 
            Start your savings journey today and see why users like Samson, Miche, and Chiko 
            are excited about MaliGo.
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
                  "{testimonial.quote || testimonial.testimonial}"
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
