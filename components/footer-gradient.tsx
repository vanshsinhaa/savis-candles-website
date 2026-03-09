import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation"

export function FooterGradient() {
  return (
        <BackgroundGradientAnimation
          gradientBackgroundStart="rgb(135, 206, 235)"
          gradientBackgroundEnd="rgb(221, 160, 221)"
          firstColor="135, 206, 235"
          secondColor="176, 196, 222"
          thirdColor="221, 160, 221"
          fourthColor="255, 182, 193"
          fifthColor="186, 85, 211"
          pointerColor="138, 43, 226"
          size="80%"
          blendingValue="soft-light"
          interactive={true}
          containerClassName="min-h-screen"
        >
      {/* Content overlay */}
      <div className="relative z-10 h-full flex flex-col justify-center">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Company Info */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-white">savis candles</h3>
              <p className="text-xs sm:text-sm text-white/70">
                Handcrafted luxury candles made with premium soy wax and natural fragrances. 
                Creating moments of tranquility and warmth for your home.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-white/60 hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781h-1.418v-1.418h1.418v1.418zm-3.323 1.418c-.807 0-1.418-.611-1.418-1.418s.611-1.418 1.418-1.418 1.418.611 1.418 1.418-.611 1.418-1.418 1.418z"/>
                  </svg>
                </a>
                <a href="#" className="text-white/60 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-white/60 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="text-white/60 hover:text-white transition-colors">
                  <span className="sr-only">Pinterest</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zm-5.5 16.988c-.807 0-1.418-.611-1.418-1.418s.611-1.418 1.418-1.418 1.418.611 1.418 1.418-.611 1.418-1.418 1.418zm5.5 0c-.807 0-1.418-.611-1.418-1.418s.611-1.418 1.418-1.418 1.418.611 1.418 1.418-.611 1.418-1.418 1.418zm5.5 0c-.807 0-1.418-.611-1.418-1.418s.611-1.418 1.418-1.418 1.418.611 1.418 1.418-.611 1.418-1.418 1.418z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-white">Quick Links</h3>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li><a href="/" className="text-white/70 hover:text-white transition-colors">Home</a></li>
                <li><a href="/shop" className="text-white/70 hover:text-white transition-colors">Shop</a></li>
                <li><a href="/about" className="text-white/70 hover:text-white transition-colors">About Us</a></li>
                <li><a href="/faq" className="text-white/70 hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-white">Customer Service</h3>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Shipping Info</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Returns & Exchanges</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Size Guide</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Care Instructions</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Track Your Order</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-white">Contact Us</h3>
              <div className="space-y-2 text-xs sm:text-sm text-white/70">
                <p>📧 hello@saviscandles.com</p>
                <p>📞 (555) 123-CANDLE</p>
                <p>📍 123 Candle Lane<br />San Francisco, CA 94102</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs sm:text-sm font-medium text-white">Newsletter Signup</p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 rounded-l-md border border-white/20 bg-white/10 backdrop-blur-sm px-2 sm:px-3 py-2 text-xs sm:text-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <button className="rounded-r-md bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-2 text-xs sm:text-sm text-white hover:bg-white/30 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom section */}
          <div className="mt-8 sm:mt-12 border-t border-white/20 pt-6 sm:pt-8">
            <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
              <div className="text-xs sm:text-sm text-white/60 text-center md:text-left">
                © {new Date().getFullYear()} savis candles. All rights reserved.
              </div>
              <div className="flex flex-wrap justify-center md:justify-end gap-4 sm:gap-6 text-xs sm:text-sm">
                <a href="#" className="text-white/60 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="text-white/60 hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="text-white/60 hover:text-white transition-colors">Cookie Policy</a>
                <a href="/admin/login" className="text-white/30 hover:text-white/50 transition-colors text-xs">Admin</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BackgroundGradientAnimation>
  )
}
