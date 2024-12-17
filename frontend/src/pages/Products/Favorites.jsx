import {useSelector} from 'react-redux';
import setFavoriteProduct from '../../Redux/features/favorites/favoriteSlice.js';
import Product from './Product.jsx'



const Favorites = () => {
    const favorite = useSelector(state => state.favorite);
  return (
    <div className='ml-[10rem]'>
        <h1 className="text-lg font-bold ml-[3rem] mt-[3rem]">
            FAVORITE PRODUCTS
        </h1>
        <div className="flex flex-wrap">
        {favorite.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default Favorites