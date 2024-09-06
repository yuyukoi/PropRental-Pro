import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';
import Button from '@mui/material/Button';

export const YourListingDetails = () => {
  const [details, setDetails] = useState(null);
  const navigate = useNavigate();
  const goBack = () => {
    navigate('/yourList');
  };
  const formatAddress = (address) => {
    return `${address.street}, ${address.city}, ${address.state}, ${address.postcode}, ${address.country}`;
  };
  // get listing id from url
  const { listingId } = useParams();
  // get listing details
  const fetchDetails = async () => {
    const url = `http://localhost:5005/listings/${listingId}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('ok');
      } else {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setDetails(data);
    } catch (error) {
      console.error('Error fetching details:', error);
    }
  };
  useEffect(() => {
    fetchDetails();
  }, []);
  if (!details) {
    return <div>No listing</div>;
  }

  const StyledPaper = styled(Paper)({
    margin: 'auto',
    overflow: 'hidden',
    padding: 8,
  });
  const formatAmenities = (amenities) => {
    if (!amenities || amenities.length === 0) {
      return 'Amenities on Request';
    }
    const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);
    const formattedAmenities = amenities.map(capitalize);
    if (formattedAmenities.length === 1) {
      return formattedAmenities[0];
    }
    const lastAmenity = formattedAmenities.pop();
    return formattedAmenities.length > 1
      ? `${formattedAmenities.join(', ')} and ${lastAmenity}`
      : `${formattedAmenities} and ${lastAmenity}`;
  };
  const BigImage = styled('img')({
    maxWidth: '400px',
    maxHeight: '400px',
    width: '100%',
    height: 'auto',
    marginBottom: '20px',
  });

  const SmallImage = styled('img')({
    width: '150px',
    height: '150px',
    objectFit: 'cover',
    margin: '20px',
  });
  const renderThumbnails = (thumbnails) => {
    if (!thumbnails || thumbnails.length <= 1) {
      return null;
    }
    return thumbnails.slice(1).map((url, index) => (
      <SmallImage key={index} src={url} alt={`Thumbnail ${index + 1}`} />
    ));
  };
  return (
    <Box>
      <Grid container spacing={0} justifyContent='center' marginTop='10px' style={{ display: 'flex', alignItems: 'stretch' }}>
        <Grid item xs={10} sm={10} md={10} marginBottom='10px'>
          <Button variant='contained' color='primary' onClick={goBack}>
            Back to Listings
          </Button>
        </Grid>
        <Grid item xs={10} sm={10} md={10}>
          <StyledPaper elevation={3}>
            <Typography variant='h3' gutterBottom style={{ fontWeight: 600 }}>
              {details.listing.title || 'Default Title'}
            </Typography>
          </StyledPaper>
        </Grid>
      </Grid>
      <Grid container spacing={0} justifyContent='center'>
        <Grid item xs={10} sm={5} md={5}>
          <StyledPaper elevation={3} style={{ height: '100%' }}>
            <BigImage
              src={details.listing.thumbnail && details.listing.thumbnail.length > 0 ? details.listing.thumbnail[0] : '/default-image.jpg'}
              alt='Thumbnail 0'
            />
          </StyledPaper>
        </Grid>
        <Grid item xs={10} sm={5} md={5}>
          <StyledPaper elevation={3} style={{ height: '100%' }}>
            {renderThumbnails(details.listing.thumbnail)}
          </StyledPaper>
        </Grid>
      </Grid>
      <Grid container spacing={0} justifyContent='center' >
        <Grid item xs={10} sm={10} md={10}>
          <StyledPaper elevation={3}>
            <Typography variant='h6' style={{ wordWrap: 'break-word', fontSize: '23px', fontWeight: 400 }}>
            {`Address: ${formatAddress(details.listing.address) || 'Address on Request'}`}
            </Typography>
            <Typography variant='h6' style={{ wordWrap: 'break-word', fontSize: '23px', fontWeight: 400 }}>
              {`Amenities: ${formatAmenities(details.listing.metadata.propertyAmenities)}`}
            </Typography>
            <Typography variant='h6' style={{ wordWrap: 'break-word', fontSize: '23px', fontWeight: 400 }}>
              {details.listing.price ? 'Price: $' + details.listing.price : 'Price on Request'}
            </Typography>
            <Typography variant='h6' style={{ wordWrap: 'break-word', fontSize: '23px', fontWeight: 400 }}>
              {`Property Type: ${details.listing.metadata.propertyType || 'Type on Request'}`}
            </Typography>
            <Typography variant='h6' style={{ wordWrap: 'break-word', fontSize: '23px', fontWeight: 400 }}>
              {`Reviews: ${Array.isArray(details.listing.reviews) ? details.listing.reviews.length : 0}`}
            </Typography>
            <Typography variant='h6' style={{ wordWrap: 'break-word', fontSize: '23px', fontWeight: 400 }}>
              {details.listing.metadata.propertyBed ? '🏠 Number of bedrooms: ' + details.listing.metadata.propertyBed : 'Bath on Request'}
            </Typography>
            <Typography variant='h6' style={{ wordWrap: 'break-word', fontSize: '23px', fontWeight: 400 }}>
              {details.listing.metadata.propertyBedNum ? '🛌 Number of beds: ' + details.listing.metadata.propertyBedNum : 'Bath on Request'}
            </Typography>
            <Typography variant='h6' style={{ wordWrap: 'break-word', fontSize: '23px', fontWeight: 400 }}>
              {details.listing.metadata.propertyBath ? '🛁 Number of bathrooms: ' + details.listing.metadata.propertyBath : 'Bath on Request'}
            </Typography>
          </StyledPaper>
        </Grid>
      </Grid>
    </Box>
  );
};
