import React from 'react';
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, payload?: any) => void;
  onOpenInspector: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenInspector }) => {
  return (
    <footer className="bg-neutral-900 text-neutral-300 pt-16 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-800">
          {/* Brand & Story */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-serif text-2xl font-bold text-white tracking-tight">FashionHub</h2>
            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
              Curated modern clothing and timeless fashion crafted with premium fabrics, architectural silhouettes, and ethical production standards.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <a href="#" className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-white hover:text-neutral-950 flex items-center justify-center transition-colors text-neutral-400">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-white hover:text-neutral-950 flex items-center justify-center transition-colors text-neutral-400">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-white hover:text-neutral-950 flex items-center justify-center transition-colors text-neutral-400">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
            <div className="pt-4">
              <button
                onClick={onOpenInspector}
                className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 hover:text-emerald-300 border border-emerald-900/60 bg-emerald-950/40 px-3 py-1.5 rounded transition-colors"
              >
                <span>Java 17 + Spring Boot 3 + MySQL Architecture</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase font-mono tracking-widest text-white font-semibold">Collections</h3>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <button onClick={() => onNavigate('category', 'Men')} className="hover:text-white transition-colors">
                  Men's Fashion
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('category', 'Women')} className="hover:text-white transition-colors">
                  Women's Dresses & Tops
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('category', 'Kids')} className="hover:text-white transition-colors">
                  Kids Organic Wear
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('category', 'Shoes')} className="hover:text-white transition-colors">
                  Footwear & Boots
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('category', 'Accessories')} className="hover:text-white transition-colors">
                  Leather Accessories
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase font-mono tracking-widest text-white font-semibold">Customer Service</h3>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <button onClick={() => onNavigate('orders')} className="hover:text-white transition-colors">
                  Track Your Order
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                  Shipping & Delivery
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                  30-Day Easy Returns
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  Garment Care & Fabric
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                  Contact Support
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase font-mono tracking-widest text-white font-semibold">Company</h3>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  About StyleCart
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  Sustainability Pledge
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                  Store Locator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                  Privacy Policy & Terms
                </button>
              </li>
            </ul>
            <div className="pt-2 text-xs text-neutral-400 space-y-1">
              <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-neutral-500" /> New York, NY 10001</p>
              <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-neutral-500" /> support@stylecart.com</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© 2026 StyleCart Inc. All rights reserved. Full-Stack Java Spring Boot & React Platform.</p>
          <div className="flex items-center gap-6">
            <span>Spring Boot 3.3.0</span>
            <span>·</span>
            <span>MySQL 8.0</span>
            <span>·</span>
            <span>Spring Security JWT</span>
            <span>·</span>
            <span>Hibernate JPA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
