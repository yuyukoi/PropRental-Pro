import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Paper, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, FormGroup, FormLabel, FormControlLabel, Checkbox } from '@mui/material';

// create a new listing
export const CreateList = () => {
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    postcode: '',
    country: ''
  });
  const validateInputs = () => {
    if (!title.trim() || !price.trim() || Object.values(address).some(field => !field.trim()) || imageData.length === 0) {
      return false;
    }
    return true;
  };
  const [price, setPrice] = useState('');
  const whenTitleChange = (e) => {
    setTitle(e.target.value);
  };
  const whenAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
  };

  const whenPriceChange = (e) => {
    setPrice(e.target.value);
  };
  const navigate = useNavigate();
  const [propertyType, setPropertyType] = useState('House');
  const whenPropertyTypeChange = (e) => {
    setPropertyType(e.target.value);
  };
  const [propertyBath, setPropertyBath] = useState('1');
  const whenPropertyBathChange = (e) => {
    setPropertyBath(e.target.value);
  };
  const [propertyBed, setPropertyBed] = useState('1');
  const whenPropertyBedChange = (e) => {
    setPropertyBed(e.target.value);
  };
  const [propertyBedNum, setPropertyBedNum] = useState('1');
  const whenPropertyBedNumChange = (e) => {
    setPropertyBedNum(e.target.value);
  };
  const [propertyAmenities, setPropertyAmenities] = useState([]);
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
  const [imageData, setImageData] = useState([]);
  const whenImageChange = (event) => {
    const files = Array.from(event.target.files);
    const newImageData = [...imageData];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImageData.push(reader.result);
        setImageData(newImageData);
      };
      reader.readAsDataURL(file);
    });
  };
  const renderThumbnail = () => {
    return imageData.map((src, index) => (
      <Grid key={index}>
        <img src={src} alt={`Thumbnail ${index}`} style={{ width: '100px', height: '100px' }} />
        <Button onClick={() => whenRemoveImage(index)}>Remove</Button>
      </Grid>
    ));
  };

  // remove image
  const whenRemoveImage = (index) => {
    const newImageData = imageData.filter((_, i) => i !== index);
    setImageData(newImageData);
    document.getElementById('image-upload').value = '';
  };
  // api create listing
  const Create = async () => {
    if (!validateInputs()) {
      alert('Please fill all required fields and upload at least one image.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const url = 'http://localhost:5005/listings/new';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          address,
          price: Number(price),
          thumbnail: imageData,
          metadata: {
            propertyType,
            propertyBath: Number(propertyBath),
            propertyBed: Number(propertyBed),
            propertyBedNum: Number(propertyBedNum),
            propertyAmenities,
          },
        })
      });
      const res = await response.json();
      if (response.ok) {
        console.log(res);
        navigate('/yourList');
      } else {
        console.error('Failed to send data');
      }
    } catch (error) {
      console.error('Failed to create listing:', error);
    }
  };

  return (
    <Box>
      <Grid container spacing={4} justifyContent='center' marginTop='0px'>
        <Grid item xs={10}>
          <Button variant='contained' color='secondary' onClick={() => navigate('/')}>Back</Button>
        </Grid>
        <Grid item xs={10} sm={5} md={7}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <TextField fullWidth id='title' label='Listing Title' type='text' value={title} onChange={whenTitleChange} margin='normal' />
            <TextField fullWidth id='street' label='Street' name='street' value={address.street} onChange={whenAddressChange} margin='normal' />
            <TextField fullWidth id='city' label='City' name='city' value={address.city} onChange={whenAddressChange} margin='normal' />
            <TextField fullWidth id='state' label='State' name='state' value={address.state} onChange={whenAddressChange} margin='normal' />
            <TextField fullWidth id='post' label='Postcode' name='postcode' value={address.postcode} onChange={whenAddressChange} margin='normal' />
            <TextField fullWidth id='country' label='Country' name='country' value={address.country} onChange={whenAddressChange} margin='normal' />
            <TextField fullWidth id='price' label='Listing Price (per night)' type='number' value={price} onChange={whenPriceChange} margin='normal' />
            <FormControl fullWidth margin='normal'>
              <InputLabel id='property-type-label'>Property Type</InputLabel>
              <Select id='propertyType' labelId='property-type-label' value={propertyType} onChange={whenPropertyTypeChange} label='Property Type'>
                <MenuItem value='House'>House</MenuItem>
                <MenuItem value='Apartment'>Apartment</MenuItem>
                <MenuItem value='Castle'>Castle</MenuItem>
                <MenuItem value='Hotel'>Hotel</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin='normal'>
              <InputLabel id='property-bath-label'>Number of Bathrooms</InputLabel>
              <Select id='bathrooms' labelId='property-bath-label' value={propertyBath} onChange={whenPropertyBathChange} label='Number of Bathrooms'>
                {[1, 2, 3, 4].map(num => <MenuItem key={num} value={num}>{num}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth margin='normal'>
              <InputLabel id='property-bed-label'>Number of Bedrooms</InputLabel>
              <Select id='bedromms' labelId='property-bed-label' value={propertyBed} onChange={whenPropertyBedChange} label='Number of Bedrooms'>
                {[1, 2, 3, 4].map(num => <MenuItem key={num} value={num}>{num}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl fullWidth margin='normal'>
              <InputLabel id='property-bednum-label'>Number of Beds</InputLabel>
              <Select id='beds' labelId='property-bednum-label' value={propertyBedNum} onChange={whenPropertyBedNumChange} label='Number of Beds'>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => <MenuItem key={num} value={num}>{num}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl component='fieldset' variant='standard'>
              <FormLabel component='legend'>Property Amenities</FormLabel>
              <FormGroup>
                <FormControlLabel id='air' control={<Checkbox checked={propertyAmenities.includes('aircondition')} onChange={whenPropertyAmeChange} value='aircondition' />} label='Air-Condition' />
                <FormControlLabel id='pool' control={<Checkbox checked={propertyAmenities.includes('pool')} onChange={whenPropertyAmeChange} value='pool' /> } label='Pool' />
                <FormControlLabel id='kitchen' control={<Checkbox checked={propertyAmenities.includes('kitchen')} onChange={whenPropertyAmeChange} value='kitchen' /> } label='Kitchen' />
                <FormControlLabel id='wifi' control={<Checkbox checked={propertyAmenities.includes('Wi-Fi')} onChange={whenPropertyAmeChange} value='Wi-Fi' /> } label='Wi-Fi' />
              </FormGroup>
            </FormControl>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={5} md={3}>
          <Typography variant='h4' gutterBottom>Create your own listing!</Typography>
          <Typography variant='body1'>In this step, we will ask you which type of property you have and if guests will book the entire place or just a room. Then let us know the location and how many guests can stay.</Typography>
        </Grid>
        <Grid item xs={10} sm={10} md={10}>
          <Paper elevation={0}>
            <Typography>
              <input type='file' id='image-upload' multiple onChange={whenImageChange} style={{ display: 'none' }} />
              <Button id='upload' variant='contained' color='primary' onClick={() => document.getElementById('image-upload').click()} >
                Upload Image
              </Button>
            </Typography>
          </Paper>
          <Paper elevation={1}>
            <Typography marginTop='10px'>
              {renderThumbnail()}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={10} style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0px' }}>
          <Button id='submit' variant='contained' color='primary' onClick={Create}>Submit</Button>
        </Grid>
      </Grid>
    </Box>
  );
};
