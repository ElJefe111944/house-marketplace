import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase.config';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import 'swiper/css/navigation';
import Spinner from './Spinner';


function Slider() {

    const [loading,setLoading] = useState(true);
    const [listings,setListings] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {

        const fetchListings = async () => {
            const listingsRef = collection(db, 'listings');
            const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5));
            const querySnap = await getDocs(q);
    
            let listings = [];
    
            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                });
            });
            console.log(listings)
            setListings(listings);
            setLoading(false);
        };

        fetchListings();
    }, []);


    if(loading){
        return <Spinner />
    }

  return listings && (
    <>
        <p className="exploreHeading">
            Recommeded
        </p>
        <Swiper
             modules={[Navigation, Pagination, Scrollbar, A11y]}
             slidesPerView={1}
             pagination={{ clickable: true }}
             scrollbar={{ draggable: true }}
             navigation
             style={{ height: "300px" }}
        >
            {listings.map(({ data, id }) => {
                <SwiperSlide key={id} onClick={() => navigate(`/category/${data.type}/${id}`)}>
                    <div style={{
                        background: `url(${data.imageUrls[0]}) center no-repeat`,
                        backgroundSize: 'cover'
                    }} className="swiperSlideDiv">

                    </div>
                </SwiperSlide>
            })}
        </Swiper>
    </>
  )
}

export default Slider