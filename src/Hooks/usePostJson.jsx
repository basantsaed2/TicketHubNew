import axios from "axios";
import { useState } from "react";
import { useAuth } from "../Context/Auth"; // Make sure to import useAuth if required
// import { TfiUppercase } from "react-icons/tfi";
// import { useSelector } from "react-redux";

export const usePost = ({ url, login = false, type = false }) => {
       const auth = useAuth();
       // const user = useSelector(state => state.user)
       const [loadingPost, setLoadingPost] = useState(false);
       const [response, setResponse] = useState(null);

       const postData = async (data, name) => {
              setLoadingPost(true);
              try {
                     const contentType = type ? 'application/json' : 'multipart/form-data';
                     const config = !login && auth.user?.token
                            ? {
                                   headers: {
                                          'Content-Type': contentType,
                                          'Authorization': `Bearer ${auth.user?.token || ''}`,
                                   },
                            }
                            : {
                                   headers: { 'Content-Type': contentType },
                            };

                     const response = await axios.post(url, data, config);

                     if (response.status === 200 || response.status === 201) {
                            setResponse(response);
                            { name ? auth.toastSuccess(name) : '' }   
                            // auth.toastSuccess(name)
                     }
              } 
              // catch (error) {
              //        // auth.toastError(error.message)
              //        console.error('error post Json', error);
              //        if (error?.response?.data?.errors) {
              //               Object.entries(error?.response?.data?.errors).forEach(([field, messages]) => {
              //                 messages.forEach(message => {
              //                      auth.toastError(`${message}`); // Display the error messages
              //                 });
              //               });
              //             }
              // } 
              catch (error) {
                     console.error('Error post JSON:', error);
                   
                     // Check if the error response contains 'errors' or just a message
                     if (error?.response?.data?.errors) {
                       // Check if errors are an object (field-based errors)
                       if (typeof error.response.data.errors === 'object') {
                         Object.entries(error.response.data.errors).forEach(([field, messages]) => {
                           // If messages is an array, loop through them
                           if (Array.isArray(messages)) {
                             messages.forEach(message => {
                               auth.toastError(message); // Display the error messages
                             });
                           } else {
                             // If it's not an array, display the message directly
                             auth.toastError(messages);
                           }
                         });
                       } else {
                         // If errors is not an object, assume it's just a message
                         auth.toastError(error.response.data.errors);
                       }
                     } else if (error?.response?.data?.message) {
                       // If there's a general message outside of the 'errors' object
                       auth.toastError(error.response.data.message); // Display the general error message
                     } else {
                       // If no specific error messages are found, just display a fallback message
                       auth.toastError('An unknown error occurred.');
                     }
                   }
                   
              finally {
                     setLoadingPost(false);
              }
       };

       return { postData, loadingPost, response };
};
