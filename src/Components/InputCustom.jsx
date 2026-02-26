import React, { useState } from 'react'
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { LuUpload } from "react-icons/lu";
import { FaExternalLinkAlt } from "react-icons/fa";
import { FaLink } from "react-icons/fa6";

const InputCustom = ({ type,bgColor,placeholderColor, required = true,textSize="xl", minDate = true,borderWidth="2", borderColor = "none", placeholder, placeholderSize = false, value, readonly = false, onChange, iconDirection = false, textDirection = false, onClick, paddinLeft = 'pl-2', paddinRight = 'pr-2', upload = false, source }) => {
       const [show, setShow] = useState(false)
       const [currentDay, setCurrentDay] = useState(new Date());
       const formattedDate = currentDay.toISOString().split('T')[0]; // Format as YYYY-MM-DD

       if (type === "password") {
              return (<>
                     <div className="relative w-full">
                            <input type={show ? "text" : "password"} placeholder={placeholder}
                     //         className={`w-full border-${borderWidth} placeholder-${placeholderColor} ${bgColor}  tex-left rounded-lg border-${borderColor} 
                     //  focus:outline-none focus:ring-1 focus:ring-mainColor px-2 py-2 ${paddinLeft} ${paddinRight} text-${textSize}   ${placeholderSize ? 'text-lg' : 'text-2xl'} font-normal eleValueInput `} 
                     className={`w-full rounded-lg border-2 border-gray-300 bg-white 
                            px-5 py-3 text-md text-gray-800 placeholder-gray-400 shadow-md focus:outline-none 
                            focus:border-blue-500 focus:ring-2 focus:ring-blue-300 
                            transition-all duration-300 ease-in-out 
                            hover:shadow-lg hover:ring-1 hover:ring-gray-300`}
                      value={value}
                                   onChange={onChange} required={required} />
                            {show ? (
                                   <IoMdEye
                                          className={`absolute top-4 right-2 text-2xl text-mainColor cursor-pointer`}
                                          onClick={() => setShow(!show)}
                                   />
                            ) : (
                                   <IoMdEyeOff
                                          className={`absolute top-4 right-2 text-2xl text-mainColor cursor-pointer`}
                                          onClick={() => setShow(!show)}
                                   />
                            )}

                     </div>
              </>)
       }
       if (type === "date") {
              return (
                     <>
                            <input
                                   type="date"
                                   placeholder={placeholder}
                                   className={`w-full border-2 rounded-2xl border-${borderColor} 
          outline-none px-2 py-3 text-2xl font-normal text-thirdColor tex-left `}
                                   value={value}
                                   onChange={onChange}
                                   min={minDate ? formattedDate : ''}  // Use the correctly formatted date
                                   required={required}
                            />
                     </>
              )
       }
       if (type === "dateEdit") {
              return (
                     <>
                            <input
                                   type="date"
                                   placeholder={placeholder}
                                   className={`w-full border-2 rounded-2xl border-${borderColor} 
          outline-none px-2 py-3 text-2xl font-normal text-thirdColor`}
                                   value={value}
                                   onChange={onChange}
                                   required={required}
                            />
                     </>
              )
       }
       return (
              <>
                     <div className="relative w-full">

                            {/* <input type={type}
                                   placeholder={placeholder}
                                   className={`w-full border-${borderWidth} placeholder-${placeholderColor} ${bgColor}  tex-left rounded-lg border-${borderColor} 
                      focus:outline-none focus:ring-1 focus:ring-mainColor px-2 py-2 ${paddinLeft} ${paddinRight} text-${textSize}  ${placeholderSize ? 'text-lg' : 'text-2xl'} font-normal eleValueInput ${upload ? "text-mainColor cursor-pointer pr-10" : "text-black"}`}
                                   value={value}
                                   onChange={onChange}
                                   onClick={onClick}
                                   readOnly={readonly}
                                   required={required} 
                                   autoComplete="off"
                            /> */}

<input
  type={type}
  placeholder={placeholder}
  className={`w-full rounded-lg border-2 border-gray-300 bg-white 
  px-5 py-3 text-md text-gray-800 placeholder-gray-400 shadow-md focus:outline-none 
  focus:border-blue-500 focus:ring-2 focus:ring-blue-300 
  transition-all duration-300 ease-in-out 
  hover:shadow-lg hover:ring-1 hover:ring-gray-300
  ${upload ? "text-blue-600 cursor-pointer pr-10" : ""}
  ${readonly ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""}`}

  value={value}
  onChange={onChange}
  onClick={onClick}
  readOnly={readonly}
  required={required}
  autoComplete="off"
/>


                            {upload ? <LuUpload className={`absolute  top-1/3 text-mainColor text-xl cursor-pointer right-2`} /> : ''}
                            {source == 'external' ? <FaExternalLinkAlt className='absolute right-4 top-1/3 text-mainColor text-xl cursor-pointer' /> :
                                   source == 'embedded' ? <FaLink className='absolute top-1/3 text-mainColor text-xl cursor-pointer' /> :
                                          source == 'upload' ? <LuUpload className={`absolute right-4 top-1/3 text-mainColor text-xl cursor-pointer ${iconDirection ? 'left-4' : 'right-2'} `} />
                                                 : ''}
                            {/* external, embedded, upload */}
                     </div>


              </>

       )
}

export default InputCustom