import { motion } from "framer-motion";
import SectionWrapper from "../ui/SectionWrapper";
import SectionHeading from "../ui/SectionHeading";
import AnimatedButton from "../ui/AnimatedButton";
import { Check, Star, MessageCircle } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/919606664929";

const websitePlans = [
  {
    id: "basic-website",
    name: "Basic Website",
    price: "₹8,499",
    emoji: "🌐",
    badge: null,
    description: "Perfect for startups and small businesses.",
    features: [
      "Fully responsive design",
      "Up to 5 pages",
      "Contact form",
      "WhatsApp / Call integration",
      "Google Maps",
      "Basic SEO",
    ],
    cta: "Build My Website",
    gradient: "from-emerald-500/10 to-green-500/10",
    borderColor: "border-emerald-500/30",
  },
  {
    id: "premium-website",
    name: "Premium Website",
    price: "₹9,999",
    emoji: "⭐",
    badge: "MOST CHOSEN",
    description: "Ideal for businesses serious about online growth.",
    features: [
      "Everything in Basic +",
      "Up to 10 pages",
      "Advanced animations",
      "Performance optimization",
      "Priority support",
      "SEO enhanced",
    ],
    cta: "Build Premium Website",
    gradient: "from-primary/10 to-red-600/10",
    borderColor: "border-primary/40",
  },
  {
    id: "custom-website",
    name: "Custom Website",
    price: "Let's Talk",
    emoji: "🛠",
    badge: null,
    description: "For businesses needing CMS, e-commerce, or custom features.",
    features: [
      "WordPress CMS",
      "E-commerce ready",
      "Custom features",
      "Blog system",
      "Ongoing support",
      "Scalable architecture",
    ],
    cta: "Contact Us",
    gradient: "from-blue-500/10 to-cyan-500/10",
    borderColor: "border-blue-500/30",
  },
];

const WebsitePricingSection = () => {
  return (
    <SectionWrapper id="website-pricing" className="bg-card/20">
      <SectionHeading
        title="Website Pricing"
        subtitle="Professional websites that fit your budget. Simple, transparent pricing."
        gradient
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {websitePlans.map((plan, index) => (
          <motion.div
            id={plan.id}
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className={`relative h-full p-8 rounded-2xl border backdrop-blur-sm overflow-hidden group transition-all duration-500 bg-gradient-to-br ${plan.gradient} ${plan.borderColor} ${
              plan.badge ? "ring-2 ring-primary/20" : ""
            }`}
          >
            {/* Badge */}
            {plan.badge && (
              <div className="absolute -top-1 -right-1">
                <div className="flex items-center gap-1 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-bl-xl rounded-tr-xl animate-glow">
                  <Star className="w-3 h-3 fill-current" />
                  {plan.badge}
                </div>
              </div>
            )}

            {/* Glow for featured plan */}
            {plan.badge && (
              <div className="absolute inset-0 rounded-2xl glow-primary-subtle" />
            )}

            {/* Plan emoji & name */}
            <div className="relative z-10 flex items-center gap-3 mb-4">
              <span className="text-3xl">{plan.emoji}</span>
              <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
            </div>

            {/* Price */}
            <div className="relative z-10 mb-4">
              <span className={`text-4xl font-bold ${plan.badge ? "gradient-text" : "text-foreground"}`}>
                {plan.price}
              </span>
            </div>

            {/* Description */}
            <p className="relative z-10 text-muted-foreground text-sm mb-6">{plan.description}</p>

            {/* Features */}
            <ul className="relative z-10 space-y-3 mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.badge ? "text-primary" : "text-emerald-500"}`} />
                  <span className="text-foreground/90">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="relative z-10 mt-auto">
              <AnimatedButton
                href={`${WHATSAPP_URL}?text=Hi! I'm interested in the ${plan.name} (${plan.price})`}
                external
                variant={plan.badge ? "primary" : "secondary"}
                className="w-full justify-center"
              >
                <MessageCircle className="w-4 h-4" />
                {plan.cta}
              </AnimatedButton>
            </div>

            {/* Glow effect */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 rounded-full filter blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default WebsitePricingSection;
