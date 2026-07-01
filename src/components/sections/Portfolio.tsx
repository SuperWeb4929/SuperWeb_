import SpotlightCard from "../ui/SpotlightCard";
import { ExternalLink, Layers, GraduationCap, LayoutPanelLeft } from "lucide-react";

const projects = [
  {
    title: "Twinkling Petals",
    category: "Preschool & Daycare",
    description: "A colorful, joyful digital platform for Twinkling Petals Pre-School in Bengaluru, featuring a play-based curriculum and online parent enquiry integrations.",
    tags: ["Creative Learning", "Play-based", "Responsive Design"],
    icon: GraduationCap,
    glowColor: "rgba(244, 63, 94, 0.15)", // Blossom Pink
    color: "from-rose-600/10 to-transparent",
    link: "https://twinklingpetals.com",
  },
  {
    title: "Little Junior DPS",
    category: "Preschool & Daycare",
    description: "An interactive, playful website designed for Little Junior DPS, showcasing school facilities, parent trust parameters, and program curriculum guides.",
    tags: ["Preschool Portal", "School Directory", "Interactive Cards"],
    icon: Layers,
    glowColor: "rgba(59, 130, 246, 0.15)", // Blue
    color: "from-blue-600/10 to-transparent",
    link: "https://littlejuniordps.com",
  },
  {
    title: "Zoro.AI",
    category: "AI Chatbot / Landing Page",
    description: "A sarcastic, personality-first conversational companion landing page built using the Llama 3.3 70B model on the Groq API framework.",
    tags: ["AI Chatbot", "Llama 3.3 70B", "Groq API Integration"],
    icon: LayoutPanelLeft,
    glowColor: "rgba(34, 197, 94, 0.15)", // Emerald
    color: "from-emerald-600/10 to-transparent",
    link: "https://zoro-landingpage-o8td.onrender.com",
  },
];

export const Portfolio = () => {
  return (
    <section id="portfolio" className="relative py-24 bg-[#0A0A0A] text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans">
            Our{" "}
            <span className="bg-gradient-to-r from-blue-500 to-sky-400 bg-clip-text text-transparent">
              Featured Work
            </span>
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            Take a look at the portals, school systems, and business platforms we've built to streamline operations and drive growth.
          </p>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <SpotlightCard
              key={project.title}
              glowColor={project.glowColor}
              className="p-8 border border-white/5 bg-[#121212]/50 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Colored background effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-30 pointer-events-none`} />

              <div className="relative z-10 space-y-6">
                {/* Icon & Category */}
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-white/5 text-gray-300">
                    <project.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                    {project.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold font-sans text-white group-hover:text-blue-400 transition-colors duration-300">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-400 leading-relaxed">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded bg-white/5 text-gray-400 border border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* View Demo / Button */}
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 pt-8 mt-auto flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 cursor-pointer transition-colors duration-200"
              >
                <span>Visit Live Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
