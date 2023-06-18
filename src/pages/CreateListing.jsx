import { useState, useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router';
import Spinner from '../components/Spinner';


function CreateListing() {

    const [geolocationEnabled,setGeolocationEnabled] = useState(true);
    const [loading,setLoading] = useState(false);
    const [formData,setFormData] = useState({
        type: 'rent',
        name: '',
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        address: '',
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        images: {},
        latitude: 0,
        longitude: 0,
    });
    // destructure from form data
    const { 
        type, 
        name, 
        bedrooms, 
        bathrooms, 
        parking, 
        furnished, 
        address, 
        offer, 
        regularPrice, 
        discountedPrice, 
        images, 
        longitude, 
        latitude 
    } = formData;

    const auth = getAuth();
    const navigate = useNavigate();
    const isMounted = useRef(true);

    useEffect(() => {
        if(isMounted){
            onAuthStateChanged(auth, (user) => {
                if(user){
                    setFormData({...formData, userRef: user.uid});
                } else {
                    navigate('/sign-in');
                };
            });
        };

        return () => {
            isMounted.current = false;
        };
    },[isMounted]);

    // events

    const onSubmit = (e) => {
        e.preventDefault();
    };

    const onMutate = (e) => {

    };

    if(loading){
        return <Spinner />
    }

  return (
      <div className='profile'>
          <header>
              <p className="pageHeader">Create a Listing</p>
          </header>
          <main>
              <form onSubmit={onSubmit}>
                  <label className='formLabel' htmlFor="formButtons">Sell / Rent</label>
                  <div className="formButtons">
                      {/* Sell btn */}
                      <button
                          type='button'
                          className={type === 'sale' ? 'formButtonActive' : 'formButton'}
                          id='type'
                          value='sale'
                          onClick={onMutate}
                      >
                          Sell
                      </button>
                      {/* Rent btn */}
                      <button
                          type='button'
                          className={type === 'rent' ? 'formButtonActive' : 'formButton'}
                          id='type'
                          value='rent'
                          onClick={onMutate}
                      >
                          Rent
                      </button>
                  </div>
                  {/* name  */}
                  <label className='formLabel' htmlFor="formInputName">Name</label>
                  <input
                      type="text"
                      className='formInputName'
                      id='name'
                      value={name}
                      onChange={onMutate}
                      maxLength='32'
                      minLength='10'
                      required
                  />
                  {/* bedrooms & bathrooms  */}
                  <div className="formRooms flex">
                      <div>
                          <label className='formLabel' htmlFor="bedrooms">Bedrooms</label>
                          <input
                              type="text"
                              className='formInputSmall'
                              id='bedrooms'
                              value={bedrooms}
                              onChange={onMutate}
                              min='1'
                              max='50'
                              required
                          />
                      </div>
                      <div>
                          <label className='formLabel' htmlFor="bathrooms">Bathrooms</label>
                          <input
                              type="text"
                              className='formInputSmall'
                              id='bathrooms'
                              value={bathrooms}
                              onChange={onMutate}
                              min='1'
                              max='50'
                              required
                          />
                      </div>
                  </div>
                  {/* parking */}
                  <label className='formLabel' htmlFor="formButtons">Parking spot</label>
                  <div className="formButtons">
                      <button
                          className={parking ? 'formButtonActive' : 'formButton'}
                          type='button'
                          id='parking'
                          value={true}
                          onClick={onMutate}
                      >
                          Yes
                      </button>
                      <button
                          className={!parking && parking !== null ? 'formButtonActive' : 'formButton'}
                          type='button'
                          id='parking'
                          value={false}
                          onClick={onMutate}
                      >
                          No
                      </button>
                  </div>
                  {/* furnished */}
                  <label className='formLabel' htmlFor="formButtons">Parking spot</label>
                  <div className="formButtons">
                      <button
                          className={furnished ? 'formButtonActive' : 'formButton'}
                          type='button'
                          id='furnished'
                          value={true}
                          onClick={onMutate}
                      >
                          Yes
                      </button>
                      <button
                          className={!furnished && furnished !== null ? 'formButtonActive' : 'formButton'}
                          type='button'
                          id='furnished'
                          value={false}
                          onClick={onMutate}
                      >
                          No
                      </button>
                  </div>
                  {/* address */}
                  <label className='formLabel' htmlFor="address">Address</label>
                  <textarea
                      className='formInputAddress'
                      name="address"
                      id="address"
                      onChange={onMutate}
                      value={address}
                      required
                  ></textarea>
                  {/* geolocation */}
                  {!geolocationEnabled && (
                      <div className='formLatLng flex'>
                          <div>
                              <label className='formLabel'>Latitude</label>
                              <input
                                  className='formInputSmall'
                                  type='number'
                                  id='latitude'
                                  value={latitude}
                                  onChange={onMutate}
                                  required
                              />
                          </div>
                          <div>
                              <label className='formLabel'>Longitude</label>
                              <input
                                  className='formInputSmall'
                                  type='number'
                                  id='longitude'
                                  value={longitude}
                                  onChange={onMutate}
                                  required
                              />
                          </div>
                      </div>
                  )}
                  {/* offers */}

                  <label className='formLabel'>Offer</label>
                  <div className='formButtons'>
                      <button
                          className={offer ? 'formButtonActive' : 'formButton'}
                          type='button'
                          id='offer'
                          value={true}
                          onClick={onMutate}
                      >
                          Yes
                      </button>
                      <button
                          className={
                              !offer && offer !== null ? 'formButtonActive' : 'formButton'
                          }
                          type='button'
                          id='offer'
                          value={false}
                          onClick={onMutate}
                      >
                          No
                      </button>
                  </div>
                  {/* regular price */}
                  <label className='formLabel'>Regular Price</label>
                  <div className='formPriceDiv'>
                      <input
                          className='formInputSmall'
                          type='number'
                          id='regularPrice'
                          value={regularPrice}
                          onChange={onMutate}
                          min='50'
                          max='750000000'
                          required
                      />
                      {type === 'rent' && <p className='formPriceText'>£ / Month</p>}
                  </div>
                  {/* offer */}
                  {/* discounted price */}
                  {offer && (
                      <>
                          <label className='formLabel'>Discounted Price</label>
                          <input
                              className='formInputSmall'
                              type='number'
                              id='discountedPrice'
                              value={discountedPrice}
                              onChange={onMutate}
                              min='50'
                              max='750000000'
                              required={offer}
                          />
                      </>
                  )}
                  {/* image */}
                  <label className='formLabel'>Images</label>
                  <p className='imagesInfo'>
                      The first image will be the cover (max 6).
                  </p>
                  <input
                      className='formInputFile'
                      type='file'
                      id='images'
                      onChange={onMutate}
                      max='6'
                      accept='.jpg,.png,.jpeg'
                      multiple
                      required
                  />
                  <button type='submit' className='primaryButton createListingButton'>
                      Create Listing
                  </button>
              </form>
          </main>
      </div>
  )
}

export default CreateListing