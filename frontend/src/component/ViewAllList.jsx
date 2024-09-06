import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

export const ViewAllList = () => {
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();
  const formatAddress = (address) => {
    return `${address.street}, ${address.city}, ${address.state}, ${address.postcode}, ${address.country}`;
  };
  const whenPaperClick = (listingId) => {
    navigate(`/allList/${listingId}`);
  };
  // get detail of book: pending/accepted/declined
  const checkBooked = async () => {
    const token = localStorage.getItem('token');
    const url = 'http://localhost:5005/bookings';
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await response.json();
      console.log(res.bookings);
      if (response.ok) {
        return res.bookings;
      } else {
        console.error('error fetching bookings');
        return [];
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }
  };
  // check published, if published === true, display this list
  const checkPublished = async (listingId) => {
    const token = localStorage.getItem('token');
    console.log(listingId);
    const url = `http://localhost:5005/listings/${listingId}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await response.json();
      console.log(res);
      if (response.ok) {
        console.log(res.listing.published);
        return res.listing.published;
      } else {
        console.error('error');
      }
    } catch (error) {
      console.error('Error fetching details:', error);
    }
  };
  // get all list details
  const fetchAllListings = async () => {
    const url = 'http://localhost:5005/listings';
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok && data.listings) {
        const listingsWithPublishedStatus = await Promise.all(
          data.listings.map(async (listing) => {
            const published = await checkPublished(listing.id);
            return { ...listing, published };
          })
        );
        const bookings = await checkBooked();
        const listingsWithStatus = listingsWithPublishedStatus.map(listing => {
          const booking = bookings.find(b => b.listingId === listing.id);
          return { ...listing, status: booking ? booking.status : null };
        });
        sortAndSetListings(listingsWithStatus);
      } else {
        console.error(data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  // sort listings
  const sortAndSetListings = (listingsWithStatus) => {
    const sortedListings = listingsWithStatus.filter(listing => listing.published)
      .sort((a, b) => {
        if (a.status === 'accepted' || a.status === 'pending') {
          if (b.status === 'accepted' || b.status === 'pending') {
            return a.title.localeCompare(b.title);
          }
          return -1;
        }
        if (b.status === 'accepted' || b.status === 'pending') {
          return 1;
        }
        return a.title.localeCompare(b.title);
      });
    setListings(sortedListings);
  };

  useEffect(() => {
    fetchAllListings();
  }, []);

  const StyledImage = styled.img`
    width: auto;
    height: 200px;
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
    object-position: center;
    cursor: pointer;
  `;
  const StyledPaper = styled(Paper)({
    margin: 'auto',
    overflow: 'hidden',
    padding: 8,
  });
  const renderThumbnails = (thumbnail) => {
    if (thumbnail && thumbnail.length > 0) {
      return <StyledImage src={thumbnail[0]} alt='Thumbnail 0' />;
    }
    return <StyledImage src='/default-image.jpg' alt='No image' />;
  };
  console.log(listings.map((listing) => (listing.published)));
  return (
    <Box sx={{ flexGrow: 1 }} marginTop='10px'>
      <Grid item xs={10} marginBottom='10px'>
        <Button variant='contained' color='secondary' onClick={() => navigate('/')}>Back</Button>
      </Grid>
      {listings.length > 0
        ? (
            <Grid container spacing={3} sx={{ cursor: 'pointer' }}>
              {listings.filter(listing => listing.published)
                .map((listing) => (
                <Grid item xs={12} sm={6} md={4} key={listing.id}>
                  <StyledPaper elevation={3} onClick={() => whenPaperClick(listing.id)}>
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
