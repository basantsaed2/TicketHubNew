// import React, { useState ,useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { toast } from 'react-toastify';
// import { useAuth } from '../../Context/Auth';
// import Loading from '../../Components/Loading';
// import MainImage from'../../Assets/Images/MainImage.png'
// import { usePost } from '../../Hooks/usePostJson';
// import { Input } from "@/Components/ui/input";
// import { Button } from "@/Components/ui/button";
// import axios from 'axios';
// const LoginPage = () => {
//     const apiUrl = import.meta.env.VITE_API_BASE_URL;
//     const {postData, loadingPost, response} = usePost({ url: `${apiUrl}/api/login_user` });

//     const [data, setData] = useState('');
//     const [userData, setUserData] = useState('');
//     const [userType, setUserType] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const navigate = useNavigate();
//     const auth = useAuth();

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false); // To control modal visibility

// //    useEffect(() => {
// //     if (userData) {
// //            console.log('Calling auth.login with data:', userData); // Debugging line
// //            auth.login(userData); // Call auth.login with the updated data
// //            setIsLoading(false);

// //             if (userType === "agent" && userData.plan_id !== null) {
// //                   navigate("/dashboard_agent", { replace: true });
// //            }
// //            else if (userType === "agent" && userData.plan_id === null) {
// //                   navigate("/dashboard/plans", { replace: true });
// //            }
// //             else{
// //               navigate("/", { replace: true });     
// //      }
// //     }
// //   }, [userData]);

