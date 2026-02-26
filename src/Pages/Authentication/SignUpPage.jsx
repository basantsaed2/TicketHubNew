import React, { useState ,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from 'react-toastify';
import { useAuth } from '../../Context/Auth';
import Loading from '../../Components/Loading';
import MainImage from'../../Assets/Images/MainImage.png'
import { usePost } from '../../Hooks/usePostJson';
import {useGet} from '../../Hooks/useGet';
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";

import axios from 'axios';
const SignUpPage = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const {postData, loadingPost, response} = usePost({ url: `${apiUrl}/api/register` });
    const { refetch: refetchList, loading: loadingList, data: dataList } = useGet({url: `${apiUrl}/api/lists`,});
    const [nationality, setNationality] = useState([]);
    const [selectedNationality, setSelectedNationality] = useState('');
    const [selectedGender, setSelectedGender] = useState('');

    const [data, setData] = useState('');
    const [userData, setUserData] = useState('');
    const [userType, setUserType] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const auth = useAuth();

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        refetchList();
    }, [refetchList]);

    useEffect(() => {
        if (dataList && dataList.nationality) {
            setNationality(dataList.nationality)
        }
    }, [dataList]);

    useEffect(() => {
        if (response) {
            console.log('response', response)
            auth.login(response.data)
            navigate("/", { replace: true });
        }
    }, [response])

//    useEffect(() => {
//     if (userData) {
//            console.log('Calling auth.login with data:', userData); // Debugging line
//            auth.login(userData); // Call auth.login with the updated data
//            setIsLoading(false);

//             if (userType === "agent" && userData.plan_id !== null) {
//                   navigate("/dashboard_agent", { replace: true });
//            }
//            else if (userType === "agent" && userData.plan_id === null) {
//                   navigate("/dashboard/plans", { replace: true });
//            }
//             else{
//               navigate("/", { replace: true });     
//      }
//     }
//   }, [userData]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      auth.toastError('Please Enter the Email.');
      return;
    }
    if (!password) {
      auth.toastError('Please Enter the Password.');
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('nationality_id', selectedNationality);
    formData.append('gender', selectedGender);
    postData(formData);
    // try {
    //   const response = await axios.post(`${apiUrl}/register`, formData, {
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //     },
    //   });

    //   if (response.status === 200) {
    //         if (response.status === 200 || response.status === 201) {
    //           toast.success('Login successful!');
    //                 console.log('Response:', response.data);
    //                 auth.login(response.data)
    //         //         const userData = {
    //         //           ...response.data.user,
    //         //           roles: [response.data.user.role] // Assuming role is the user's role
    //         //         };
    //         //   setUserData(userData);
    //         //   setUserType(response.data.user.role);
    //         //   console.log("response role", response.data.user.role);
    //         }
    //   } else {
    //     toast.error('Unexpected error occurred during login.');
    //   }
    // } catch (error) {
    //   if (error?.response?.data?.errors === "The provided credentials are incorrect") {
    //     toast.error("Email or Password is incorrect");
    //   } else {
    //   console.error('Error submitting form:', error);
    //   toast.error(error?.response?.data?.error || 'Network error');
    // }}
  };
  
  if (isLoading) {
    return (
      <div className="w-1/4 h-full flex items-start mt-[10%] justify-center m-auto">
        <Loading/>
        </div>
    );
 }  

  return (
    <div className="sign-up-page flex flex-col items-center justify-center lg:justify-around w-full xl:h-screen lg:h-full text-secoundColor">

         <div className='w-full flex flex-col-reverse md:flex-row items-center lg:justify-around w-full'>
            <div className="xl:w-1/2 h-screen flex flex-col w-full justify-center md:justify-start bg-white rounded-lg p-6">
              {/* Welcome Back Header */}
              <h2 className="text-2xl md:text-3xl font-bold">Sign Up To Ticket Hub</h2>
              <p className="text-fourthColor mt-3 mb-6">Create A New Account</p>

              {/* Form */}
              <form className="w-full xl:w-3/4" onSubmit={handleSubmit}>
                <section className="flex flex-col gap-5">
                    {/* Name Input */}
                    <div className="w-full">
                        <Input
                        type="text"
                        placeholder="Name"
                        className="border border-gray-300 w-full px-4 py-3 rounded-lg text-black"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        />
                    </div>
                    {/* Phone Input */}
                    <div className="w-full">
                        <Input
                        type="text"
                        placeholder="Phone"
                        className="border border-gray-300 w-full px-4 py-3 rounded-lg text-black"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        />
                    </div>
                    {/* Nationality Input */}
                    <div className="w-full">
                        <Select onValueChange={setSelectedNationality}>
                        <SelectTrigger className="border border-gray-300 w-full px-4 py-3 rounded-lg text-black">
                            <SelectValue placeholder="Choose Nationality" />
                        </SelectTrigger>
                        <SelectContent>
                            {nationality.map((item) => (
                            <SelectItem key={item.id} value={String(item.id)}>
                                {item.name}
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    </div>
                     {/* Gender Input */}
                     <div className="w-full">
                        <Select onValueChange={setSelectedGender}>
                        <SelectTrigger className="border border-gray-300 w-full px-4 py-3 rounded-lg text-black">
                            <SelectValue placeholder="Choose Gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Prefer not to say</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>
                    {/* Email Input */}
                    <div className="w-full">
                        <Input
                        type="email"
                        placeholder="Email"
                        className="border border-gray-300 w-full px-4 py-3 rounded-lg text-black"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        />
                    </div>

                    {/* Password Input with Eye Icon */}
                    <div className="w-full relative">
                        <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="border border-gray-300 w-full px-4 py-3 rounded-lg pr-12"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        />
                        {/* Eye Icon */}
                        <span
                        className="absolute top-4 right-4 text-gray-500 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                        >
                        {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                        </span>
                    </div>

                  {/* Login Button (ShadCN) */}
                  <Button size="lg" type="submit" className="w-full bg-gray-900 text-white text-lg rounded-lg hover:bg-opacity-90">
                    {isLoading ? "Loading..." : "SignUp"}
                  </Button>

                  {/* Sign Up Link */}
                  <p className="text-gray-600 text-center">
                    Have an account?{" "}
                    <Link to="/auth/login" className="text-orange-500 font-semibold hover:underline">
                      LogIn
                    </Link>
                  </p>
                </section>
              </form>
            </div>

            <div className="xl:w-1/2 w-full md:flex justify-center hidden">
            <img src={MainImage} className='h-screen w-full'/>
            </div>
        </div>
  
    </div>
  );
};

export default SignUpPage;
