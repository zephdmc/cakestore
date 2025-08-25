// components/orders/CustomCakeForm.jsx
import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiX, FiCheck, FiArrowLeft, FiArrowRight } from 'react-icons/fi';

// Pricing configuration
const PRICING = {
  basePrice: 8000, // Base price in Naira
  sizes: {
    '6-inch': { multiplier: 1, servings: '6-8' },
    '8-inch': { multiplier: 1.5, servings: '10-12' },
    '10-inch': { multiplier: 2, servings: '15-20' },
    '12-inch': { multiplier: 2.8, servings: '25-30' },
    'sheet': { multiplier: 3.5, servings: '30-40' },
    'tiered': { multiplier: 4.5, servings: '40-50' }
  },
  flavors: {
    'vanilla': 0,
    'chocolate': 500,
    'red-velvet': 800,
    'fruit': 1000,
    'marble': 700,
    'carrot': 900
  },
  frostings: {
    'buttercream': 0,
    'cream-cheese': 500,
    'whipped': 400,
    'ganache': 800,
    'fondant': 2000
  },
  fillings: {
    'none': 0,
    'fruit': 800,
    'chocolate-ganache': 1000,
    'cream': 600,
    'custard': 700
  },
  decorations: {
    'basic': 0,
    'flowers': 1500,
    'figurines': 2000,
    'message-only': 500,
    'custom-design': 3000
  }
};

