
export default function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {/* Content */}
          <div className="p-6 md:p-8 prose prose-purple bg-white max-w-none">
              <div className="p-6 md:p-8 prose prose-purple max-w-none">
             <div className="bg-purpleDark  text-white">
            <h1 className="text-3xl px-2 font-serif pt-6 md:pt-8 font-bold">Shipping Policy</h1>
            <p className="mt-2 p-2 px-2 md:p-4 pb-6 md:pb-8 opacity-90">Bellebeau Aesthetics</p>
          </div>
            <p className="mt-4">
              Welcome to Bellebeau Aesthetics! We are committed to delivering your skincare essentials quickly, safely, and reliably. Please review our shipping policy before placing your order.
            </p>

            <div className="mt-8 space-y-8">
              {/* Domestic Shipping */}
              <section>
                <h2 className="text-xl font-bold text-purple-800 border-b border-purple-100 pb-2">
                  Shipping Within Nigeria
                </h2>
                <p className="mt-2">
                  We ship to all 36 states and the FCT via trusted courier partners like GIG Logistics, DHL, and local dispatch riders.
                </p>

                <h3 className="font-semibold mt-4 text-purple-700">Order Processing Time:</h3>
                <p>
                  Orders are processed within 1–2 business days after payment confirmation. Orders placed on weekends or public holidays will be processed the next business day.
                </p>

                <h3 className="font-semibold mt-4 text-purple-700">Delivery Time Estimates:</h3>
                <ul className="mt-2 space-y-1 list-disc pl-5">
                  <li><strong>Port Harcourt:</strong> 1–2 business days</li>
                  <li><strong>Major cities (Lagos, Abuja, Enugu, etc.):</strong> 2–4 business days</li>
                  <li><strong>Other locations:</strong> 3–7 business days</li>
                </ul>

                <h3 className="font-semibold mt-4 text-purple-700">Delivery Fee:</h3>
                <p>
                  Delivery fees are calculated at checkout based on your location and selected courier service.
                </p>

                <h3 className="font-semibold mt-4 text-purple-700">Order Tracking:</h3>
                <p>
                  Once shipped, a tracking number will be sent to your email or WhatsApp. You can track your order on the courier's website or app.
                </p>
              </section>

              {/* International Shipping */}
              <section>
                <h2 className="text-xl font-bold text-purple-800 border-b border-purple-100 pb-2">
                  International Shipping
                </h2>
                <p>
                  Currently, we do not offer international shipping. However, stay tuned as we expand our service to other countries.
                </p>
              </section>

              {/* COD Section */}
              <section>
                <h2 className="text-xl font-bold text-purple-800 border-b border-purple-100 pb-2">
                  Cash on Delivery (COD)
                </h2>
                <p>
                  COD is available only within Port Harcourt and on selected items. Full address and reachable phone number are required for COD orders.
                </p>
              </section>

              {/* Pickup Option */}
              <section>
                <h2 className="text-xl font-bold text-purple-800 border-b border-purple-100 pb-2">
                  Pickup Option
                </h2>
                <p>
                  Customers in Port Harcourt can opt for store pickup. We'll notify you once your order is ready (usually within 24 hours).
                </p>
              </section>

              {/* Delivery Delays */}
              <section>
                <h2 className="text-xl font-bold text-purple-800 border-b border-purple-100 pb-2">
                  Delivery Delays
                </h2>
                <p>
                  Please note that Bellebeau Aesthetics is not responsible for delays caused by:
                </p>
                <ul className="mt-2 space-y-1 list-disc pl-5">
                  <li>Weather conditions</li>
                  <li>Courier service disruptions</li>
                  <li>Incorrect shipping address provided by customer</li>
                </ul>
              </section>

              {/* Order Issues */}
              <section>
                <h2 className="text-xl font-bold text-purple-800 border-b border-purple-100 pb-2">
                  Order Issues or Questions
                </h2>
                <p>
                  If you have any issues with your delivery (e.g. wrong item, damaged products, or delays), please contact us within 24 hours of receiving your order.
                </p>
              </section>

            

              {/* Closing */}
              <section className="text-center py-4">
                <p className="text-purple-700 font-medium">
                  Thank You! We appreciate your trust in Bellebeau Aesthetics. Your glowing skin is our priority.
                </p>
              </section>
            </div>
          </div>
        </div>
  </div>
      </div>
  
  );
}
