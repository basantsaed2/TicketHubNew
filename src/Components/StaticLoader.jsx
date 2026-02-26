import React from 'react'
import { DotLoader} from 'react-spinners'

const StaticLoader = () => {
       return (
              <>
                     <div className='w-full h-full flex justify-center items-center'>
                            <DotLoader color='#F58220' size={60} />
                     </div>
              </>
       )
}

export default StaticLoader