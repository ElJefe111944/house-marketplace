import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { collection, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';

function Category() {

    const [listings,setListings] = useState(null);
    const [loading,setLoading] = useState(true);
    const [lastFetchedListing,setLastFetchedListing] = useState(null);

    const params = useParams();

    useEffect(() => {
        const fetchListings = async () => {
            try {
                // get reference
                const listingRef = collection(db,'listings');

                // create a query 
                const q = query(
                    listingRef, 
                    where('type','==',params.categoryName), 
                    orderBy('timestamp','desc'), 
                    limit(5),
                    );

                // execute query
                const querySnap  = await getDocs(q);

                const lastVisible = querySnap.docs[querySnap.docs.length - 1];
                setLastFetchedListing(lastFetchedListing);

                const listings = [];

                querySnap.forEach((doc) => {
                    console.log(doc.data())
                    return listings.push({
                        id: doc.id,
                        data: doc.data(),
                    });
                });

                setListings(listings);
                setLoading(false);

            } catch (error){
                toast.error('Could not fect listings');
            }
        };

        fetchListings();
    }, [params.categoryName]);

    // pagination / load more
    const onFetchMoreListings = async () => {
        try {
            // get reference
            const listingRef = collection(db,'listings');

            // create a query 
            const q = query(
                listingRef, 
                where('type','==',params.categoryName), 
                orderBy('timestamp','desc'), 
                limit(5),
                startAfter(lastFetchedListing),
                );

            // execute query
            const querySnap  = await getDocs(q);

            const lastVisible = querySnap.docs[querySnap.docs.length - 1];
            setLastFetchedListing(lastFetchedListing);

            const listings = [];

            querySnap.forEach((doc) => {
                console.log(doc.data())
                return listings.push({
                    id: doc.id,
                    data: doc.data(),
                });
            });

            setListings((prevState) => [...prevState, ...listings]);
            setLoading(false);

        } catch (error){
            toast.error('Could not fect listings');
        }
    };


  return (
    <div className='category'>
        <header>
            <p className="pageHeader">
                {params.categoryName === 'rent' ? 'Places for rent' : 'Places for sale'}
            </p>
        </header>
        {loading ? (<Spinner />) : listings && listings.length > 0 ? (<>
            <main>
                <ul className="categoryListings">
                    {listings.map((listing) => (
                        <ListingItem listing={listing.data} id={listing.id} key={listing.id} />
                    ))}
                </ul>
            </main>
            
            <br />
            <br />
            {lastFetchedListing && (
                <p className="loadMore" onClick={onFetchMoreListings}>
                    Load More
                </p>
            )}

        </>) : (<p>No listings for {params.categoryName}</p>)}
    </div>
  )
}

export default Category