import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Grid, Paper, Select, MenuItem, InputLabel, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { styled } from '@mui/system';

export const EditListing = () => {
  const [listingDetails, setListingDetails] = useState({ listing: { thumbnail: [] } });
  const { listingId } = useParams();
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    postcode: '',
    country: ''
  });
  const whenAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
  };
  const [propertyAmenities, setPropertyAmenities] = useState(listingDetails.listing.metadata?.propertyAmenities || []);
  const whenPropertyAmeChange = (event) => {
    const value = event.target.value;
    setPropertyAmenities((currentAmenities) => {
      if (currentAmenities.includes(value)) {
        return currentAmenities.filter((amenity) => amenity !== value);
      } else {
        return [...currentAmenities, value];
      }
    });
  };
  // get details and display
  useEffect(() => {
    const fetchDetails = async () => {
      const token = localStorage.getItem('token');
      const url = `http://localhost:5005/listings/${listingId}`;
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setListingDetails(data);
        if (data && data.listing && data.listing.address) {
          setAddress(data.listing.address);
        }
        if (data && data.listing && data.listing.metadata && data.listing.metadata.propertyAmenities) {
          setPropertyAmenities(data.listing.metadata.propertyAmenities);
        }
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };
    fetchDetails();
  }, [listingId]);
  if (!listingDetails) {
    return <div>No listing</div>;
  }
  // put changed details
  const ChangeEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = `http://localhost:5005/listings/${listingId}`;
      const updatedData = {
        title: listingDetails.listing.title,
        address,
        price: listingDetails.listing.price,
        thumbnail: listingDetails.listing.thumbnail,
        metadata: {
          propertyType: listingDetails.listing.metadata.propertyType,
          propertyBath: listingDetails.listing.metadata.propertyBath,
          propertyBed: listingDetails.listing.metadata.propertyBed,
          propertyBedNum: listingDetails.listing.metadata.propertyBedNum,
          propertyAmenities
        }
      };
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData)
      });
      const res = await response.json();
      if (response.ok) {
        console.log('Update successful:', res);
        navigate('/yourList');
      } else {
        console.error('Failed to update data:', res);
      }
    } catch (error) {
      console.error('Failed to update listing:', error);
    }
  };

  const ScrollContainer = styled('div')({
    maxHeight: '400px',
    overflowY: 'auto',
    overflowX: 'hidden'
  });
  const whenImageChange = (event) => {
    const files = Array.from(event.target.files);
    const newImageData = [...listingDetails.listing.thumbnail];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImageData.push(reader.result);
        setListingDetails({ ...listingDetails, listing: { ...listingDetails.listing, thumbnail: newImageData } });
      };
      reader.readAsDataURL(file);
    });
  };
  const navigate = useNavigate();
  const whenRemoveImage = (index) => {
    const newImageData = listingDetails.listing.thumbnail.filter((_, i) => i !== index);
    setListingDetails({ ...listingDetails, listing: { ...listingDetails.listing, thumbnail: newImageData } });
  };
  const renderThumbnails = () => {
    return listingDetails.listing.thumbnail.map((src, index) => (
      <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <img src={src} alt={`Thumbnail ${index}`} style={{ width: '150px', height: '150px' }} />
        <Button id='remove' variant='outlined' color='secondary' size='small' onClick={() => whenRemoveImage(index)}>
          Remove
        </Button>
      </div>
    ));
  };
  const propertyTypes = ['House', 'Apartment', 'Castle', 'Hotel'];
  const propertyBaths = [1, 2, 3, 4];
  const propertyBeds = [1, 2, 3, 4];
  const propertyBedNums = [1, 2, 3, 4];

  return (
    <Box>
      <Grid container spacing={4} justifyContent='center' marginTop='0px'>
        <Grid item xs={10} sm={10} md={10}>
          <Typography style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant='contained' color='primary' onClick={() => navigate('/yourList')}>Back to Your Listings</Button>
            <Button id='save' variant='contained' color='secondary' onClick={ChangeEdit}>Save Changes</Button>
          </Typography>
        </Grid>
        <Grid item xs={10} sm={5} md={5}>
          <Paper elevation={3}>
            <Typography marginLeft='20px' marginRight='20px'>
              <TextField
                fullWidth
                id='title'
                label='Title:'
                value={listingDetails.listing.title || ''}
                onChange={(e) => setListingDetails({ ...listingDetails, listing: { ...listingDetails.listing, title: e.target.value } })}
                />
            </Typography>
            <Typography margin='20px'>
              <TextField
                fullWidth
                label='Street'
                name='street'
                value={address.street}
                onChange={whenAddressChange}
              />
            </Typography>
            <Typography margin='20px'>
              <TextField
                fullWidth
                label='City'
                name='city'
                value={address.city}
                onChange={whenAddressChange}
              />
            </Typography>
            <Typography margin='20px'>
              <TextField
                fullWidth
                label='State'
                name='state'
                value={address.state}
                onChange={whenAddressChange}
              />
            </Typography>
            <Typography margin='20px'>
              <TextField
                fullWidth
                label='Postcode'
                name='postcode'
                value={address.postcode}
                onChange={whenAddressChange}
              />
            </Typography>
            <Typography margin='20px'>
              <TextField
                fullWidth
                label='Country'
                name='country'
                value={address.country}
                onChange={whenAddressChange}
              />
            </Typography>
            <Typography margin='20px'>
              <TextField
                fullWidth
                label='Price (per night):'
                value={listingDetails.listing.price || ''}
                onChange={(e) => setListingDetails({ ...listingDetails, listing: { ...listingDetails.listing, price: e.target.value } })}
                />
            </Typography>
            <Typography margin='20px'>
              <FormControl fullWidth>
                <InputLabel id='property-type-label'>Property type</InputLabel>
                <Select
                  labelId='property-type-label'
                  value={listingDetails.listing.metadata?.propertyType || ''}
                  onChange={(e) => setListingDetails({ ...listingDetails, listing: { ...listingDetails.listing, metadata: { ...listingDetails.listing.metadata, propertyType: e.target.value } } })}
                >
                  {propertyTypes.map((type, index) => (
                    <MenuItem key={index} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Typography>
            <Typography margin='20px'>
              <FormControl fullWidth>
                <InputLabel id='property-bath-label'>Number of bathrooms</InputLabel>
                <Select
                  labelId='property-bath-label'
                  value={listingDetails.listing.metadata?.propertyBath || ''}
                  onChange={(e) => setListingDetails({ ...listingDetails, listing: { ...listingDetails.listing, metadata: { ...listingDetails.listing.metadata, propertyBath: e.target.value } } })}
                >
                  {propertyBaths.map((bath, index) => (
                    <MenuItem key={index} value={bath}>{bath}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Typography>
            <Typography margin='20px'>
              <FormControl fullWidth>
                <InputLabel id='property-bed-label'>Number of bedrooms</InputLabel>
                <Select
                  labelId='property-bed-label'
                  value={listingDetails.listing.metadata?.propertyBed || ''}
                  onChange={(e) => setListingDetails({ ...listingDetails, listing: { ...listingDetails.listing, metadata: { ...listingDetails.listing.metadata, propertyBed: e.target.value } } })}
                >
                  {propertyBeds.map((bed, index) => (
                    <MenuItem key={index} value={bed}>{bed}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Typography>
            <Typography margin='20px'>
              <FormControl fullWidth>
                <InputLabel id='property-bednum-label'>Number of beds</InputLabel>
                <Select
                  labelId='property-bednum-label'
                  value={listingDetails.listing.metadata?.propertyBedNum || ''}
                  onChange={(e) => setListingDetails({ ...listingDetails, listing: { ...listingDetails.listing, metadata: { ...listingDetails.listing.metadata, propertyBedNum: e.target.value } } })}
                >
                  {propertyBedNums.map((bedNum, index) => (
                    <MenuItem key={index} value={bedNum}>{bedNum}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Typography>
            <Typography margin='20px'>
              <FormControl component='fieldset' variant='standard'>
                <FormLabel component='legend'>Property Amenities</FormLabel>
                  <FormGroup>
                  <FormControlLabel control={<Checkbox checked={propertyAmenities.includes('aircondition')}
                    onChange={whenPropertyAmeChange}
                    value='aircondition' />}
                    label='Air-Condition' />
                  <FormControlLabel control={<Checkbox checked={propertyAmenities.includes('pool')}
                    onChange={whenPropertyAmeChange}
                    value='pool' />}
                    label='Pool' />
                  <FormControlLabel control={<Checkbox checked={propertyAmenities.includes('kitchen')}
                    onChange={whenPropertyAmeChange}
                    value='kitchen' />}
                    label='Kitchen' />
                    <FormControlLabel control={<Checkbox checked={propertyAmenities.includes('Wi-Fi')}
                    onChange={whenPropertyAmeChange}
                    value='Wi-Fi' />}
                    label='Wi-Fi' />
                  </FormGroup>
                </FormControl>
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={10} sm={5} md={5}>
          <Paper elevation={3}>
            <Typography marginLeft='10px'>
              <input type='file' id='image-upload' multiple onChange={whenImageChange} style={{ display: 'none' }} />
              <Button variant='contained' color='primary' onClick={() => document.getElementById('image-upload').click()} >
                Upload Image
              </Button>
            </Typography>
          </Paper>
          <Paper elevation={3}>
            <ScrollContainer>
              <Typography margin='10px'>
                {renderThumbnails()}
              </Typography>
            </ScrollContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
