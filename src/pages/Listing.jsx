import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase.config';
import Spinner from '../components/Spinner';
import ShareIcon from '../assets/svg/shareIcon.svg';
import { list } from 'firebase/storage';

function Listing() {

    const [listing,setListing] = useState(null);
    const [loading,setLoading] = useState(true);
    const [shareLinkCopied, setShareLinkCopied] = useState(false);

    const navigate = useNavigate();
    const params = useParams();
    const auth = getAuth();

    useEffect(() => {
        const fetchListing = async () => {
            const docRef = doc(db,'listings',params.listingId);
            const docSnap = await getDoc(docRef);

            if(docSnap.exists()){
                console.log(docSnap.data());
                setListing(docSnap.data());

                setLoading(false);
            }
        };

        fetchListing();
    }, [navigate, params.listingId]);

    if(loading){
      return <Spinner />
    };

  return (
    <main>
      {/* Slider */}
      <div className="shareIconDiv" onClick={() => {
        navigator.clipboard.writeText(window.location.href);

        setShareLinkCopied(true);
        setTimeout(() => {
          setShareLinkCopied(false);
        }, 2000);
      }}>
        <img src={ShareIcon} alt="" />
      </div>

      {shareLinkCopied && <p className='linkCopied'>Link Copied!</p>}
      <div className="listingDetails">
        <p className="listingName">
          {listing.name} - £{listing.offer.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') ? listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </p>
        <p className="listingLocation">
          {listing.location}
        </p>
        <p className="listingType">
          for {listing.type === 'rent' ? 'Rent' : 'sale'}
        </p>
        {listing.offer && (
          <p className="discountPrice">
            £{listing.regularPrice - listing.discountedPrice} Discount
          </p>
        )}
        <ul className="listingDetailsList">
          <li>
            {listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : '1 Bedroom'}
          </li>
          <li>
            {listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : '1 Bathroom'}
          </li>
          <li>{listing.parking && 'Parking Spot'}</li>
          <li>{listing.furnished && 'Furnished'}</li>
        </ul>
        <p className="listingLocationTitle">Location</p>
        {/* map */}

        {auth.currentUser?.uid !== listing.userRef && (
          <Link to={`/contact/${listing.userRef}?listingName=${listing.name}`} className='primaryButton'>Contact Link</Link>
        )}
      </div>
    </main>
  )
}

export default Listing