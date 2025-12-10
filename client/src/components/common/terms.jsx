export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600">
            Guidelines for enjoying our handcrafted creations
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
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-8 border-l-4 border-purple-500">
                <p className="text-gray-700">
                  Welcome to <span className="font-semibold text-purple-600">Stefanos Bakeshop</span>! These Terms of Service govern your use of our website and the purchase of our handcrafted cakes, luxury candles, and personalized mugs. By accessing our site or placing an order, you agree to these terms. Please read them carefully.
                </p>
              </div>

              <div className="space-y-10">
                {/* Section 1 */}
                <section className="scroll-mt-20" id="eligibility">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3">
                      <span className="text-2xl font-bold text-purple-600">1</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Eligibility & Account</h3>
                      <div className="bg-gray-50 rounded-xl p-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                              <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                                <span className="text-purple-600">🎂</span>
                              </div>
                              Age Requirement
                            </h4>
                            <p className="text-gray-600 text-sm">
                              By using our website and placing an order, you confirm that you are at least 18 years old or have permission from a legal guardian.
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                              <div className="w-6 h-6 bg-pink-100 rounded-lg flex items-center justify-center">
                                <span className="text-pink-600">🔒</span>
                              </div>
                              Account Security
                            </h4>
                            <p className="text-gray-600 text-sm">
                              You are responsible for maintaining the confidentiality of your account information and all activities under your account.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 2 */}
                <section className="scroll-mt-20" id="products-services">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3">
                      <span className="text-2xl font-bold text-purple-600">2</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Products & Services</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-pink-50 rounded-xl p-4 border border-pink-100">
                          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mb-3">
                            <span className="text-white font-bold">🎂</span>
                          </div>
                          <h4 className="font-semibold text-gray-700 mb-2">Crafted Cakes</h4>
                          <p className="text-gray-600 text-sm">
                            Custom themed cakes for celebrations, available for ready-made or custom orders.
                          </p>
                        </div>
                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                          <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center mb-3">
                            <span className="text-white font-bold">🕯️</span>
                          </div>
                          <h4 className="font-semibold text-gray-700 mb-2">Scented Candles</h4>
                          <p className="text-gray-600 text-sm">
                            Luxury candles with premium scents for relaxation and ambiance.
                          </p>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-3">
                            <span className="text-white font-bold">☕</span>
                          </div>
                          <h4 className="font-semibold text-gray-700 mb-2">Personalized Mugs</h4>
                          <p className="text-gray-600 text-sm">
                            Custom glass mugs with personalization options for special moments.
                          </p>
                        </div>
                      </div>
                      <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold text-yellow-700">Note:</span> All products are subject to availability. We reserve the right to limit quantities or discontinue any product without prior notice.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 3 */}
                <section className="scroll-mt-20" id="pricing-payment">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3">
                      <span className="text-2xl font-bold text-purple-600">3</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Pricing & Payment</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                          <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                              <span className="text-green-600">₦</span>
                            </div>
                            Pricing Structure
                          </h4>
                          <ul className="text-gray-600 text-sm space-y-2">
                            <li>• All prices in Nigerian Naira (₦)</li>
                            <li>• Prices subject to change without notice</li>
                            <li>• Custom orders may have additional fees</li>
                            <li>• Discounts cannot be combined</li>
                          </ul>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                          <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                              <span className="text-blue-600">💳</span>
                            </div>
                            Payment Methods
                          </h4>
                          <ul className="text-gray-600 text-sm space-y-2">
                            <li>• Bank transfers</li>
                            <li>• Online payment gateways</li>
                            <li>• Payment required before order processing</li>
                            <li>• Secure payment processing</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 4 */}
                <section className="scroll-mt-20" id="custom-orders">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3">
                      <span className="text-2xl font-bold text-purple-600">4</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Custom Orders</h3>
                      <div className="bg-purple-50 rounded-xl p-5">
                        <p className="text-gray-700 mb-4">
                          For custom orders across all product types (cakes, candles, mugs):
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 mt-1">✓</div>
                            <p className="text-gray-600 text-sm">Custom designs require advance consultation and approval</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 mt-1">✓</div>
                            <p className="text-gray-600 text-sm">50% deposit required for custom orders</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 mt-1">✓</div>
                            <p className="text-gray-600 text-sm">Custom orders cannot be canceled after production begins</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 mt-1">✓</div>
                            <p className="text-gray-600 text-sm">Lead times vary by product and customization complexity</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 5 */}
                <section className="scroll-mt-20" id="shipping">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3">
                      <span className="text-2xl font-bold text-purple-600">5</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Shipping & Delivery</h3>
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5">
                        <p className="text-gray-700 mb-4">
                          Please refer to our <a href="/shipping" className="text-blue-600 hover:underline font-semibold">Shipping Policy</a> for detailed information.
                        </p>
                        <div className="flex items-center gap-3 mt-4">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm">🚚</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              Delivery times, fees, and tracking information vary by product type and location.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 6 */}
                <section className="scroll-mt-20" id="returns-refunds">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3">
                      <span className="text-2xl font-bold text-purple-600">6</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Returns & Refunds</h3>
                      <div className="bg-red-50 rounded-xl p-5 border border-red-100">
                        <p className="text-gray-700 mb-3">
                          Due to the nature of our handcrafted products:
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 mt-1">!</div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Cakes are perishable items</p>
                              <p className="text-xs text-gray-600">Returns only accepted if damaged upon delivery</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 mt-1">!</div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Candles & mugs are fragile</p>
                              <p className="text-xs text-gray-600">Returns accepted for damage/defects only</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 mt-1">!</div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Custom orders are non-returnable</p>
                              <p className="text-xs text-gray-600">Unless there are manufacturing defects</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <p className="text-sm text-gray-600">
                            For complete details, review our <a href="/returns" className="text-red-600 hover:underline font-semibold">Return Policy</a>.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 7 */}
                <section className="scroll-mt-20" id="website-use">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3">
                      <span className="text-2xl font-bold text-purple-600">7</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Website Use & Intellectual Property</h3>
                      <div className="bg-gray-50 rounded-xl p-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                              <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                                <span className="text-gray-600">🚫</span>
                              </div>
                              Prohibited Activities
                            </h4>
                            <ul className="text-gray-600 text-sm space-y-2">
                              <li>• Hacking or disrupting our website</li>
                              <li>• Copying or scraping content</li>
                              <li>• Misusing customer information</li>
                              <li>• Automated data extraction</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                              <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                                <span className="text-gray-600">©</span>
                              </div>
                              Intellectual Property
                            </h4>
                            <ul className="text-gray-600 text-sm space-y-2">
                              <li>• Content is owned by Stefanos Bakeshop</li>
                              <li>• Designs are protected by copyright</li>
                              <li>• Unauthorized use is prohibited</li>
                              <li>• Licensing available on request</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 8 */}
                <section className="scroll-mt-20" id="privacy">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3">
                      <span className="text-2xl font-bold text-purple-600">8</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Privacy & Data Protection</h3>
                      <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-white">🔒</span>
                          </div>
                          <div>
                            <p className="text-gray-700 mb-2">
                              We take your privacy seriously. All personal information is handled according to our comprehensive <a href="/privacy" className="text-green-600 hover:underline font-semibold">Privacy Policy</a>.
                            </p>
                            <p className="text-sm text-gray-600">
                              Your data is used only to provide our services and improve your experience across all product categories.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 9 */}
                <section className="scroll-mt-20" id="liability">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3">
                      <span className="text-2xl font-bold text-purple-600">9</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Limitation of Liability</h3>
                      <div className="bg-orange-50 rounded-xl p-5 border border-orange-100">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white">⚠️</span>
                          </div>
                          <div>
                            <p className="text-gray-700">
                              <span className="font-semibold">Stefanos Bakeshop is not liable</span> for any indirect, incidental, or consequential damages arising from:
                            </p>
                            <ul className="mt-3 text-gray-600 text-sm space-y-2">
                              <li>• Personal injury from product misuse</li>
                              <li>• Business interruption or data loss</li>
                              <li>• Third-party delivery issues</li>
                              <li>• Incorrect personalization requests</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 10 */}
                <section className="scroll-mt-20" id="changes">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3">
                      <span className="text-2xl font-bold text-purple-600">10</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Changes to Terms</h3>
                      <div className="bg-purple-50 rounded-xl p-5">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-white">📝</span>
                          </div>
                          <div>
                            <p className="text-gray-700 mb-2">
                              We reserve the right to update or modify these Terms at any time without prior notice.
                            </p>
                            <div className="bg-white rounded-lg p-3 mt-2 border border-purple-200">
                              <p className="text-sm text-gray-600">
                                <span className="font-semibold text-purple-600">Continued use</span> of our website or services after changes constitutes acceptance of the revised terms.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Contact Section */}
                <section className="scroll-mt-20" id="contact">
                  <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 rounded-xl p-6 text-white">
                    <h3 className="text-xl font-bold mb-4">Questions & Contact</h3>
                    <p className="text-purple-100 mb-4">
                      If you have any questions about these Terms of Service, please contact us:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center">
                            <span className="text-white">📧</span>
                          </div>
                          <div>
                            <p className="text-sm text-purple-200">Email</p>
                            <p className="font-semibold">legal@stefanosbakeshop.com</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center">
                            <span className="text-white">📞</span>
                          </div>
                          <div>
                            <p className="text-sm text-purple-200">Phone/WhatsApp</p>
                            <p className="font-semibold">+234 901 472 7839</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-sm text-purple-200">
                      <p>For order-specific questions, please contact our customer service team directly.</p>
                    </div>
                  </div>
                </section>
              </div>

              {/* Quick Navigation */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-500 mb-3">Quick Navigation</h4>
                <div className="flex flex-wrap gap-2">
                  <a href="#eligibility" className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 transition-colors">
                    Eligibility
                  </a>
                  <a href="#products-services" className="text-xs bg-pink-100 text-pink-700 px-3 py-1 rounded-full hover:bg-pink-200 transition-colors">
                    Products & Services
                  </a>
                  <a href="#custom-orders" className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 transition-colors">
                    Custom Orders
                  </a>
                  <a href="#returns-refunds" className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full hover:bg-red-200 transition-colors">
                    Returns & Refunds
                  </a>
                  <a href="#liability" className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full hover:bg-orange-200 transition-colors">
                    Liability
                  </a>
                  <a href="#contact" className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors">
                    Contact Us
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
