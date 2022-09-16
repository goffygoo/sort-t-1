import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import './App.css';

function App() {
  const [meta, setMeta] = useState([])
  const [arr, setArr] = useState([])
  const [showImg, setShowImg] = useState([])
  const [showMore, setShowMore] = useState(false)
  const [filter, setFilter] = useState({})

  const reset = () => {
    setArr(meta)
    setFilter({})
  }

  const apply = () => {
    let [...temp] = arr;

    if (filter.from !== undefined) {
      temp = temp.filter(({sellPrice}) => sellPrice >= filter.from)
    }

    if (filter.to !== undefined) {
      temp = temp.filter(({sellPrice}) => sellPrice <= filter.to)
    }

    if (filter.discount !== undefined) {
      temp = temp.filter(({discountPercentage}) => discountPercentage >= filter.discount)
    }

    if (filter.rating !== undefined) {
      temp = temp.filter(({rating}) => rating >= filter.rating)
    }

    if (filter.search !== undefined) {
      temp = temp.filter(obj => {
        for (let key in obj) {
          if (typeof(obj[key]) === "string" && obj[key].toLowerCase().includes(filter.search.toLowerCase())) {
            return true
          }
        }
        return false
      })
    }

    setArr(temp)
  }

  const filterCategory = slug => {
    setArr(([...pre]) => pre.filter(({category}) => category === slug))
    setFilter(pre => ({...pre, category: slug}))
  }

  const filterBrand = slug => {
    setArr(([...pre]) => pre.filter(({brand}) => brand === slug))
    setFilter(pre => ({...pre, brand: slug}))
  }

  const filterFrom = slug => {
    const v = +slug

    if (isNaN(v) || v < 0) return
    
    setFilter(pre => ({...pre, from: slug}))
  }

  const filterTo = slug => {
    const v = +slug

    if (isNaN(v) || v < 0) return
    
    setFilter(pre => ({...pre, to: slug}))
  }

  const filterDiscount = slug => {
    const v = +slug

    if (isNaN(v) || v < 0 || v > 100) return
    
    setFilter(pre => ({...pre, discount: slug}))
  }

  const filterRating = slug => {
    const v = +slug

    if (isNaN(v) || v < 0 || v > 5) return
    
    setFilter(pre => ({...pre, rating: slug}))
  }

  const filterSearch = slug => {
    setFilter(pre => ({...pre, search: slug}))
  }

  useEffect(() => {
    axios.get('https://dummyjson.com/products?limit=100').then(res => {
      const val = res.data.products.map(obj => ({...obj, sellPrice: +(Math.round(obj.price * (100 - obj.discountPercentage) / 100).toFixed(2))}))
      setMeta(val)
      setArr(val)
    }).catch(err => {
      console.log(err)
    })
  }, [])
  
  return (
    <>
      {
        showImg.length !== 0 ?
          <div className='popup'>
            <div className='popupContainer'>
              <button onClick={() => setShowImg([])}>Close</button>
              <div className='imgScroll'>
                {showImg.map(img => <img src={img} alt='' />)}
              </div>
            </div>
          </div>
          : null
      }
      <div className="App">
        <div className='filter'>
          <div className='filterDisplay'>
            <p>Showing only <span>{filter.category === undefined ? 'all' : filter.category}</span> by <span>{filter.brand === undefined ? "all" : filter.brand}</span> </p>
            <button onClick={() => apply()}>Apply</button>
            <button onClick={() => reset()}>Reset</button>
          </div>

          <div className='filterParams'>
            <div className='priceParam'>
              <p>Price from</p>
              <input type="number" placeholder='minimum' value={filter.from ? filter.from : ""} onChange={e => filterFrom(e.target.value)} />
              <p>to</p>
              <input type="number" placeholder='maximum' value={filter.to ? filter.to : ""} onChange={e => filterTo(e.target.value)} />
            </div>

            <div className='discountParam'>
              <p>Minimum discount</p>
              <input type="number" placeholder='in percentage' value={filter.discount ? filter.discount : ""} onChange={e => filterDiscount(e.target.value)} />
              <p>%</p>
            </div>

            <div className='ratingParam'>
              <p>Minimum rating</p>
              <input type="number" placeholder='out of 5' value={filter.rating ? filter.rating : ""} onChange={e => filterRating(e.target.value)} />
            </div>
          </div>

          <div className='filterSearch'>
            <p>Search with Keywords</p>
            <input spellCheck="false" placeholder='Enter your query' value={filter.search ? filter.search : ""} onChange={e => filterSearch(e.target.value)} />
            {
              showMore ? 
              <div className='details'>
                  <p>This is filter dashboard used to filter through the search results.</p>
                  <p>Provide only those field which you wants to filter for and click apply. The rest will be default.</p>
                  <p>The search results are nested. That is you can search on already searched results.</p>
                  <p>Click reset to start over.</p>
                  <p>To search for products of any specific brand you have to click on that specific brand.</p>
                  <p>To search for any specific category you have to click on that specific category.</p>
              </div>
              : null
            }
            <p className='showMore' onClick={() => setShowMore(v => !v)}>show {showMore ? "less" : "more"}</p>
          </div>
        </div>
        <div className='products'>
          {arr.map(({ id, title, description, price, sellPrice, discountPercentage, rating, stock, brand, category, thumbnail, images }) => {
            return (
              <div key={id} className='card'>
                <div className='cardText'>
                  <p className='category' onClick={() => filterCategory(category)}>{category}</p>
                  <p className='title'>{title}</p>
                  <p className='brand' onClick={() => filterBrand(brand)}>By <span>{brand}</span></p>
                  <p className='description'>{description}</p>
                  <div className='rating'>
                    <div><span style={{ backgroundColor: `rgb(${Math.floor((5 - rating) / 5 * 255)}, ${Math.floor(rating / 5 * 255)}, 0)`, width: `${rating * 100 / 5}%` }} /></div>
                    <p>{rating}</p>
                  </div>
                  <p className='price'><span>{price}</span> <b>{sellPrice}</b> USD (<b>{discountPercentage}%</b> off)</p>
                  <p className='stock'>Only {stock} left</p>
                  <div className='buy'>
                    <p>Buy Now</p>
                  </div>
                </div>
                <div className='image' onClick={() => setShowImg(images)}>
                  <img src={thumbnail} alt='' />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  );
}

export default App;
