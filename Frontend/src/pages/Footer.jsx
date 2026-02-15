import React from "react";

const Footer = () => {
  const quickLinks = ["Home", "Hotels", "About", "Contact"];
  const hostLinks = ["List Property", "Resources", "Pricing"];
  const legalLinks = ["Privacy Policy", "Terms"];
  return (
    <footer className="bg-[#0A0E27] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo + Description */}
        <div>
          <h2 className="text-2xl font-bold">DesiNest</h2>

          <p className="text-gray-400 mt-4 leading-relaxed">
            Your trusted partner for discovering beautiful stays across India
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold mb-4">Quick Links</h3>

          {quickLinks.map((link, index) => (
            <p
              key={index}
              className="text-gray-400 mb-2 hover:text-white cursor-pointer transition font-semibold"
            >
              {link}
            </p>
          ))}
        </div>

        {/* For Hosts */}
        <div>
          <h3 className="font-bold mb-4">For Hosts</h3>

          {hostLinks.map((link, index) => (
            <p
              key={index}
              className="text-gray-400 mb-2 hover:text-white cursor-pointer transition font-semibold"
            >
              {link}
            </p>
          ))}
        </div>

        {/* Legal */}
        <div>
          <h3 className="font-bold mb-4">Legal</h3>

          {legalLinks.map((link, index) => (
            <p
              key={index}
              className="text-gray-400 mb-2 hover:text-white cursor-pointer transition font-semibold"
            >
              {link}
            </p>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-12"></div>

      {/* Bottom */}
      <div className="text-center text-gray-400 mt-6">
        © 2026 DesiNest. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
