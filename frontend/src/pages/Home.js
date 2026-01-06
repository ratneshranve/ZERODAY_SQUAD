import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, AlertTriangle, BarChart3, Users, Droplets, Shield, Zap, Eye } from 'lucide-react';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Real-time Monitoring",
      description: "Track water quality across Indore with live data and instant alerts for pollution detection.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Citizen Reports",
      description: "Empower citizens to report pollution issues directly through our intuitive mobile app.",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "AI Prediction",
      description: "Advanced algorithms predict pollution spread and alert authorities before it becomes critical.",
      color: "from-purple-500 to-indigo-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    }
  ];

  const stats = [
    { number: "500+", label: "Monitoring Points", icon: <MapPin className="w-5 h-5" /> },
    { number: "10K+", label: "Active Users", icon: <Users className="w-5 h-5" /> },
    { number: "95%", label: "Accuracy Rate", icon: <BarChart3 className="w-5 h-5" /> },
    { number: "24/7", label: "Monitoring", icon: <Eye className="w-5 h-5" /> }
  ];

  const slides = [
    {
      title: "Clean Water for Indore",
      subtitle: "Advanced pollution detection and real-time monitoring",
      image: "🌊",
      gradient: "from-blue-600 via-cyan-500 to-teal-400"
    },
    {
      title: "AI-Powered Alerts",
      subtitle: "Predictive analytics for proactive water quality management",
      image: "🤖",
      gradient: "from-purple-600 via-pink-500 to-red-400"
    },
    {
      title: "Community Driven",
      subtitle: "Citizens working together for a healthier Indore",
      image: "👥",
      gradient: "from-green-600 via-emerald-500 to-teal-400"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section with Slideshow */}
      <div className={`relative overflow-hidden transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-indigo-900/60"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                <Droplets className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">
                Aqua Safe
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
                 
                </span>
              </h1>
            </div>

            {/* Slideshow */}
            <div className="relative mb-12">
              <div className="h-64 flex items-center justify-center">
                {slides.map((slide, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-1000 transform ${
                      index === currentSlide
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 translate-y-8 scale-95'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-8xl mb-4 animate-bounce">{slide.image}</div>
                      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                        {slide.title}
                      </h2>
                      <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        {slide.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Slide indicators */}
              <div className="flex justify-center space-x-2 mt-8">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/report">
                <button className="group relative px-8 py-4 bg-white text-blue-600 font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <span className="relative z-10">Report Issue</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <div className="text-white">{stat.icon}</div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-b from-white to-blue-50 relative" style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="absolute inset-0 bg-white/85"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our System?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of water quality monitoring with cutting-edge technology and community-driven solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative ${feature.bgColor} ${feature.borderColor} border-2 rounded-2xl p-8 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 cursor-pointer`}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 relative" style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-cyan-900/80 to-teal-900/80"></div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <Shield className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-6">
            Join the Movement for Clean Water
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Be part of Indore's water quality revolution. Report issues, stay informed, and help create a healthier city for everyone.
          </p>
          
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 relative" style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="absolute inset-0 bg-gray-900/90"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center mb-4">
                <Droplets className="w-8 h-8 text-blue-400 mr-3" />
                <span className="text-2xl font-bold">Aqua Safe</span>
              </div>
              <p className="text-gray-400 mb-4">
                Protecting Indore's water resources through technology and community engagement.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                  📱
                </div>
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                  🌐
                </div>
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                  📧
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white transition-colors text-left">About Us</button></li>
                <li><button className="hover:text-white transition-colors text-left">How It Works</button></li>
                <li><button className="hover:text-white transition-colors text-left">Contact</button></li>
                <li><button className="hover:text-white transition-colors text-left">Support</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white transition-colors text-left">API Docs</button></li>
                <li><button className="hover:text-white transition-colors text-left">Privacy Policy</button></li>
                <li><button className="hover:text-white transition-colors text-left">Terms of Service</button></li>
                <li><button className="hover:text-white transition-colors text-left">Help Center</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Aqua Safe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;