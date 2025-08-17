import Register from '../../components/auth/Register';

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
              {/* Background Image with Opacity */}
    <div className="absolute inset-0 z-0">
        <img 
            src="/images/hero1.jpeg" // Replace with your image path
            alt="Beauty Products Background"
            className="w-full h-full object-cover opacity-20" // Adjust opacity as needed (0.2 = 20%)
        />
        <div className="absolute inset-0 bg-gradient-to-b from-purpleDark to-purpleLight mix-blend-multiply"></div>
    </div>
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {/* <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create a new account
                </h2> */}
            </div>
            <div className="mt-2 md:mt-8 sm:mx-auto z-20 sm:w-full sm:max-w-md">
                <div className="bg-white py-2 md:py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <Register />
                </div>
            </div>
        </div>
    );
}
