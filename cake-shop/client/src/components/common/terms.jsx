export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
        

          {/* Content */}
          <div className="p-6 md:p-8 prose prose-purple max-w-none">
                <div className="bg-purpleDark p-6 md:p-8 text-white">
            <h1 className="text-3xl font-serif font-bold">Terms of Service</h1>
            <div className="flex justify-between items-start mt-2">
              <p className="opacity-90 text-white">Bellebeau Aesthetics</p>
              <p className="text-sm text-purpleLight opacity-80">
                Effective: July 22, 2025
              </p>
            </div>
          </div>

            <p className="mt-4">
              Welcome to Bellebeau Aesthetics! These Terms of Service govern your use of our website, products, and services. By using our platform, you agree to these terms. Please read them carefully.
            </p>

            <div className="mt-8 space-y-8">
              {/* Section 1 */}
              <section>
                <h2 className="text-xl font-bold text-purple-800 border-b border-purple-100 pb-2">
                  1. Eligibility
                </h2>
                <p className="mt-2">
                  By using our website and placing an order, you confirm that you are at least 18 years old or have permission from a legal guardian.
                </p>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-xl font-bold text-purple-800 border-b border-purple-100 pb-2">
                  2. Products and Services
                </h2>
                <p className="mt-2">
                  We offer skincare products for purchase online. All products are subject to availability and we reserve the right to limit quantities or discontinue any product.
                </p>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="text-xl font-bold text-purple-800 border-b border-purple-100 pb-2">
                  3. Pricing and Payment
                </h2>
                <p className="mt-2">
                  All prices are listed in Nigerian Naira (₦) and are subject to change without prior notice. Full payment is required before your order is processed.
                </p>
                <p className="mt-2">
                  We accept bank transfers, online payments, and other methods as displayed at checkout.
                </p>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="text-xl font-bold text-purple-800 border-b border-purple-100 pb-2">
                  4. Shipping
                </h2>
                <p className="mt-2">
                  Please refer to our <a href="/shipping" className="text-purple-600 hover:underline">Shipping Policy</a> for detailed information on delivery times, fees, and tracking.
                </p>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="text-xl font-bold text-purple-800 border-b border-purple-100 pb-2">
                  5. Returns and Refunds
                </h2>
                <p className="mt-2">
                  Due to the nature of our products, we do not accept returns unless a product is damaged, defective, or incorrect. For more details, please review our <a href="/returns" className="text-purple-600 hover:underline">Return Policy</a>.
                </p>
              </section>

              {/* Section 6 */}
              <section>
                <h2 className="text-xl font-bold text-purple-800 border-b border-purple-100 pb-2">
                  6. Use of Website
                </h2>
                <p className="mt-2">
                  You agree not to misuse our website by attempting to hack, disrupt, or copy any content. Content on the site is the intellectual property of Bellebeau Aesthetics and may not be reused without permission.
                </p>
              </section>

              {/* Section 7 */}
              <section>
                <h2 className="text-xl font-bold text-purple-800 border-b border-purple-100 pb-2">
                  7. Privacy
                </h2>
                <p className="mt-2">
                  We take your privacy seriously. Any personal information shared with us is handled in accordance with our <a href="/privacy" className="text-purple-600 hover:underline">Privacy Policy</a>.
                </p>
              </section>

              {/* Section 8 */}
              <section>
                <h2 className="text-xl font-bold text-purple-800 border-b border-purple-100 pb-2">
                  8. Limitation of Liability
                </h2>
                <p className="mt-2">
                  Bellebeau Aesthetics is not liable for any indirect, incidental, or consequential damages arising from your use of our services or products.
                </p>
              </section>

              {/* Section 9 */}
              <section>
                <h2 className="text-xl font-bold text-purple-800 border-b border-purple-100 pb-2">
                  9. Changes to Terms
                </h2>
                <p className="mt-2">
                  We reserve the right to update or modify these Terms at any time without prior notice. Continued use of the website constitutes acceptance of the revised terms.
                </p>
              </section>

                         </div>
          </div>
        </div>
      </div>
    </div>
  );
}
