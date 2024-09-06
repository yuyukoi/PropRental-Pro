import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';

export const ViewYourList = () => {
  const [listings, setListings] = useState([]);
  const currentUserEmail = localStorage.getItem('email');
  const navigate = useNavigate();
  const whenPaperClick = (listingId) => {
    navigate(`/yourList/${listingId}`);
  };
  const formatAddress = (address) => {
    return `${address.street}, ${address.city}, ${address.state}, ${address.postcode}, ${address.country}`;
  };
  // get 'published' === true or false
  const checkPublished = async (listingId) => {
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
      const data = await response.json();
      if (response.ok) {
        console.log(data.listing.published);
        return data.listing.published;
      } else {
        console.error(data);
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  // get list details
  const checkMyList = async () => {
    const token = localStorage.getItem('token');
    const url = 'http://localhost:5005/listings';
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.listings && Array.isArray(data.listings)) {
        const myFilteredlistings = data.listings.filter(listing => listing.owner === currentUserEmail);
        const sortedListings = myFilteredlistings.sort((a, b) => a.title.localeCompare(b.title));
        const myListings = await Promise.all(sortedListings.map(async (listing) => {
          const published = await checkPublished(listing.id);
          return { ...listing, published };
        }));
        setListings(myListings);
      } else {
        console.error(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checkMyList();
  }, []);

  const StyledPaper = styled(Paper)({
    margin: 'auto',
    overflow: 'hidden',
    padding: 8,
    cursor: 'pointer',
  });

  const StyledImage = styled('img')({
    maxHeight: '200px',
    objectFit: 'cover',
  });

  const renderThumbnails = (thumbnail) => {
    if (thumbnail && thumbnail.length > 0) {
      return <StyledImage src={thumbnail[0]} alt='Thumbnail 0' />;
    }
    return <StyledImage src='/default-image.jpg' alt='No image' />;
  };
  // click unpublish and change published = false
  const toUnPublish = async (listingId) => {
    const token = localStorage.getItem('token');
    const url = `http://localhost:5005/listings/unpublish/${listingId}`;
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await response.json();
      if (response.ok) {
        console.log(res);
      } else {
        console.error('Failed', res);
      }
    } catch (error) {
      console.error('Failed', error);
    }
  };
  // unpublish and remove this list
  const deleteListing = async (listingId) => {
    const token = localStorage.getItem('token');
    const url = `http://localhost:5005/listings/${listingId}`;
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await response.json();
      if (response.ok) {
        console.log(res);
        checkMyList();
      } else {
        console.error('Failed', res);
      }
    } catch (error) {
      console.error('Failed', error);
    }
  };
  // button for check requests
  const navigateToRequests = (listingId) => {
    navigate(`/yourList/${listingId}/requests`);
  };
  return (
    <Box sx={{ flexGrow: 1 }} marginTop= '10px'>
      <Grid item xs={10}>
        <Button variant='contained' color='secondary' onClick={() => navigate('/')}>Back</Button>
      </Grid>
      {listings.length > 0
        ? (
            <Grid container spacing={3}>
              {listings.map((listing) => (
                <Grid item xs={12} sm={6} md={4} key={listing.id} marginTop= '10px'>
                  <StyledPaper elevation={3} onClick={() => whenPaperClick(listing.id)}>
                    <Button id='edit' onClick={(e) => { e.stopPropagation(); navigate(`/editListing/${listing.id}`); }} style={{ display: 'flex', float: 'right' }}>
                      <EditIcon />
                    </Button>
                    <Typography variant='h5' gutterBottom style={{ fontWeight: 600 }}>
                      {listing.title || 'Default Title'}
                    </Typography>
                    {renderThumbnails(listing.thumbnail)}
                    <Typography variant='h6' style={{ wordWrap: 'break-word', fontSize: '18px', fontWeight: 400 }}>
                      {`Address: ${formatAddress(listing.address) || 'Address on Request'}`}
                    </Typography>
                    <Typography variant='h6' style={{ wordWrap: 'break-word', fontSize: '18px', fontWeight: 400 }}>
                      {listing.price ? 'Price: $' + listing.price : 'Price on Request'}
                    </Typography>
                    <Typography variant='h6' style={{ wordWrap: 'break-word', fontSize: '18px', fontWeight: 400 }}>
                      {`Reviews: ${Array.isArray(listing.reviews) ? listing.reviews.length : 0}`}
                    </Typography>
                    <Button id='live' size='small' variant='contained' disabled={listing.published} onClick={(e) => { e.stopPropagation(); navigate(`/yourList/${listing.id}/publish`) }} style={{ display: 'flex', float: 'right' }}>
                        Go live
                    </Button>
                    <Button variant='contained' color='error' size='small' id='delete'
                      onClick={ (e) => {
                        e.stopPropagation();
                        if (listing.published === true) {
                          toUnPublish(listing.id);
                          deleteListing(listing.id);
                        } else {
                          deleteListing(listing.id);
                        }
                      }}
                      style={{ display: 'flex', float: 'left' }}>
                        Delete
                    </Button>
                    <Button onClick={(e) => { e.stopPropagation(); navigateToRequests(listing.id) }} variant='contained' color='secondary' size='small' >
                      Check Request
                    </Button>
                  </StyledPaper>
                </Grid>
              ))}
            </Grid>
          )
        : (
          <Typography variant='body1'>Loading...</Typography>
          )}
    </Box>
  );
};
