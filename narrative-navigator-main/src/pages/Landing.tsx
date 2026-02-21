import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Sparkles,
  PenTool,
  BarChart3,
  Shield,
  Zap,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Play,
} from "lucide-react";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import MetricsSection from "@/components/landing/MetricsSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import CTASection from "@/components/landing/CTASection";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-semibold text-lg tracking-tight">
              AI Writer
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#metrics" className="hover:text-foreground transition-colors">Results</a>
          </nav>
          <Link to="/editor">
            <Button size="sm" className="rounded-full px-5">
              Open Editor <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </header>

      <HeroSection />
      <MetricsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <span className="font-semibold tracking-tight">AI Writer</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} AI Writer. Crafted for writers who demand excellence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
