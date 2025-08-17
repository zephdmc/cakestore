import { useState } from 'react';
import { motion } from 'framer-motion';

const testimonials = [
    {
        id: 1,
        name: "Sarah J.",
        role: "Skincare Enthusiast",
        content: "Bellebeau's Vitamin C serum transformed my complexion. After just 2 weeks, my dark spots faded significantly and my skin has never looked brighter!",
        rating: 5,
        avatar: "/images/avatars/1.jpg"
    },
    {
        id: 2,
        name: "Dr. Maya K.",
        role: "Dermatologist",
        content: "As a dermatologist, I'm very selective about products I recommend. Bellebeau's formulations are clean, effective, and suitable for sensitive skin types.",
        rating: 4,
        avatar: "/images/avatars/2.jpg"
    },
    {
        id: 3,
        name: "Emma L.",
        role: "Acne-Prone Skin",
        content: "Finally found a routine that works! The acne control bundle cleared my breakouts without drying out my skin. Worth every penny!",
        rating: 5,
        avatar: "/images/avatars/3.jpg"
    }
];

export default function TestimonialSlider() {
    const [current, setCurrent] = useState(0);

    const nextTestimonial = () => {
        setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    };

    const prevTestimonial = () => {
        setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    };

    return (
        <div className="relative max-w-3xl mx-auto">
            <motion.div
                key={testimonials[current].id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-8 rounded-xl shadow-md text-center"
            >
                <div className="flex justify-center mb-4">
                    {[...Array(testimonials[current].rating)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ))}
                </div>
                <p className="text-gray-600 italic mb-6">"{testimonials[current].content}"</p>
                <div className="flex items-center justify-center space-x-4">
                    <img
                        src={testimonials[current].avatar}
                        alt={testimonials[current].name}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                        <h4 className="font-bold text-gray-900">{testimonials[current].name}</h4>
                        <p className="text-sm text-pink-600">{testimonials[current].role}</p>
                    </div>
                </div>
            </motion.div>

            <button
                onClick={prevTestimonial}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white p-2 rounded-full shadow-md hover:bg-pink-50 transition"
            >
                <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button
                onClick={nextTestimonial}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white p-2 rounded-full shadow-md hover:bg-pink-50 transition"
            >
                <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            <div className="flex justify-center mt-6 space-x-2">
                {testimonials.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`w-3 h-3 rounded-full ${current === index ? 'bg-pink-600' : 'bg-gray-300'}`}
                    />
                ))}
            </div>
        </div>
    );
}