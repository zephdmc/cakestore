export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600">
            Protecting your privacy while you enjoy our crafted creations
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-pink-500"></div>
              <span className="text-sm text-gray-600">Crafted Cakes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <span className="text-sm text-gray-600">Scented Candles</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-600">Personalized Mugs</span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-purple-100">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 p-6 md:p-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-2xl font-bold">Stefanos Bakeshop</h2>
                <p className="text-purple-100 mt-1">Crafting moments you can taste, scent & hold</p>
              </div>
              <div className="mt-4 md:mt-0 text-right">
                <p className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full inline-block">
                  Effective: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 lg:p-10">
            {/* Introduction */}
            <div className="prose prose-lg max-w-none">
              <div className="bg-purple-50 rounded-xl p-6 mb-8 border-l-4 border-purple-500">
                <p className="text-gray-700">
                  At <span className="font-semibold text-purple-600">Stefanos Bakeshop</span>, we are committed to protecting your privacy while you explore and purchase our handcrafted collection of themed cakes, luxury scented candles, and personalized glass mugs. This Privacy Policy explains how we collect, use, and protect your personal information across all our product categories.
                </p>
              </div>

              <div className="space-y-10">
                {/* Section 1 */}
                <section className="scroll-mt-20" id="information-we-collect">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3">
                      <span className="text-2xl font-bold text-purple-600">1</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Information We Collect</h3>
                      <p className="text-gray-600 mb-3">
                        To provide you with our products and services, we may collect the following information:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-700 mb-2">Personal Information</h4>
                          <ul className="text-gray-600 text-sm space-y-1">
                            <li>• Full name and contact details</li>
                            <li>• Email address and phone number</li>
                            <li>• Delivery/shipping address</li>
                            <li>• Social media handles</li>
                          </ul>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-700 mb-2">Product-Specific Information</h4>
                          <ul className="text-gray-600 text-sm space-y-1">
                            <li>• Cake customization details</li>
                            <li>• Candle scent preferences</li>
                            <li>• Mug personalization requests</li>
                            <li>• Special occasion information</li>
                          </ul>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-4 italic">
                        Note: Payment details are processed securely via third-party payment platforms and are not stored on our servers.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 2 */}
                <section className="scroll-mt-20" id="how-we-use-information">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3">
                      <span className="text-2xl font-bold text-purple-600">2</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">How We Use Your Information</h3>
                      <p className="text-gray-600 mb-3">
                        Your information helps us provide exceptional service across all our product lines:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-3">
                            <span className="text-white font-bold">🎂</span>
                          </div>
                          <h4 className="font-semibold text-gray-700 mb-2">Order Processing</h4>
                          <p className="text-gray-600 text-sm">
                            Processing and delivering your cake, candle, and mug orders
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-3">
                            <span className="text-white font-bold">💬</span>
                          </div>
                          <h4 className="font-semibold text-gray-700 mb-2">Customer Support</h4>
                          <p className="text-gray-600 text-sm">
                            Providing personalized support for all product inquiries
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-3">
                            <span className="text-white font-bold">🎨</span>
                          </div>
                          <h4 className="font-semibold text-gray-700 mb-2">Customization</h4>
                          <p className="text-gray-600 text-sm">
                            Managing custom orders and personalization requests
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 3 */}
                <section className="scroll-mt-20" id="data-security">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3">
                      <span className="text-2xl font-bold text-purple-600">3</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Data Security & Sharing</h3>
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
                        <p className="text-gray-700">
                          <span className="font-semibold text-green-600">We do not sell or rent your personal information.</span> We only share data with trusted third parties such as:
                        </p>
                        <ul className="mt-3 space-y-2">
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-gray-600">Delivery and shipping partners</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-gray-600">Secure payment processors</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-gray-600">Customer service platforms</span>
                          </li>
                        </ul>
                      </div>
                      <p className="text-gray-600 mt-4">
                        We implement industry-standard security measures to protect your data across all product transactions and communications.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 4 */}
                <section className="scroll-mt-20" id="your-rights">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3">
                      <span className="text-2xl font-bold text-purple-600">4</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Your Rights & Choices</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                          <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                              <span className="text-blue-600">✓</span>
                            </div>
                            Access & Control
                          </h4>
                          <ul className="text-gray-600 text-sm space-y-2">
                            <li>• Access your personal information</li>
                            <li>• Update or correct your details</li>
                            <li>• Request data deletion (subject to legal requirements)</li>
                          </ul>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                          <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                              <span className="text-blue-600">✉️</span>
                            </div>
                            Communications
                          </h4>
                          <ul className="text-gray-600 text-sm space-y-2">
                            <li>• Opt out of marketing communications</li>
                            <li>• Manage notification preferences</li>
                            <li>• Set communication frequency</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 5 */}
                <section className="scroll-mt-20" id="cookies-analytics">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3">
                      <span className="text-2xl font-bold text-purple-600">5</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Cookies & Analytics</h3>
                      <div className="bg-gray-50 rounded-xl p-5">
                        <p className="text-gray-700">
                          Our website uses cookies and similar technologies to enhance your browsing experience and help us understand how you interact with our site across all product categories.
                        </p>
                        <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">You can control cookies</span> through your browser settings. Disabling cookies may affect some features of our website.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 6 */}
                <section className="scroll-mt-20" id="policy-updates">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3">
                      <span className="text-2xl font-bold text-purple-600">6</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Policy Updates</h3>
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-100">
                        <p className="text-gray-700">
                          We may update this Privacy Policy to reflect changes in our practices or legal requirements. Significant changes will be communicated through:
                        </p>
                        <ul className="mt-3 space-y-2">
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                            <span className="text-gray-600">Email notifications to registered users</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                            <span className="text-gray-600">Notifications on our website</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                            <span className="text-gray-600">Updated effective date on this page</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Contact Information */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Contact Us</h3>
                  <p className="text-gray-600 mb-4">
                    If you have any questions about this Privacy Policy or our practices regarding any of our products (cakes, candles, or mugs), please contact us:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-purple-600 font-medium">privacy@stefanosbakeshop.com</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-purple-600 font-medium">+234 901 472 7839</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Navigation */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-500 mb-3">Quick Navigation</h4>
                <div className="flex flex-wrap gap-2">
                  <a href="#information-we-collect" className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 transition-colors">
                    Information Collection
                  </a>
                  <a href="#how-we-use-information" className="text-xs bg-pink-100 text-pink-700 px-3 py-1 rounded-full hover:bg-pink-200 transition-colors">
                    How We Use Information
                  </a>
                  <a href="#data-security" className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 transition-colors">
                    Data Security
                  </a>
                  <a href="#your-rights" className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors">
                    Your Rights
                  </a>
                  <a href="#cookies-analytics" className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors">
                    Cookies & Analytics
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left mb-2 md:mb-0">
                <p className="text-sm text-gray-600">
                  © {new Date().getFullYear()} Stefanos Bakeshop. All rights reserved.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-500">Last updated: Today</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
