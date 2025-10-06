// components/orders/CustomCakeForm.jsx
import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiX, FiCheck, FiArrowLeft, FiArrowRight, FiImage, FiCalendar, FiInfo } from 'react-icons/fi';

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

const stepVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1
  },
  exit: (direction) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    scale: 0.95
  })
};

export default function CustomCakeForm({ onClose, onSubmit }) {
  const { currentUser } = useAuth();
  const fileInputRef = useRef(null);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
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

  const navigateStep = (newStep) => {
    setDirection(newStep > step ? 1 : -1);
    setStep(newStep);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageFile(file);
  };

  const handleImageFile = (file) => {
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    handleImageFile(file);
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
    
    if (formData.size && PRICING.sizes[formData.size]) {
      price *= PRICING.sizes[formData.size].multiplier;
    }
    
    if (formData.flavor && PRICING.flavors[formData.flavor]) {
      price += PRICING.flavors[formData.flavor];
    }
    
    if (formData.frosting && PRICING.frostings[formData.frosting]) {
      price += PRICING.frostings[formData.frosting];
    }
    
    if (formData.filling && PRICING.fillings[formData.filling]) {
      price += PRICING.fillings[formData.filling];
    }
    
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

  const InputField = ({ label, name, type = 'text', required = false, children, ...props }) => (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children || (
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          required={required}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
          {...props}
        />
      )}
    </div>
  );

  const SelectField = ({ label, name, options, required = false, priceMap = {} }) => (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select 
        name={name} 
        value={formData[name]}
        onChange={handleChange}
        required={required}
        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
      >
        <option value="">Select {label.toLowerCase()}</option>
        {Object.entries(options).map(([key, value]) => (
          <option key={key} value={key} className="py-2">
            {key.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} 
            {priceMap[key] > 0 && ` (+₦${priceMap[key].toLocaleString()})`}
          </option>
        ))}
      </select>
    </div>
  );

  const renderStep1 = () => (
    <motion.div
      key="step1"
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="space-y-2"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiInfo className="text-white text-2xl" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Cake Details</h3>
        <p className="text-gray-600">Let's start with the basics of your dream cake</p>
      </div>

      <SelectField 
        label="Occasion" 
        name="occasion" 
        options={{
          'birthday': 'Birthday',
          'anniversary': 'Anniversary', 
          'wedding': 'Wedding',
          'baby-shower': 'Baby Shower',
          'corporate': 'Corporate Event',
          'other': 'Other'
        }}
        required
      />
      
      <SelectField 
        label="Cake Size" 
        name="size" 
        options={PRICING.sizes}
        required
      />
      
      <SelectField 
        label="Flavor" 
        name="flavor" 
        options={PRICING.flavors}
        priceMap={PRICING.flavors}
        required
      />
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      key="step2"
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="space-y-2"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiImage className="text-white text-2xl" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Frosting & Fillings</h3>
        <p className="text-gray-600">Customize the look and taste of your cake</p>
      </div>

      <SelectField 
        label="Frosting Type" 
        name="frosting" 
        options={PRICING.frostings}
        priceMap={PRICING.frostings}
        required
      />
      
      <SelectField 
        label="Filling" 
        name="filling" 
        options={PRICING.fillings}
        priceMap={PRICING.fillings}
      />
      
      <SelectField 
        label="Decorations" 
        name="decorations" 
        options={PRICING.decorations}
        priceMap={PRICING.decorations}
        required
      />
      
      {(formData.decorations === 'message-only' || formData.decorations === 'custom-design') && (
        <InputField 
          label={formData.decorations === 'message-only' ? 'Message to write on cake' : 'Design details'}
          name="message"
          required
        >
          <textarea 
            name="message" 
            value={formData.message}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
            placeholder={formData.decorations === 'message-only' 
              ? 'E.g., Happy Birthday Sarah!' 
              : 'Please describe your design in detail...'}
          />
        </InputField>
      )}
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      key="step3"
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="space-y-2"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiCalendar className="text-white text-2xl" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Delivery & Special Requests</h3>
        <p className="text-gray-600">Tell us about delivery and any special requirements</p>
      </div>

      <InputField 
        label="Delivery Date" 
        name="deliveryDate" 
        type="date"
        required
        min={new Date().toISOString().split('T')[0]}
      />
      
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Preferred Delivery Time</label>
        <select 
          name="deliveryTime" 
          value={formData.deliveryTime}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
        >
          <option value="">Any time</option>
          <option value="morning">Morning (8am - 12pm)</option>
          <option value="afternoon">Afternoon (12pm - 4pm)</option>
          <option value="evening">Evening (4pm - 7pm)</option>
        </select>
      </div>
      
      <InputField 
        label="Allergies or Dietary Restrictions" 
        name="allergies"
        placeholder="E.g., Nut allergy, gluten-free, etc."
      />
      
      <InputField label="Special Instructions" name="specialInstructions">
        <textarea 
          name="specialInstructions" 
          value={formData.specialInstructions}
          onChange={handleChange}
          rows="3"
          placeholder="Any other special requests or instructions..."
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
        />
      </InputField>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Reference Image (Optional)</label>
        <div 
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer ${
            isDragging 
              ? 'border-purple-500 bg-purple-50' 
              : uploadedImage 
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 bg-gray-50 hover:border-purple-400 hover:bg-purple-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploadedImage ? (
            <div className="relative">
              <img src={uploadedImage} alt="Reference" className="mx-auto h-32 object-contain rounded-lg" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeImage(); }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <FiX size={16} />
              </button>
              <p className="text-green-600 mt-2">Image uploaded successfully!</p>
            </div>
          ) : (
            <>
              <FiUpload className="mx-auto text-3xl text-gray-400 mb-3" />
              <p className="text-gray-600 mb-1">
                <span className="text-purple-600 font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
            </>
          )}
          <input 
            ref={fileInputRef}
            type="file" 
            className="sr-only" 
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
      </div>
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div
      key="step4"
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiCheck className="text-white text-2xl" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Review Your Order</h3>
        <p className="text-gray-600">Almost there! Review your custom cake details</p>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
        <h4 className="font-bold text-purple-900 mb-4 text-lg">Cake Details</h4>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            ['Occasion', formData.occasion],
            ['Size', formData.size],
            ['Flavor', formData.flavor],
            ['Frosting', formData.frosting],
            ['Filling', formData.filling || 'None'],
            ['Decorations', formData.decorations]
          ].map(([label, value]) => (
            <div key={label} className="bg-white rounded-lg p-3">
              <span className="text-gray-600 text-sm">{label}:</span>
              <p className="font-semibold text-gray-800">{value}</p>
            </div>
          ))}
          {formData.message && (
            <div className="md:col-span-2 bg-white rounded-lg p-3">
              <span className="text-gray-600 text-sm">Message:</span>
              <p className="font-semibold text-gray-800">{formData.message}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100">
        <h4 className="font-bold text-blue-900 mb-4 text-lg">Delivery Information</h4>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            ['Delivery Date', formData.deliveryDate],
            ['Preferred Time', formData.deliveryTime || 'Any time'],
            ...(formData.allergies ? [['Allergies', formData.allergies]] : []),
            ...(formData.specialInstructions ? [['Special Instructions', formData.specialInstructions]] : [])
          ].map(([label, value]) => (
            <div key={label} className="bg-white rounded-lg p-3">
              <span className="text-gray-600 text-sm">{label}:</span>
              <p className="font-semibold text-gray-800">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {uploadedImage && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h4 className="font-bold text-gray-800 mb-4 text-lg">Reference Image</h4>
          <img src={uploadedImage} alt="Reference" className="h-48 object-contain mx-auto rounded-xl shadow-sm" />
        </div>
      )}

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
        <h4 className="font-bold text-green-900 mb-4 text-lg">Price Breakdown</h4>
        <div className="space-y-3">
          {[
            ['Base Price', PRICING.basePrice],
            ...(formData.size ? [['Size Premium', PRICING.basePrice * (PRICING.sizes[formData.size].multiplier - 1)]] : []),
            ...(formData.flavor && PRICING.flavors[formData.flavor] > 0 ? [['Flavor Upgrade', PRICING.flavors[formData.flavor]]] : []),
            ...(formData.frosting && PRICING.frostings[formData.frosting] > 0 ? [['Frosting', PRICING.frostings[formData.frosting]]] : []),
            ...(formData.filling && PRICING.fillings[formData.filling] > 0 ? [['Filling', PRICING.fillings[formData.filling]]] : []),
            ...(formData.decorations && PRICING.decorations[formData.decorations] > 0 ? [['Decorations', PRICING.decorations[formData.decorations]]] : [])
          ].map(([label, amount]) => (
            <div key={label} className="flex justify-between items-center py-2 border-b border-green-100 last:border-b-0">
              <span className="text-gray-700">{label}:</span>
              <span className="font-semibold text-gray-800">+₦{amount.toLocaleString()}</span>
            </div>
          ))}
          <div className="border-t border-green-200 pt-3 mt-2">
            <div className="flex justify-between items-center text-lg font-bold">
              <span className="text-green-900">Total Amount:</span>
              <span className="text-green-900">₦{calculatePrice().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const StepIndicator = () => (
    <div className="flex justify-between items-center mb-8 relative">
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 -z-10"></div>
      <div 
        className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 -translate-y-1/2 transition-all duration-500 -z-10"
        style={{ width: `${((step - 1) / 3) * 100}%` }}
      ></div>
      {[1, 2, 3, 4].map((stepNumber) => (
        <div key={stepNumber} className="flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
            step >= stepNumber 
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-transparent text-white scale-110 shadow-lg'
              : 'bg-white border-gray-300 text-gray-400'
          }`}>
            {stepNumber}
          </div>
          <span className={`text-xs mt-2 font-medium ${
            step >= stepNumber ? 'text-purple-600' : 'text-gray-400'
          }`}>
            {['Details', 'Style', 'Delivery', 'Review'][stepNumber - 1]}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <AnimatePresence mode="wait">
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, type: "spring", damping: 25 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden"
        >
          <div className="relative">
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Custom Cake Order</h2>
                  <p className="text-purple-100 opacity-90">Create your perfect cake in 4 simple steps</p>
                </div>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
                >
                  <FiX className="text-xl" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="px-8 pt-6">
              <StepIndicator />
            </div>

            {/* Content */}
            <div className="px-8 pb-8 max-h-[60vh] overflow-y-auto">
              {!currentUser ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiInfo className="text-white text-3xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Please log in to place a custom cake order and access all our features
                  </p>
                  <button 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-8 rounded-full font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                    onClick={() => window.location.href = '/login'}
                  >
                    Login to Continue
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {step === 1 && renderStep1()}
                  {step === 2 && renderStep2()}
                  {step === 3 && renderStep3()}
                  {step === 4 && renderStep4()}
                </form>
              )}
            </div>

            {/* Footer Navigation */}
            {currentUser && (
              <div className="px-8 py-6 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between items-center">
                  <button 
                    type="button" 
                    onClick={() => navigateStep(step - 1)}
                    disabled={step === 1}
                    className="flex items-center px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:border-purple-500 hover:text-purple-600 transition-all duration-200 font-semibold"
                  >
                    <FiArrowLeft className="mr-2" />
                    Back
                  </button>

                  {step < 4 ? (
                    <button 
                      type="button" 
                      onClick={() => navigateStep(step + 1)}
                      disabled={
                        (step === 1 && (!formData.occasion || !formData.size || !formData.flavor)) ||
                        (step === 2 && (!formData.frosting || !formData.decorations)) ||
                        (step === 3 && !formData.deliveryDate)
                      }
                      className="flex items-center px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold"
                    >
                      Continue
                      <FiArrowRight className="ml-2" />
                    </button>
                  ) : (
                    <button 
                      type="submit" 
                      className="flex items-center px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold"
                    >
                      Place Order - ₦{calculatePrice().toLocaleString()}
                      <FiCheck className="ml-2" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
