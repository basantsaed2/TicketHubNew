import React from 'react'
import LogoImage from '../Assets/Images/Logo.png'
const Suppert = () => {
    return (
        <div className="container mt-8 p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-semibold mb-4 text-one">Contact Support</h2>
            <p className="mb-4 text-gray-700">
                We're here to help! If you have any questions or need assistance, please reach out to us through the following methods:
            </p>


            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-one">Other Contact Information</h3>
                <ul className="list-disc pl-5 text-gray-700">
                    <li>
                        <strong>Email:</strong>{' '}
                        <a
                            href="https://mail.google.com/mail/?view=cm&fs=1&to=Support@ticjet-hub.net"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-one hover:underline"
                        >
                            Support@ticjet-hub.net
                        </a>

                    </li>
                    <li>
                        <strong>Phone Number:</strong> <a href="tel:+201144442121" className="text-one hover:underline">+01004090378</a>
                    </li>
                </ul>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-700">Delete Account Support </h3>

            </div>

            <div className="mb-6 text-one">
                To delete your account please contact us on Support@ticjet-hub.net
            </div>
            <div className='w-full h-[800px]'>
                <img src={LogoImage} alt="Voo Logo" className="w-full h-full" />
            </div>
        </div>
    );
};
export default Suppert;