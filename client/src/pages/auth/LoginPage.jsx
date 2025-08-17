import Login from '../../components/auth/Login';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-purpleLight flex flex-col justify-center   sm:px-6 lg:px-8">
  {/* Background Image with Opacity */}
    <div className="absolute inset-0 z-0">
        <img 
            src="/images/hero1.jpeg" // Replace with your image path
            alt="Beauty Products Background"
            className="w-full h-full object-cover opacity-20" // Adjust opacity as needed (0.2 = 20%)
        />
        <div className="absolute inset-0 bg-gradient-to-b from-purpleDark to-purpleLight mix-blend-multiply"></div>
    </div>
            <div className=" sm:mx-auto sm:w-full z-20 sm:max-w-md">
                <div className="bg-white py-2 md:py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <Login />
                </div>
            </div>
        </div>
    );
}
