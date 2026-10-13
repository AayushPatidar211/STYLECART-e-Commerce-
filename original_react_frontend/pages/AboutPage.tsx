import React from 'react';
import { ArrowRight, Sparkles, Shield, HeartHandshake, Compass } from 'lucide-react';

interface AboutPageProps {
  onContinueShopping: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onContinueShopping }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-in fade-in">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs uppercase font-mono tracking-widest text-neutral-500 font-semibold">
          Our Brand Philosophy
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-neutral-900 tracking-tight leading-tight">
          Architectural Simplicity & Uncompromising Craft
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
          Founded in 2026, StyleCart was born out of a desire to break away from ephemeral trends. We craft purposeful garments with fluid silhouettes, certified organic materials, and artisan precision.
        </p>
      </div>

      {/* Editorial Imagery */}
      <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-lg border border-neutral-200">
        <img
          src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1600&q=80"
          alt="StyleCart Atelier Craftsmanship"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
        <div className="p-6 bg-white rounded-xl border border-neutral-200 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-900">
            <Compass className="w-5 h-5 stroke-1" />
          </div>
          <h3 className="font-serif text-base font-bold text-neutral-900">Timeless Geometry</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Our patterns emphasize architectural proportion, balance, and intentional drape that look commanding across seasons.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-neutral-200 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-900">
            <HeartHandshake className="w-5 h-5 stroke-1" />
          </div>
          <h3 className="font-serif text-base font-bold text-neutral-900">Ethical Sourcing</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            From American Supima cotton to certified mulesing-free Australian merino wool, every mill partner meets strict labor transparency standards.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-neutral-200 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-900">
            <Shield className="w-5 h-5 stroke-1" />
          </div>
          <h3 className="font-serif text-base font-bold text-neutral-900">Technical Rigor</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Built as a benchmark for full-stack software development: powered by Java 17, Spring Boot 3, Spring Security, JWT, and MySQL.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-8 border-t border-neutral-200">
        <button
          onClick={onContinueShopping}
          className="px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-900 rounded hover:bg-neutral-800 transition-colors shadow-sm inline-flex items-center gap-2"
        >
          <span>Explore The Collection</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
