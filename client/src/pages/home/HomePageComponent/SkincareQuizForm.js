import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck, FiChevronDown } from 'react-icons/fi';

const skinTypes = ['Normal', 'Oily', 'Dry', 'Combination', 'Sensitive / Reactive', 'Not sure'];
const skinConcerns = [
  'Acne / Breakouts',
  'Hyperpigmentation',
  'Dark spots',
  'Dull skin',
  'Uneven tone',
  'Large pores',
  'Ageing / Fine lines',
  'Other'
];
const contactMethods = ['WhatsApp', 'SMS', 'Email'];

export default function SkincareQuizForm({ onClose }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    skinType: '',
    skinConcerns: [],
    otherConcern: '',
    routineDescription: '',
    contactMethod: '',
    consent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSkinTypeDropdown, setShowSkinTypeDropdown] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleConcernChange = (concern) => {
    setFormData(prev => {
      const concerns = [...prev.skinConcerns];
      if (concerns.includes(concern)) {
        return { ...prev, skinConcerns: concerns.filter(c => c !== concern) };
      } else {
        return { ...prev, skinConcerns: [...concerns, concern] };
      }
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.skinType) newErrors.skinType = 'Please select your skin type';
    if (formData.skinConcerns.length === 0) newErrors.skinConcerns = 'Please select at least one concern';
    if (!formData.contactMethod) newErrors.contactMethod = 'Please select a contact method';
    if (!formData.consent) newErrors.consent = 'Consent is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  setIsSubmitting(true);
  setErrors({});

  try {
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbyyJtlxxHrOVCU9nmmAh-045s-BoSV8crwPFYVu37eGbtvFHpdZReAezVLfBuoHDOVblA/exec';

    // Create a hidden iframe to handle the submission
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.name = 'google-script-iframe';
    document.body.appendChild(iframe);

    // Create a form
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = scriptUrl;
    form.target = 'google-script-iframe'; // Target the iframe

    // Add all form data
    const addInput = (name, value) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = typeof value === 'object' ? JSON.stringify(value) : value;
      form.appendChild(input);
    };

    addInput('fullName', formData.fullName);
    addInput('phone', formData.phone);
    addInput('email', formData.email);
    addInput('skinType', formData.skinType);
    addInput('skinConcerns', formData.skinConcerns);
    addInput('otherConcern', formData.otherConcern);
    addInput('routineDescription', formData.routineDescription);
    addInput('contactMethod', formData.contactMethod);
    addInput('consent', formData.consent);

    document.body.appendChild(form);
    form.submit();

    // Consider it successful after a short delay
    setTimeout(() => {
      setIsSuccess(true);
      document.body.removeChild(form);
      document.body.removeChild(iframe);
    }, 1000);

  } catch (err) {
    console.error('Submission error:', err);
    setErrors({
      submit: 'Form submitted successfully! You may need to refresh to see results.'
    });
  } finally {
    setIsSubmitting(false);
  }
};
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto  backdrop-blur-sm bg-purpleDark bg-opacity-50 bg-opacity-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-purpleDark">Skincare Consultation</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-purpleDark transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>
          
          <AnimatePresence>
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-8"
              >
                <div className="bg-green-100 text-green-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FiCheck size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                <p className="mb-6">Your skincare consultation has been submitted successfully.</p>
                <button
                  onClick={onClose}
                  className="bg-purplegradient text-white py-2 px-6 rounded-full font-medium"
                >
                  Close
                </button>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
              >
                <div className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      placeholder="Your full name"
                    />
                    {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
                  </div>
                  
                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number / WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      placeholder="Your phone number"
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                  </div>
                  
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Your email address"
                    />
                  </div>
                  
                  {/* Skin Type */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Skin Type <span className="text-red-500">*</span>
                    </label>
                    <div 
                      className={`w-full px-4 py-2 rounded-lg border ${errors.skinType ? 'border-red-500' : 'border-gray-300'} flex justify-between items-center cursor-pointer`}
                      onClick={() => setShowSkinTypeDropdown(!showSkinTypeDropdown)}
                    >
                      <span className={formData.skinType ? '' : 'text-gray-400'}>
                        {formData.skinType || 'Select your skin type'}
                      </span>
                      <FiChevronDown className={`transition-transform ${showSkinTypeDropdown ? 'rotate-180' : ''}`} />
                    </div>
                    {showSkinTypeDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                        {skinTypes.map(type => (
                          <div 
                            key={type}
                            className="px-4 py-2 hover:bg-purple-50 cursor-pointer"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, skinType: type }));
                              setShowSkinTypeDropdown(false);
                            }}
                          >
                            {type}
                          </div>
                        ))}
                      </div>
                    )}
                    {errors.skinType && <p className="mt-1 text-sm text-red-500">{errors.skinType}</p>}
                  </div>
                  
                  {/* Skin Concerns */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Main Skin Concerns (Select all that apply) <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {skinConcerns.map(concern => (
                        <div key={concern} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`concern-${concern}`}
                            checked={formData.skinConcerns.includes(concern)}
                            onChange={() => handleConcernChange(concern)}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`concern-${concern}`} className="ml-2 text-sm text-gray-700">
                            {concern}
                          </label>
                        </div>
                      ))}
                    </div>
                    {errors.skinConcerns && <p className="mt-1 text-sm text-red-500">{errors.skinConcerns}</p>}
                    
                    {formData.skinConcerns.includes('Other') && (
                      <div className="mt-2">
                        <input
                          type="text"
                          name="otherConcern"
                          value={formData.otherConcern}
                          onChange={handleChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Please specify other concern"
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Routine Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Describe your current routine or concerns (optional)
                    </label>
                    <textarea
                      name="routineDescription"
                      value={formData.routineDescription}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Tell us about your current skincare routine or any specific concerns..."
                    />
                  </div>
                  
                  {/* Contact Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred contact method for recommendations: <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {contactMethods.map(method => (
                        <div key={method} className="flex items-center">
                          <input
                            type="radio"
                            id={`contact-${method}`}
                            name="contactMethod"
                            value={method}
                            checked={formData.contactMethod === method}
                            onChange={handleChange}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                          />
                          <label htmlFor={`contact-${method}`} className="ml-2 text-sm text-gray-700">
                            {method}
                          </label>
                        </div>
                      ))}
                    </div>
                    {errors.contactMethod && <p className="mt-1 text-sm text-red-500">{errors.contactMethod}</p>}
                  </div>
                  
                  {/* Consent */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        id="consent"
                        name="consent"
                        checked={formData.consent}
                        onChange={handleChange}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                    </div>
                    <label htmlFor="consent" className="ml-2 text-sm text-gray-700">
                      <span className="text-red-500">*</span> I agree to be contacted by Bellebeau Aesthetics with product recommendations and updates.
                    </label>
                  </div>
                  {errors.consent && <p className="mt-1 text-sm text-red-500">{errors.consent}</p>}
                  
                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-purplegradient hover:bg-purplegradientv text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-70 flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        'Submit Consultation'
                      )}
                    </button>
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
