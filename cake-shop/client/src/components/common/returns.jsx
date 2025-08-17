export default function ReturnPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
     

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
         {/* Content */}
          <div className="p-6 md:p-8 prose prose-purple max-w-none">
             <div className="bg-purpleDark  text-white">
            <h1 className="text-3xl px-2 font-serif pt-6 md:pt-8 font-bold">Return & Exchange Policy</h1>
            <p className="mt-2 p-2 px-2 md:p-4 pb-6 md:pb-8 opacity-90">Bellebeau Aesthetics</p>
          </div>
            <p className="text-gray-600">
              <strong>Effective Date:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <p className="mt-4">
              At Bellebeau Aesthetics, customer satisfaction is our top priority. While we aim to deliver only the best skincare products, we understand that issues may arise. This Return & Exchange Policy outlines the conditions under which returns or exchanges are accepted.
            </p>

            <div className="mt-8 space-y-8">
              {/* Section 1 */}
              <section>
                <h2 className="text-xl font-bold text-purple-800 border-b border-purple-100 pb-2">
                  1. Eligibility for Return or Exchange
                </h2>
                <p className="mt-2">
                  We only accept returns or exchanges under the following conditions:
                </p>
                <ul className="mt-2 space-y-2 list-disc pl-5">
                  <li>The item received is damaged or defective</li>
                  <li>The item delivered is incorrect (wrong product or quantity)</li>
                </ul>
                <p className="mt-2 text-sm text-gray-600">
                  Requests must be made within 24 hours of receiving your order.
                </p>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-xl font-bold text-purple-800 border-b border-purple-100 pb-2">
                  2. Items Not Eligible for Return
                </h2>
                <p className="mt-2">
                  Due to hygiene and safety concerns, we do not accept returns or exchanges for:
                </p>
                <ul className="mt-2 space-y-2 list-disc pl-5">
                  <li>Used or opened skincare products</li>
                  <li>Items without original packaging</li>
                  <li>Sale or promotional items (unless damaged or incorrect)</li>
                </ul>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="text-xl font-bold text-purple-800 border-b border-purple-100 pb-2">
                  3. How to Request a Return or Exchange
                </h2>
                <ol className="mt-2 space-y-2 list-decimal pl-5">
                  <li>Contact us via WhatsApp or email within 24 hours.</li>
                  <li>Provide your order number, clear photo of the item, and a brief explanation.</li>
                  <li>We will review and guide you on the next steps.</li>
                </ol>
              </section>

              {/* Section 4  */}
              <section>
                <h2 className="text-xl font-bold text-purple-800 border-b border-purple-100 pb-2">
                  4. Return Shipping Costs
                </h2>
                <ul className="mt-2 space-y-2 list-disc pl-5">
                  <li>If we made an error, we'll cover the shipping.</li>
                  <li>If the return is due to customer preference, the buyer handles return shipping.</li>
                </ul>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="text-xl font-bold text-purple-800 border-b border-purple-100 pb-2">
                  5. Refunds (If Applicable)
                </h2>
                <p className="mt-2">
                  Refunds are only issued when an item is out of stock and cannot be replaced.
                  Refunds are processed within 3–5 business days to your original payment method or bank account.
                </p>
              </section>

              {/* Section 6 */}
              <section>
                <h2 className="text-xl font-bold text-purple-800 border-b border-purple-100 pb-2">
                  6. Exchanges
                </h2>
                <p className="mt-2">
                  If you'd prefer an exchange, we will process it after we inspect and approve the returned item.
                </p>
              </section>

              {/* Contact Section */}
              <section className="bg-purple-50 p-4 rounded-lg">
                <h2 className="text-xl font-bold text-purple-800">7. Contact Us</h2>
                <div className="mt-3 space-y-2">
                  <p className="flex items-center">
                    <span className="mr-2">📞</span> WhatsApp: +234 901 4727 839
                  </p>
                  <p className="flex items-center">
                    <span className="mr-2">📧</span> Email: bellebeauaesthetics001@gmail.com
                  </p>
                  <p className="flex items-center">
                    <span className="mr-2">📍</span> 330 PH/Aba Express way Rumukwurushi Port Harcourt
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
