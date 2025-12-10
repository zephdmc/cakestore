export default function ReturnPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            Return & Exchange Policy
          </h1>
          <p className="text-lg text-gray-600">
            Your satisfaction with our handcrafted creations is our priority
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
                  At <span className="font-semibold text-purple-600">Stefanos Bakeshop</span>, we take pride in our handcrafted cakes, luxury candles, and personalized mugs. We strive for perfection in every product, but understand that sometimes things don't go as planned. This policy outlines our approach to returns and exchanges across all product categories.
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
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Eligibility for Return or Exchange</h3>
                      <p className="text-gray-600 mb-4">
                        We accept returns or exchanges under the following conditions, categorized by product type:
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-pink-50 rounded-xl p-4 border border-pink-100">
                          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mb-3">
                            <span className="text-white font-bold">🎂</span>
                          </div>
                          <h4 className="font-semibold text-gray-700 mb-2">Crafted Cakes</h4>
                          <ul className="text-gray-600 text-sm space-y-1">
                            <li>• Significantly damaged during delivery</li>
                            <li>• Incorrect cake design or flavor</li>
                            <li>• Quality issues (inedible)</li>
                            <li className="text-xs text-gray-500 mt-2">Note: Perishable item, report within 2 hours</li>
                          </ul>
                        </div>
                        
                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                          <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center mb-3">
                            <span className="text-white font-bold">🕯️</span>
                          </div>
                          <h4 className="font-semibold text-gray-700 mb-2">Scented Candles</h4>
                          <ul className="text-gray-600 text-sm space-y-1">
                            <li>• Broken or damaged upon arrival</li>
                            <li>• Incorrect scent or design</li>
                            <li>• Manufacturing defects</li>
                            <li className="text-xs text-gray-500 mt-2">Report within 48 hours</li>
                          </ul>
                        </div>
                        
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-3">
                            <span className="text-white font-bold">☕</span>
                          </div>
                          <h4 className="font-semibold text-gray-700 mb-2">Personalized Mugs</h4>
                          <ul className="text-gray-600 text-sm space-y-1">
                            <li>• Cracked or broken upon arrival</li>
                            <li>• Incorrect personalization</li>
                            <li>• Design flaws</li>
                            <li className="text-xs text-gray-500 mt-2">Report within 48 hours</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="bg-yellow-50 rounded-xl p-4 mt-4 border border-yellow-200">
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold text-yellow-700">Important:</span> All return/exchange requests must be made within 24 hours of delivery with clear photo evidence. For cakes, this window is reduced to 2 hours due to perishable nature.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 2 */}
                <section className="scroll-mt-20" id="non-eligible">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3">
                      <span className="text-2xl font-bold text-purple-600">2</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Items Not Eligible for Return</h3>
                      <div className="bg-red-50 rounded-xl p-5 border border-red-100">
                        <p className="text-gray-700 mb-3">
                          Due to hygiene, safety, and customization factors, we cannot accept returns for:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                              <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center">
                                <span className="text-red-600">✗</span>
                              </div>
                              General Restrictions
                            </h4>
                            <ul className="text-gray-600 text-sm space-y-2">
                              <li>• Used or opened products</li>
                              <li>• Items without original packaging</li>
                              <li>• Sale or clearance items</li>
                              <li>• Change of mind or preference</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                              <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center">
                                <span className="text-red-600">✗</span>
                              </div>
                              Product-Specific
                            </h4>
                            <ul className="text-gray-600 text-sm space-y-2">
                              <li>• Cakes that have been cut or served</li>
                              <li>• Personalized mugs with correct customization</li>
                              <li>• Candles that have been lit or used</li>
                              <li>• Custom orders (except for defects)</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 3 */}
                <section className="scroll-mt-20" id="request-process">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3">
                      <span className="text-2xl font-bold text-purple-600">3</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">How to Request a Return or Exchange</h3>
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5">
                        <ol className="space-y-4">
                          <li className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">1</div>
                            <div>
                              <p className="font-medium text-gray-700">Contact Us Immediately</p>
                              <p className="text-gray-600 text-sm">Within 24 hours (2 hours for cakes) via WhatsApp, email, or phone</p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">2</div>
                            <div>
                              <p className="font-medium text-gray-700">Provide Evidence</p>
                              <p className="text-gray-600 text-sm">Share order number, clear photos/videos of the issue, and description</p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">3</div>
                            <div>
                              <p className="font-medium text-gray-700">Assessment & Resolution</p>
                              <p className="text-gray-600 text-sm">We'll review within 24 hours and propose a solution</p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">4</div>
                            <div>
                              <p className="font-medium text-gray-700">Return Instructions</p>
                              <p className="text-gray-600 text-sm">If approved, we'll provide specific return instructions</p>
                            </div>
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 4 */}
                <section className="scroll-mt-20" id="shipping-costs">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3">
                      <span className="text-2xl font-bold text-purple-600">4</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Shipping Costs</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                          <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                              <span className="text-green-600">✓</span>
                            </div>
                            Our Error
                          </h4>
                          <ul className="text-gray-600 text-sm space-y-2">
                            <li>• We cover all return shipping costs</li>
                            <li>• Free replacement delivery</li>
                            <li>• Priority processing</li>
                          </ul>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                              <span className="text-gray-600">↔️</span>
                            </div>
                            Customer Preference
                          </h4>
                          <ul className="text-gray-600 text-sm space-y-2">
                            <li>• Customer handles return shipping</li>
                            <li>• Original shipping non-refundable</li>
                            <li>• Exchange shipping charged</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 5 */}
                <section className="scroll-mt-20" id="refunds">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3">
                      <span className="text-2xl font-bold text-purple-600">5</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Refunds & Processing</h3>
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5">
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-700 mb-2">When Refunds Are Issued:</h4>
                          <ul className="text-gray-600 text-sm space-y-2">
                            <li>• Item is out of stock and cannot be replaced</li>
                            <li>• Customer prefers refund over exchange</li>
                            <li>• Multiple failed delivery attempts</li>
                          </ul>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 border border-purple-200">
                          <h4 className="font-semibold text-gray-700 mb-2">Refund Processing Time:</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div className="bg-purple-100 rounded-lg p-3">
                              <p className="text-2xl font-bold text-purple-600">1-3</p>
                              <p className="text-xs text-gray-600">Business days for review</p>
                            </div>
                            <div className="bg-pink-100 rounded-lg p-3">
                              <p className="text-2xl font-bold text-pink-600">3-5</p>
                              <p className="text-xs text-gray-600">Business days for processing</p>
                            </div>
                            <div className="bg-blue-100 rounded-lg p-3">
                              <p className="text-2xl font-bold text-blue-600">5-7</p>
                              <p className="text-xs text-gray-600">Business days to appear in account</p>
                            </div>
                            <div className="bg-green-100 rounded-lg p-3">
                              <p className="text-2xl font-bold text-green-600">7-10</p>
                              <p className="text-xs text-gray-600">Maximum total days</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-3 text-center">
                            Refunds are issued to your original payment method
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 6 */}
                <section className="scroll-mt-20" id="exchanges">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3">
                      <span className="text-2xl font-bold text-purple-600">6</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Exchange Process</h3>
                      <div className="bg-blue-50 rounded-xl p-5">
                        <p className="text-gray-700 mb-4">
                          If you prefer an exchange, here's our streamlined process:
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">①</div>
                            <p className="text-gray-600">We inspect and approve the returned item</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">②</div>
                            <p className="text-gray-600">You choose a replacement (same or different product)</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">③</div>
                            <p className="text-gray-600">We process the exchange (price differences adjusted)</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">④</div>
                            <p className="text-gray-600">New item is shipped within 3-5 business days</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Contact Section */}
                <section className="scroll-mt-20" id="contact">
                  <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 rounded-xl p-6 text-white">
                    <h3 className="text-xl font-bold mb-4">Contact Our Customer Care Team</h3>
                    <p className="text-purple-100 mb-4">
                      Have questions about returns or exchanges? We're here to help!
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center">
                            <span className="text-white">📞</span>
                          </div>
                          <div>
                            <p className="text-sm text-purple-200">WhatsApp/Call</p>
                            <p className="font-semibold">+234 901 472 7839</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center">
                            <span className="text-white">📧</span>
                          </div>
                          <div>
                            <p className="text-sm text-purple-200">Email</p>
                            <p className="font-semibold">support@stefanosbakeshop.com</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center">
                            <span className="text-white">📍</span>
                          </div>
                          <div>
                            <p className="text-sm text-purple-200">Location</p>
                            <p className="font-semibold">Port Harcourt, Nigeria</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-sm text-purple-200">
                      <p>Response Time: We aim to respond within 2 hours during business hours (9 AM - 6 PM, Mon-Sat)</p>
                    </div>
                  </div>
                </section>
              </div>

              {/* Quick Navigation */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-500 mb-3">Quick Navigation</h4>
                <div className="flex flex-wrap gap-2">
                  <a href="#eligibility" className="text-xs bg-pink-100 text-pink-700 px-3 py-1 rounded-full hover:bg-pink-200 transition-colors">
                    Eligibility
                  </a>
                  <a href="#non-eligible" className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full hover:bg-red-200 transition-colors">
                    Non-Eligible Items
                  </a>
                  <a href="#request-process" className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors">
                    Request Process
                  </a>
                  <a href="#shipping-costs" className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 transition-colors">
                    Shipping Costs
                  </a>
                  <a href="#refunds" className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 transition-colors">
                    Refunds
                  </a>
                  <a href="#exchanges" className="text-xs bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full hover:bg-cyan-200 transition-colors">
                    Exchanges
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
