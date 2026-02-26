import { FaArrowLeft } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

const TitlePage = ({ text,nav }) => {
       const navigate = useNavigate()
       return (
              <>
                     <div className="w-full py-2 flex gap-3">
                          {
                            nav&&<button
                            onClick={() => navigate(-1)}
                            className=" top-2 text-mainColor text-2xl cursor-pointer hover:text-blue-500 transition-all"
                          >
                            <FaArrowLeft/>
                          </button>
                          }
                            <span className="text-3xl font-TextFontMedium text-mainColor">{text}</span>
                     </div>
              </>
       )
}

export default TitlePage