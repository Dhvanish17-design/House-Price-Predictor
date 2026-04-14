import React, { useState } from 'react';
import { Building2, Globe, Mail, MessageCircle, Sparkles, Phone, Info, X, Copy, Check, Eye } from 'lucide-react';

const Footer = () => {
  const [activeSection, setActiveSection] = useState(null); // 'about', 'contact', or null
  const [copiedType, setCopiedType] = useState(null); // 'phone' or 'email'
  const [revealedEmail, setRevealedEmail] = useState(false);

  const toggleSection = (section) => {
    setActiveSection(prev => prev === section ? null : section);
  };

  const copyToClipboard = (text, type, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <footer className="mt-24 text-slate-600 dark:text-slate-300 relative z-10 w-full overflow-hidden font-['Outfit',sans-serif] pb-24 md:pb-0">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-200/50 to-transparent dark:from-[#0a0f1d] dark:to-transparent pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12 relative z-10">
        <div className="glass rounded-3xl p-8 lg:p-12 border border-slate-200 dark:border-slate-700/50 shadow-2xl backdrop-blur-xl relative overflow-hidden dark:glass-dark">
          
          {/* Subtle Glow inside glass */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8 items-start">
            
            {/* Left Section: Branding */}
            <div className="space-y-4">
              <div className="inline-flex items-center text-sky-400 mb-2">
                <Building2 size={28} strokeWidth={1.5} className="mr-2" />
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-300 to-indigo-400">SmartProp AI</span>
              </div>
              <p className="font-medium text-slate-800 dark:text-slate-200">Smart Predictions. Smarter Investments.</p>
              <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                Utilizing advanced machine learning to decode the Gujarat real estate market for those who demand precision.
              </p>
            </div>

            {/* Center Section: Discover Links */}
            <div className="flex flex-col md:items-center">
              <div>
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center">
                  Overview <Sparkles size={14} className="ml-2 text-yellow-400" />
                </h4>
                <ul className="space-y-4">
                  <li>
                    <button 
                      onClick={() => toggleSection('about')}
                      className={`text-slate-400 hover:text-sky-300 transition-all duration-300 flex items-center group relative w-fit ${activeSection === 'about' ? 'text-sky-400 tracking-wider' : ''}`}
                    >
                      <Info size={16} className="mr-2 opacity-50" />
                      About us
                      <span className={`absolute bottom-0 left-0 h-0.5 bg-sky-400 transition-all duration-300 ${activeSection === 'about' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => toggleSection('contact')}
                      className={`text-slate-400 hover:text-sky-300 transition-all duration-300 flex items-center group relative w-fit ${activeSection === 'contact' ? 'text-sky-400 tracking-wider' : ''}`}
                    >
                      <Mail size={16} className="mr-2 opacity-50" />
                      Contact Info
                      <span className={`absolute bottom-0 left-0 h-0.5 bg-sky-400 transition-all duration-300 ${activeSection === 'contact' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Section: Community */}
            <div className="flex flex-col lg:items-end">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 lg:text-right">Community</h4>
                <div className="flex space-x-4">
                  <a href="#" className="p-3 bg-slate-800/80 rounded-full border border-slate-700 hover:border-sky-400 hover:bg-sky-900/30 hover:text-sky-300 transition-all duration-300 group">
                    <Globe size={20} className="text-slate-400 group-hover:text-sky-300 transition-colors" />
                  </a>
                  <a href="mailto:dhvanishshingadiya10@gmail.com" className="p-3 bg-slate-800/80 rounded-full border border-slate-700 hover:border-indigo-400 hover:bg-indigo-900/30 hover:text-indigo-300 transition-all duration-300 group">
                    <Mail size={20} className="text-slate-400 group-hover:text-indigo-300 transition-colors" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Info Reveal Area */}
          <div className={`mt-12 overflow-hidden transition-all duration-700 ease-in-out ${activeSection ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="pt-10 border-t border-slate-200/20 dark:border-slate-700/50 relative">
              <button 
                onClick={() => setActiveSection(null)}
                className="absolute top-8 right-0 p-2 rounded-full hover:bg-white/10 text-slate-500 hover:text-white transition-all shadow-xl"
                title="Close"
              >
                <X size={20} />
              </button>

              {activeSection === 'about' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-sky-500/10 text-sky-500 text-xs font-bold uppercase tracking-widest">
                      Our Vision
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">
                      Beyond Typical Data. <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">Pure Market Intelligence.</span>
                    </h3>
                    <p className="text-slate-400 leading-relaxed text-lg">
                      SmartProp leverages advanced Random Forest modeling and real-time market trends to provide institutional-grade valuations for Gujarat's most discerning properties.
                    </p>
                    <div className="flex gap-10 pt-4">
                      <div className="space-y-1">
                        <div className="text-2xl font-black text-sky-400">93%</div>
                        <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Model precision</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-black text-indigo-400">22+</div>
                        <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Regions Covered</div>
                      </div>
                    </div>
                  </div>
                  <div className="relative group rounded-[2rem] overflow-hidden glass aspect-video shadow-2xl border border-white/10">
                    <img 
                      src="/about-building.png" 
                      alt="Modern Luxury Living"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                      <p className="text-white text-sm font-medium tracking-wide">Modern Residential Excellence</p>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'contact' && (
                <div className="flex flex-col items-center justify-center py-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="text-center space-y-4">
                    <p className="text-sky-500 dark:text-sky-400 uppercase tracking-[0.3em] font-bold text-xs mb-2">Direct Access</p>
                    <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 leading-tight tracking-tight">
                      Let's Connect with <br className="hidden md:block"/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">Dhvanish Singadiya</span>
                    </h3>
                    <div className="text-slate-800 dark:text-sky-400 text-4xl md:text-5xl font-black tracking-wider mt-3" style={{fontFamily: "'Outfit', sans-serif"}}>
                      +91 6354265512
                    </div>
                    <div className="w-16 h-1 bg-gradient-to-r from-sky-400 to-indigo-500 mx-auto rounded-full mt-6"></div>
                  </div>
                  
                  <div className="w-full max-w-md px-4 flex flex-col items-center mt-6">
                    {!revealedEmail ? (
                      <button 
                        onClick={() => setRevealedEmail(true)}
                        className="px-8 py-4 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 hover:border-indigo-400 rounded-2xl text-indigo-300 font-bold tracking-wide transition-all duration-300 flex items-center shadow-lg"
                      >
                        <Mail className="mr-3" size={20} />
                        Reveal Email Address
                      </button>
                    ) : (
                      <div className="glass p-8 rounded-[2.5rem] text-center border border-indigo-400/50 shadow-2xl relative overflow-hidden w-full group animate-in zoom-in-95 duration-300">
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => copyToClipboard('dhvanishshingadiya10@gmail.com', 'email', e)}
                            className="p-2 bg-white/10 rounded-xl hover:bg-indigo-400 hover:text-white transition-all"
                          >
                            {copiedType === 'email' ? <Check size={16} /> : <Copy size={16} />}
                          </button>
                        </div>
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-indigo-500/20 text-indigo-400 shadow-lg shadow-indigo-500/10">
                          <Mail size={32} />
                        </div>
                        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em] mb-2">Electronic Mail</p>
                        <p className="text-lg md:text-xl font-black text-white break-all">dhvanishshingadiya10@gmail.com</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 pt-8 border-t border-slate-700 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
            <p>© 2026 SmartProp AI. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