export default function CustomCakeForm({ onClose, onSubmit }) {
  const { currentUser } = useAuth();
  const fileInputRef = useRef(null);
  const [step, setStep] = useState(1);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [formData, setFormData] = useState({
    occasion: '',
    size: '',
    flavor: '',
    frosting: '',
    filling: '',
    decorations: '',
    message: '',
    deliveryDate: '',
    deliveryTime: '',
    allergies: '',
    specialInstructions: '',
    referenceImage: null
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Please select an image smaller than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
        setFormData({ ...formData, referenceImage: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setFormData({ ...formData, referenceImage: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const calculatePrice = () => {
    let price = PRICING.basePrice;
    
    // Add size cost
    if (formData.size && PRICING.sizes[formData.size]) {
      price *= PRICING.sizes[formData.size].multiplier;
    }
    
    // Add flavor cost
    if (formData.flavor && PRICING.flavors[formData.flavor]) {
      price += PRICING.flavors[formData.flavor];
    }
    
    // Add frosting cost
    if (formData.frosting && PRICING.frostings[formData.frosting]) {
      price += PRICING.frostings[formData.frosting];
    }
    
    // Add filling cost
    if (formData.filling && PRICING.fillings[formData.filling]) {
      price += PRICING.fillings[formData.filling];
    }
    
    // Add decorations cost
    if (formData.decorations && PRICING.decorations[formData.decorations]) {
      price += PRICING.decorations[formData.decorations];
    }
    
    return Math.round(price);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Please log in to place a custom order');
      return;
    }
    
    const orderData = {
      ...formData,
      price: calculatePrice(),
      userId: currentUser.uid,
      userEmail: currentUser.email
    };
    
    onSubmit(orderData);
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-purpleDark mb-2">Cake Details</h3>
      
      <div>
        <label className="block text-sm font-medium mb-1">Occasion *</label>
        <select 
          name="occasion" 
          value={formData.occasion}
          onChange={handleChange}
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
        >
          <option value="">Select an occasion</option>
          <option value="birthday">Birthday</option>
          <option value="anniversary">Anniversary</option>
          <option value="wedding">Wedding</option>
          <option value="baby-shower">Baby Shower</option>
          <option value="corporate">Corporate Event</option>
          <option value="other">Other</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Cake Size *</label>
        <select 
          name="size" 
          value={formData.size}
          onChange={handleChange}
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
        >
          <option value="">Select size</option>
          {Object.entries(PRICING.sizes).map(([size, details]) => (
            <option key={size} value={size}>
              {size} ({details.servings} servings)
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Flavor *</label>
        <select 
          name="flavor" 
          value={formData.flavor}
          onChange={handleChange}
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
        >
          <option value="">Select flavor</option>
          {Object.entries(PRICING.flavors).map(([flavor, price]) => (
            <option key={flavor} value={flavor}>
              {flavor.charAt(0).toUpperCase() + flavor.slice(1)} {price > 0 ? `(+₦${price})` : ''}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex justify-end mt-6">
        <button 
          type="button" 
          onClick={() => setStep(2)}
          disabled={!formData.occasion || !formData.size || !formData.flavor}
          className="flex items-center bg-purplegradient text-white py-2 px-6 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <FiArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-purpleDark mb-2">Frosting & Fillings</h3>
      
      <div>
        <label className="block text-sm font-medium mb-1">Frosting Type *</label>
        <select 
          name="frosting" 
          value={formData.frosting}
          onChange={handleChange}
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
        >
          <option value="">Select frosting</option>
          {Object.entries(PRICING.frostings).map(([frosting, price]) => (
            <option key={frosting} value={frosting}>
              {frosting.charAt(0).toUpperCase() + frosting.slice(1)} {price > 0 ? `(+₦${price})` : ''}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Filling</label>
        <select 
          name="filling" 
          value={formData.filling}
          onChange={handleChange}
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="none">No filling</option>
          {Object.entries(PRICING.fillings).map(([filling, price]) => {
            if (filling === 'none') return null;
            return (
              <option key={filling} value={filling}>
                {filling.charAt(0).toUpperCase() + filling.slice(1)} {price > 0 ? `(+₦${price})` : ''}
              </option>
            );
          })}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Decorations *</label>
        <select 
          name="decorations" 
          value={formData.decorations}
          onChange={handleChange}
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
        >
          <option value="">Select decoration style</option>
          {Object.entries(PRICING.decorations).map(([decoration, price]) => (
            <option key={decoration} value={decoration}>
              {decoration.charAt(0).toUpperCase() + decoration.slice(1).replace(/-/g, ' ')} {price > 0 ? `(+₦${price})` : ''}
            </option>
          ))}
        </select>
      </div>
      
      {formData.decorations === 'message-only' || formData.decorations === 'custom-design' ? (
        <div>
          <label className="block text-sm font-medium mb-1">
            {formData.decorations === 'message-only' ? 'Message to write on cake' : 'Design details'}
            *
          </label>
          <textarea 
            name="message" 
            value={formData.message}
            onChange={handleChange}
            rows="3"
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
            placeholder={formData.decorations === 'message-only' 
              ? 'E.g., Happy Birthday Sarah!' 
              : 'Please describe your design in detail'}
          />
        </div>
      ) : null}
      
      <div className="flex justify-between mt-6">
        <button 
          type="button" 
          onClick={() => setStep(1)}
          className="flex items-center text-purpleDark py-2 px-6 rounded-full border border-purpleDark"
        >
          <FiArrowLeft className="mr-2" />
          Back
        </button>
        <button 
          type="button" 
          onClick={() => setStep(3)}
          disabled={!formData.frosting || !formData.decorations}
          className="flex items-center bg-purplegradient text-white py-2 px-6 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <FiArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-purpleDark mb-2">Delivery & Special Requests</h3>
      
      <div>
        <label className="block text-sm font-medium mb-1">Delivery Date *</label>
        <input 
          type="date" 
          name="deliveryDate" 
          value={formData.deliveryDate}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]}
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Preferred Delivery Time</label>
        <select 
          name="deliveryTime" 
          value={formData.deliveryTime}
          onChange={handleChange}
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">Any time</option>
          <option value="morning">Morning (8am - 12pm)</option>
          <option value="afternoon">Afternoon (12pm - 4pm)</option>
          <option value="evening">Evening (4pm - 7pm)</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Allergies or Dietary Restrictions</label>
        <input 
          type="text" 
          name="allergies" 
          value={formData.allergies}
          onChange={handleChange}
          placeholder="E.g., Nut allergy, gluten-free, etc."
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Special Instructions</label>
        <textarea 
          name="specialInstructions" 
          value={formData.specialInstructions}
          onChange={handleChange}
          rows="3"
          placeholder="Any other special requests or instructions"
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Reference Image (Optional)</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-md">
          <div className="space-y-1 text-center">
            {uploadedImage ? (
              <div className="relative">
                <img src={uploadedImage} alt="Reference" className="mx-auto h-32 object-contain" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <FiX size={16} />
                </button>
              </div>
            ) : (
              <>
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500">
                    <span>Upload a file</span>
                    <input 
                      ref={fileInputRef}
                      id="file-upload" 
                      name="file-upload" 
                      type="file" 
                      className="sr-only" 
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-6">
        <button 
          type="button" 
          onClick={() => setStep(2)}
          className="flex items-center text-purpleDark py-2 px-6 rounded-full border border-purpleDark"
        >
          <FiArrowLeft className="mr-2" />
          Back
        </button>
        <button 
          type="button" 
          onClick={() => setStep(4)}
          disabled={!formData.deliveryDate}
          className="flex items-center bg-purplegradient text-white py-2 px-6 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Review Order
          <FiArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-purpleDark mb-2">Review Your Order</h3>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-purpleDark mb-2">Cake Details</h4>
        <div className="grid grid-cols-2 gap-2">
          <div><span className="text-gray-600">Occasion:</span> {formData.occasion}</div>
          <div><span className="text-gray-600">Size:</span> {formData.size}</div>
          <div><span className="text-gray-600">Flavor:</span> {formData.flavor}</div>
          <div><span className="text-gray-600">Frosting:</span> {formData.frosting}</div>
          <div><span className="text-gray-600">Filling:</span> {formData.filling || 'None'}</div>
          <div><span className="text-gray-600">Decorations:</span> {formData.decorations}</div>
          {formData.message && <div className="col-span-2"><span className="text-gray-600">Message:</span> {formData.message}</div>}
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-purpleDark mb-2">Delivery Information</h4>
        <div className="grid grid-cols-2 gap-2">
          <div><span className="text-gray-600">Delivery Date:</span> {formData.deliveryDate}</div>
          <div><span className="text-gray-600">Preferred Time:</span> {formData.deliveryTime || 'Any time'}</div>
          {formData.allergies && <div className="col-span-2"><span className="text-gray-600">Allergies:</span> {formData.allergies}</div>}
          {formData.specialInstructions && <div className="col-span-2"><span className="text-gray-600">Special Instructions:</span> {formData.specialInstructions}</div>}
        </div>
      </div>
      
      {uploadedImage && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-purpleDark mb-2">Reference Image</h4>
          <img src={uploadedImage} alt="Reference" className="h-40 object-contain mx-auto" />
        </div>
      )}
      
      <div className="bg-purple-50 p-4 rounded-lg">
        <h4 className="font-medium text-purpleDark mb-2">Price Breakdown</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Base price:</span>
            <span>₦{PRICING.basePrice.toLocaleString()}</span>
          </div>
          {formData.size && (
            <div className="flex justify-between">
              <span>Size ({formData.size}):</span>
              <span>+₦{(PRICING.basePrice * (PRICING.sizes[formData.size].multiplier - 1)).toLocaleString()}</span>
            </div>
          )}
          {formData.flavor && PRICING.flavors[formData.flavor] > 0 && (
            <div className="flex justify-between">
              <span>Flavor ({formData.flavor}):</span>
              <span>+₦{PRICING.flavors[formData.flavor].toLocaleString()}</span>
            </div>
          )}
          {formData.frosting && PRICING.frostings[formData.frosting] > 0 && (
            <div className="flex justify-between">
              <span>Frosting ({formData.frosting}):</span>
              <span>+₦{PRICING.frostings[formData.frosting].toLocaleString()}</span>
            </div>
          )}
          {formData.filling && PRICING.fillings[formData.filling] > 0 && (
            <div className="flex justify-between">
              <span>Filling ({formData.filling}):</span>
              <span>+₦{PRICING.fillings[formData.filling].toLocaleString()}</span>
            </div>
          )}
          {formData.decorations && PRICING.decorations[formData.decorations] > 0 && (
            <div className="flex justify-between">
              <span>Decorations ({formData.decorations}):</span>
              <span>+₦{PRICING.decorations[formData.decorations].toLocaleString()}</span>
            </div>
          )}
          <div className="border-t pt-2 mt-2 font-semibold flex justify-between">
            <span>Total:</span>
            <span>₦{calculatePrice().toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-6">
        <button 
          type="button" 
          onClick={() => setStep(3)}
          className="flex items-center text-purpleDark py-2 px-6 rounded-full border border-purpleDark"
        >
          <FiArrowLeft className="mr-2" />
          Back
        </button>
        <button 
          type="submit" 
          className="flex items-center bg-green-600 text-white py-2 px-6 rounded-full hover:bg-green-700"
        >
          Place Order - ₦{calculatePrice().toLocaleString()}
          <FiCheck className="ml-2" />
        </button>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-purpleDark">Custom Cake Order</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
                &times;
              </button>
            </div>

            {/* Progress Steps */}
            <div className="flex mb-6">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div key={stepNumber} className={`flex-1 text-center border-b-2 ${step >= stepNumber ? 'border-purple-500' : 'border-gray-300'}`}>
                  <span className={`inline-block py-2 px-4 rounded-full ${step >= stepNumber ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}>
                    {stepNumber}
                  </span>
                </div>
              ))}
            </div>

            {!currentUser ? (
              <div className="text-center py-8">
                <p className="mb-4">Please log in to place a custom order</p>
                <Link 
                  to="/login" 
                  className="bg-purplegradient text-white py-2 px-4 rounded-full"
                  onClick={onClose}
                >
                  Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderStep4()}
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