//   useEffect(() => {
//     if (response && !loadingPost) {
//       // if (error?.response?.data?.faield === "creational not Valid") {
//       //   toast.error("Email or Password is incorrect");
//       // }
//       console.log('Response:', response.data);
//      }
//   }, [response]);        
 
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!email) {
//       auth.toastError('Please Enter the Email.');
//       return;
//     }
//     if (!password) {
//       auth.toastError('Please Enter the Password.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('email', email);
//     formData.append('password', password);

//     // postData(formData,"Login successful!");
//     try {
//       const response = await axios.post(`${apiUrl}/api/login_user`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       if (response.status === 200) {
//          if (response.status === 200 || response.status === 201) {
//               auth.login(response.data);
//               //       console.log('Response:', response.data);
//               //       const userData = {
//               //         ...response.data.user,
//               //         roles: [response.data.user.role] // Assuming role is the user's role
//               //       };
//               // setUserData(userData);
//               // setUserType(response.data.user.role);
//               // console.log("response role", response.data.user.role);
//               }
//       } else {
//         toast.error('Unexpected error occurred during login.');
//       }
//     } catch (error) {
//       if (error?.response?.data?.errors === "The provided credentials are incorrect") {
//         toast.error("Email or Password is incorrect");
//       } else {
//       console.error('Error submitting form:', error);
//       toast.error(error?.response?.data?.error || 'Network error');
//     }}
//   };
  
//   if (isLoading) {
//     return (
//       <div className="w-1/4 h-full flex items-start mt-[10%] justify-center m-auto">
//         <Loading/>
//         </div>
//     );
//  }  

//   return (
//     <div className="sign-up-page flex flex-col items-center justify-center lg:justify-around w-full xl:h-screen lg:h-full text-secoundColor">

//          <div className='w-full flex flex-col-reverse md:flex-row items-center lg:justify-around w-full'>
//             <div className="xl:w-1/2 h-screen flex flex-col w-full justify-center bg-white rounded-lg p-6">
//               {/* Welcome Back Header */}
//               <h2 className="text-3xl font-bold">Welcome Back 👋</h2>
//               <p className="text-fourthColormt-2 mb-6">Login To Your Account</p>

//               {/* Form */}
//               <form className="w-full xl:w-3/4" onSubmit={handleSubmit}>
//                 <section className="flex flex-col gap-5">
//                   {/* Email Input */}
//                   <div className="w-full">
//                     <Input
//                       type="email"
//                       placeholder="Email"
//                       className="border border-gray-300 w-full px-4 py-3 rounded-lg text-black"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       required
//                     />
//                   </div>

//                   {/* Password Input with Eye Icon */}
//                   <div className="w-full relative">
//                     <Input
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Password"
//                       className="border border-gray-300 w-full px-4 py-3 rounded-lg pr-12"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       required
//                     />
//                     {/* Eye Icon */}
//                     <span
//                       className="absolute top-4 right-4 text-gray-500 cursor-pointer"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
//                     </span>
//                   </div>

//                   {/* Login Button (ShadCN) */}
//                   <Button size="lg" type="submit" className="w-full bg-gray-900 text-white text-lg rounded-lg hover:bg-opacity-90">
//                     {isLoading ? "Loading..." : "Login"}
//                   </Button>

                  // {/* Sign Up Link */}
                  // <p className="text-gray-600 text-center">
                  //   Don't have an account?{" "}
                  //   <Link to="/auth/sign_up" className="text-orange-500 font-semibold hover:underline">
                  //     Sign Up
                  //   </Link>
                  // </p>
//                 </section>
//               </form>
//             </div>

//             <div className="xl:w-1/2 w-full md:flex justify-center hidden">
//             <img src={MainImage} className='h-screen w-full'/>
//             </div>
//         </div>
  
//     </div>
//   );
// };

// export default LoginPage;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from 'react-toastify';
import { useAuth } from '../../Context/Auth';
import Loading from '../../Components/Loading';
import MainImage from '../../Assets/Images/MainImage.png';
import { usePost } from '../../Hooks/usePostJson';
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/Components/ui/dialog";

const LoginPage = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { postData, loadingPost, response } = usePost({ url: `${apiUrl}/api/login_user` });
    const { postData: postForgotPassword } = usePost({ url: `${apiUrl}/api/forget_password` });
    const { postData: postCheckCode } = usePost({ url: `${apiUrl}/api/check_code` });
    const { postData: postChangePassword } = usePost({ url: `${apiUrl}/api/change_password` });

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [modalStep, setModalStep] = useState(0); // 0: hidden, 1: enter email, 2: enter OTP, 3: reset password
    const [otpCode, setOtpCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const auth = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            auth.toastError('Email and Password are required');
            return;
        }
        postData({ email, password });
    };

    useEffect(() => {
        if (response && !loadingPost) {
            auth.login(response.data);
            navigate("/", { replace: true });
        }
    }, [response]);

    const handleForgotPassword = () => {
        if (!email) return toast.error('Please enter your email');
        postForgotPassword({ email }, 'Reset link sent to your email!');
        setModalStep(2);
    };

    const handleCheckCode = () => {
        if (!otpCode) return toast.error('Enter the OTP code');
        postCheckCode({ email, code: otpCode }, 'OTP verified!');
        setModalStep(3);
    };

    const handleChangePassword = () => {
        if (!newPassword) return toast.error('Enter a new password');
        postChangePassword({ email, code: otpCode, new_password: newPassword }, 'Password changed successfully!');
        setModalStep(0);
        setIsOpen(false);
    };

    return (
        <div className="sign-up-page flex flex-col items-center justify-center w-full text-secoundColor">
            <div className='w-full flex flex-col-reverse md:flex-row items-center lg:justify-around w-full'>
                <div className="xl:w-1/2 h-screen flex flex-col w-full justify-center bg-white rounded-lg p-6">
                    <h2 className="text-3xl font-bold">Welcome Back 👋</h2>
                    <p className="text-fourthColormt-2 mb-6">Login To Your Account</p>
                    <form className="w-full xl:w-3/4" onSubmit={handleSubmit}>
                        <Input type="email" placeholder="Email" className="border border-gray-300 w-full px-4 py-3 rounded-lg text-black" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <div className="w-full relative mt-4">
                            <Input type={showPassword ? "text" : "password"} placeholder="Password" className="border border-gray-300 w-full px-4 py-3 rounded-lg pr-12" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <span className="absolute top-4 right-4 text-gray-500 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                            </span>
                        </div>
                        <Button size="lg" type="submit" className="w-full bg-gray-900 text-white text-lg rounded-lg hover:bg-opacity-90 mt-4">Login</Button>
                        <p className="text-gray-600 text-center mt-4">
                            <button type="button" className="text-orange-500 font-semibold hover:underline" onClick={() => { setModalStep(1); setIsOpen(true); }}>Forgot Password?</button>
                        </p>
                  {/* Sign Up Link */}
                  <p className="text-gray-600 text-center">
                    Don't have an account?{" "}
                    <Link to="/auth/sign_up" className="text-orange-500 font-semibold hover:underline">
                      Sign Up
                    </Link>
                  </p>
                    </form>
                    
                </div>
                <div className="xl:w-1/2 w-full md:flex justify-center hidden">
                    <img src={MainImage} className='h-screen w-full' alt="Login"/>
                </div>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="w-96">
                    <DialogHeader>
                        <DialogTitle>
                            {modalStep === 1 && "Reset Password"}
                            {modalStep === 2 && "Enter OTP Code"}
                            {modalStep === 3 && "Set New Password"}
                        </DialogTitle>
                    </DialogHeader>
    
                    {modalStep === 1 && (
                        <>
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                                <Button className="bg-blue-600 text-white" onClick={handleForgotPassword}>Send Reset Code</Button>
                            </DialogFooter>
                        </>
                    )}
    
                    {modalStep === 2 && (
                        <>
                            <Input
                                type="text"
                                placeholder="Enter OTP Code"
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value)}
                                required
                            />
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setModalStep(1)}>Back</Button>
                                <Button className="bg-blue-600 text-white" onClick={handleCheckCode}>Verify Code</Button>
                            </DialogFooter>
                        </>
                    )}
    
                    {modalStep === 3 && (
                        <>
                            <Input
                                type="password"
                                placeholder="Enter New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setModalStep(2)}>Back</Button>
                                <Button className="bg-green-600 text-white" onClick={handleChangePassword}>Change Password</Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default LoginPage;
