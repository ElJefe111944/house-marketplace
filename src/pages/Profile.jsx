import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getAuth, updateProfile } from "firebase/auth";
import { updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from "react-toastify";
import ListingItem from '../components/ListingItem'
import ArrowRight from '../assets/svg/keyboardArrowRightIcon.svg';
import HomeIcon from '../assets/svg/homeIcon.svg';
import { Link } from "react-router-dom";


function Profile() {

  const [loading,setLoading] = useState(true);
  const [listings,setListings] = useState({});

  const auth = getAuth();

  const[changeDetails,setChangeDetails] = useState(false);

  const [formData,setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  });

  const { name, email } = formData;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db,'listings');
      const q = query(
        listingsRef, 
        where('userRef','==',auth.currentUser.uid),
        orderBy('timestamp', 'desc')
      );

      const querySnap = await getDocs(q);

      let listings = [];

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data()
        });
      });

      setListings(listings);
      setLoading(false);
    };

    fetchUserListings();

  },[auth.currentUser.uid]);

  const onLogOut = () => {
    auth.signOut();
    navigate('/');
  };

  const onSubmit = async () => {

    try {
      if(auth.currentUser.displayName !== name){
        // update display name in firebase
        await updateProfile(auth.currentUser,{
          displayName: name,
        });

        // update in firestore
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
          name,
        });
      }

    } catch (error) {
      toast.error('Could not update profile details');
    }
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  };

  const onDelete = async (listingId) => {
    if(window.confirm('Are you sure you want to delete?')){
      await deleteDoc(doc(db,'listings',listingId));
      const updatedListings = listings.filter(() => listings.id !== listingId)

      setListings(updatedListings);
      toast.success('Successfully deleted listing');
    };
  };


  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button type="button" className="logOut" onClick={onLogOut}>Logout</button>
      </header>
      <main>
        <div className="profile-details-header">
          <p className="profileDetailsText">
            Personal Details
          </p>
          <p className="changePersonalDetails" onClick={() => {
            changeDetails && onSubmit();

            setChangeDetails((prevState) => !prevState);
          }}>
            {changeDetails ? 'Done' : 'Change'}
          </p>
        </div>
        <div className="profileCard">
          <form>
            <input type="text" id="name" className={!changeDetails ? 'profileName' : 'profileNameActive'} disabled={!changeDetails} value={name} onChange={onChange} />
            <input type="email" id="email" className={!changeDetails ? 'profileEmail' : 'profileEmailActive'} disabled={!changeDetails} value={email} onChange={onChange} />
          </form>
        </div>
        <Link to='/create-listing' className="createListing">
          <img src={HomeIcon} alt="Home" />
          <p>Sell or rent your home</p>
          <img src={ArrowRight} alt="arrow right" />
        </Link>
        {!loading && listings?.length > 0 && (
          <>
            <p className="listingText">
              Your Listings
            </p>
            <ul className="listingsList">
              {listings.map((listing) => (
                <ListingItem key={listing.id} listing={listing.data} id={listing.id} onDelete={() => onDelete(listing.id)} />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  )
}

export default Profile