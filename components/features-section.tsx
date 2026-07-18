"use client"

import { MessageSquare, FileText, BookOpen, Calendar, Search, Lightbulb } from "lucide-react"

const features = [
  {
    icon: MessageSquare,
    title: "AI Chat",
    description: "Get instant answers to your academic questions with our intelligent chatbot",
  },
  {
    icon: FileText,
    title: "PYQs",
    description: "Access previous year questions to practice and prepare for exams",
  },
  {
    icon: BookOpen,
    title: "Notes Assistant",
    description: "Organized and comprehensive notes for all your courses",
  },
  {
    icon: Calendar,
    title: "Semester Syllabus",
    description: "Complete syllabus overview for each semester",
  },
  {
    icon: Search,
    title: "Smart Search",
    description: "Find exactly what you need with intelligent search functionality",
  },
  {
    icon: Lightbulb,
    title: "Study Planner",
    description: "Create personalized study plans and track your progress",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 px-6 bg-background">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-[0.05] grid-background" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-[var(--font-heading)] tracking-tight">
            Suggested Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to excel in your engineering studies
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="card-3d group bg-gradient-to-br from-secondary/50 via-secondary/30 to-secondary/20 backdrop-blur-xl rounded-2xl border border-border/50 p-8 hover:border-border/80 transition-all duration-300"
              >
                <div className="mb-6">
                  <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-3 font-[var(--font-heading)]">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
