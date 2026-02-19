import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ArrowRight,
  Star,
  Award,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const footerLinks = {
    services: [
      { label: "Credit Repair", href: "/" },
      { label: "Tax Filing", href: "/" },
      { label: "Credit Monitoring", href: "/" },
      { label: "Tax Planning", href: "/" },
      { label: "Audit Protection", href: "/" },
      { label: "Business Credit", href: "/" },
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Our Team", href: "/about" },
      { label: "Referral Program", href: "/referral-program" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
      { label: "Blog", href: "/blog" },
      { label: "Success Stories", href: "#" },
    ],
    support: [
      { label: "Help Center", href: "/faq" },
      { label: "Contact Us", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Live Chat", href: "#" },
      { label: "Phone Support", href: "tel:+15551234567" },
      { label: "Knowledge Base", href: "/faq" },
      {
        label: "🏛️ Official IRS Website",
        href: "https://www.irs.gov",
        external: true,
      },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "CCPA Notice", href: "#" },
      { label: "Data Processing", href: "#" },
      { label: "Accessibility", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  const certifications = [
    { name: "BBB A+", description: "Better Business Bureau" },
    { name: "SOC 2", description: "Security Compliance" },
    { name: "PCI DSS", description: "Payment Security" },
    { name: "ISO 27001", description: "Information Security" },
  ];

  const achievements = [
    { icon: Star, value: "4.9/5", label: "Client Rating" },
    { icon: Award, value: "98%", label: "Success Rate" },
    { icon: CheckCircle2, value: "500K+", label: "Items Removed" },
  ];

  return (
    <footer className="bg-background border-t border-border">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              Stay Updated on Your Financial Journey
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Get expert tips, industry insights, and exclusive offers delivered
              to your inbox. Join 25,000+ subscribers who trust our financial
              guidance.
            </p>

            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto px-4"
            >
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                required
              />
              <Button
                type="submit"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                {isSubscribed ? (
                  "Subscribed!"
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {isSubscribed && (
              <p className="text-green-600 mt-4 font-medium">
                ✓ Thank you for subscribing! Check your email for confirmation.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div className="flex flex-wrap gap-6 sm:gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="w-full lg:flex-1 lg:min-w-[400px] space-y-4 sm:space-y-6">
            <div>
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                  <Shield className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="font-bold text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  CreditFix Pro
                </span>
              </Link>
              <p className="text-muted-foreground leading-relaxed">
                Transforming financial futures through expert credit repair and
                tax services. Trusted by 50,000+ clients nationwide with a 98%
                success rate.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="w-4 h-4 text-primary" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="w-4 h-4 text-primary" />
                <span>support@creditfixpro.com</span>
              </div>
              <div className="flex items-start space-x-3 text-sm">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span>
                  123 Financial Street
                  <br />
                  New York, NY 10001
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-semibold mb-3">Follow Us</h4>
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      className="bg-muted hover:bg-primary hover:text-primary-foreground transition-colors rounded-lg p-2"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div className="w-full lg:flex-1 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            {/* Services */}
            <div className="space-y-3">
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-3">
                {footerLinks.services.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-3">
              <h3 className="font-semibold mb-3 sm:mb-4">Company</h3>
              <ul className="space-y-2 sm:space-y-3">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-3">
              <h3 className="font-semibold mb-3 sm:mb-4">Support</h3>
              <ul className="space-y-2 sm:space-y-3">
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-3">
              <h3 className="font-semibold mb-3 sm:mb-4">Legal</h3>
              <ul className="space-y-2 sm:space-y-3">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Separator className="my-12" />

        {/* Achievements & Certifications */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Achievements */}
          <div className="flex-1">
            <h4 className="font-semibold mb-4">Our Track Record</h4>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <div key={index} className="flex-1 min-w-[100px] text-center">
                    <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
                    <div className="font-bold text-primary">
                      {achievement.value}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {achievement.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Certifications */}
          <div className="flex-1">
            <h4 className="font-semibold mb-4">Certifications & Security</h4>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              {certifications.map((cert, index) => (
                <div key={index} className="flex-1 min-w-[120px] text-center">
                  <div className="bg-muted rounded-lg p-3 mb-2">
                    <div className="font-semibold text-sm">{cert.name}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {cert.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} CreditFix Pro. All rights reserved.
            </p>
            <p className="mt-1">
              Licensed and bonded credit repair and tax services company.
            </p>
          </div>

          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <span>🔒 256-bit SSL Encryption</span>
            <span>🛡️ SOC 2 Compliant</span>
            <span>��� BBB A+ Rating</span>
          </div>
        </div>
      </div>

      {/* Emergency Contact Bar */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-600 dark:to-red-600 text-white">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-sm font-medium text-center sm:text-left">
              📞 Financial Emergency? Get immediate help:
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="bg-white text-orange-600 hover:bg-gray-100 whitespace-nowrap"
              onClick={() => (window.location.href = "tel:+15551234567")}
            >
              Call Emergency Line: (555) 123-4567
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
