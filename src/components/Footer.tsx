import { Mail, MapPin, Phone } from "lucide-react";

const Footer = () => (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1: Clinic Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-emerald-400">HealthBridge Clinic</h4>
            <p className="text-gray-400 text-sm">Providing compassionate care and advanced medicine since 2015.</p>
            <div className="mt-4 flex items-center space-x-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span>123 Health Ave, City, ST</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#services" className="text-gray-400 hover:text-white transition">Our Services</a></li>
              <li><a href="#doctors" className="text-gray-400 hover:text-white transition">Meet Our Doctors</a></li>
              <li><a href="#testimonials" className="text-gray-400 hover:text-white transition">Patient Reviews</a></li>
            </ul>
          </div>

          {/* Column 3: Contact & Hours */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact & Hours</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <a href="tel:(555) 123-4567" className="text-gray-400 hover:text-white transition">(555) 123-4567</a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                <a href="mailto:info@healthbridge.com" className="text-gray-400 hover:text-white transition">info@healthbridge.com</a>
              </li>
              <li className="mt-4 text-gray-300">Mon - Fri: 8:00 AM - 5:00 PM</li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} HealthBridge Clinic. All rights reserved.
        </div>
      </div>
    </footer>
);

export default Footer