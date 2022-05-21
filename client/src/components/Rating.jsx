import React from 'react'
import { IoIosStar, IoIosStarHalf, IoIosStarOutline} from 'react-icons/io'

const Rating = (props) => {
    const { rating } = props;
  return (
    <div className='text-indigo-700'>
        <span>
            {rating >= 1 
            ? <IoIosStar />
            : rating >= 0.5
            ? <IoIosStarHalf />
            : <IoIosStarOutline />
            }
        </span>
        <span>
            {rating >= 2 
            ? <IoIosStar />
            : rating >= 1.5
            ? <IoIosStarHalf />
            : <IoIosStarOutline />
            }
        </span>
        <span>
            {rating >= 3 
            ? <IoIosStar />
            : rating >= 2.5
            ? <IoIosStarHalf />
            : <IoIosStarOutline />
            }
        </span>
        <span>
            {rating >= 4
            ? <IoIosStar />
            : rating >= 3.5
            ? <IoIosStarHalf />
            : <IoIosStarOutline />
            }
        </span>
        <span>
            {rating >= 5
            ? <IoIosStar />
            : rating >= 4.5
            ? <IoIosStarHalf />
            : <IoIosStarOutline />
            }
        </span>
    </div>
  )
}

export default Rating