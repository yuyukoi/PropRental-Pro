import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Rating from '@mui/material/Rating';

export const ListingDetails = () => {
  const [currentBookingId, setCurrentBookingId] = useState(null);
  const [comment, setComment] = useState('');
  const [score, setScore] = useState(5);
  const handleRatingChange = (event, newValue) => {
    setScore(newValue);
  };
  const [reviews, setReviews] = useState([]);
  const [bookingStatus, setBookingStatus] = useState('');
  const today = new Date();
  const [details, setDetails] = useState(null);
  const { listingId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const routeStartDate = queryParams.get('startDate');
  const routeEndDate = queryParams.get('endDate');
  const initialStartDate = routeStartDate ? new Date(routeStartDate) : new Date();
  const initialEndDate = routeEndDate ? new Date(routeEndDate) : new Date(initialStartDate);
  initialEndDate.setDate(initialEndDate.getDate() + 1);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const startPlusOneDay = startDate ? new Date(new Date(startDate).getTime() + 24 * 60 * 60 * 1000) : null;
  const calculateTotalPrice = (startDate, endDate, nightlyPrice) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = (end - start) / (1000 * 3600 * 24);
    return days * nightlyPrice;
  };

  const formatAddress = (address) => {
    return `${address.street}, ${address.city}, ${address.state}, ${address.postcode}, ${address.country}`;
  };
  const navigate = useNavigate();
  const goBack = () => {
    navigate('/');
  };

  const fetchDetails = async () => {
    const url = `http://localhost:5005/listings/${listingId}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json()
      if (response.ok) {
        console.log(data);
      } else {
        throw new Error('Network response was not ok');
      }
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
  const totalPrice = startDate && endDate
    ? calculateTotalPrice(startDate, endDate, details.listing.price)
    : null;
  console.log(new Date(endDate).toISOString());

  const createBooking = async () => {
    const token = localStorage.getItem('token');
    const url = `http://localhost:5005/bookings/new/${listingId}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          dateRange: {
            start: new Date(startDate).toISOString(),
            end: new Date(endDate).toISOString()
          },
          totalPrice,
        })
      });
      const data = await response.json()
      if (response.ok) {
        console.log('Booking successful:', data);
        alert('Booking in progress, please wait for confirmation from the host');
      } else {
        console.log(data);
        throw new Error('Booking failed: ' + data);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  const getBookingStatus = async () => {
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
      const data = await response.json();
      const email = localStorage.getItem('email');
      console.log(email);
      if (response.ok) {
        console.log(data);
        const matchedBookings = data.bookings.filter(booking =>
          booking.owner === email && booking.listingId === String(listingId)
        );
        if (matchedBookings.length > 0) {
          setCurrentBookingId(matchedBookings[0].id);
          console.log(matchedBookings[0].id);
          matchedBookings.forEach(booking => console.log(booking.status));
          const matchedStatuses = matchedBookings.map(booking => booking.status);
          setBookingStatus(matchedStatuses);
          console.log(matchedStatuses);
        } else {
          console.log('No bookings found that match the email and listingId');
        }
      } else {
        console.log(data);
        throw new Error('Booking failed: ' + data);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  const handleCommentSubmit = async () => {
    if (bookingStatus.includes('accepted') && currentBookingId) {
      const newReview = { score, comment, date: new Date().toISOString() };
      setReviews(prevReviews => [...prevReviews, newReview]);
      const token = localStorage.getItem('token');
      const url = `http://localhost:5005//listings/${listingId}/review/${currentBookingId}`;
      try {
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            review: {
              comment,
              score,
            }
          })
        });
        if (response.ok) {
          setComment('');
          setScore('');
          console.log(reviews);
          alert('Comment successful!');
        }
      } catch (error) {
        console.error('Error creating booking:', error);
      }
    } else {
      alert('Comments are allowed only after booking is accepted and a booking ID is available.');
    }
  };

  return (
    <Box>
      <Grid container spacing={0} justifyContent='center' marginTop='20px' style={{ display: 'flex', alignItems: 'stretch' }}>
        <Grid item xs={10} sm={10} md={10} marginBottom='10px'>
          <Box display='flex' justifyContent='space-between' width='100%'>
            <Button variant='contained' color='secondary' onClick={goBack}>
              Back to Listings
            </Button>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box>
                <DatePicker
                  label='Start Date'
                  value={startDate}
                  onChange={(newDate) => setStartDate(newDate)}
                  renderInput={(params) => <TextField {...params} sx={{ mr: 2 }} />}
                  minDate={today}
                />
                <DatePicker
                  label='End Date'
                  value={endDate}
                  onChange={(newDate) => setEndDate(newDate)}
                  renderInput={(params) => <TextField {...params} />}
                  minDate={startPlusOneDay || today}
                />
              </Box>
            </LocalizationProvider>
            <Button id='book' variant='contained' color='primary' onClick={createBooking}>
              Book
            </Button>
          </Box>
        </Grid>
        <Grid item xs={10} sm={10} md={10} marginBottom='10px'>
          <StyledPaper elevation={3}>
            <Button style={{ marginRight: '10px' }} variant='contained' color='secondary' onClick={getBookingStatus}>Check</Button>
              Booking Statuses (please check): {bookingStatus.length > 0 ? bookingStatus.join(', ') : 'No status'}
          </StyledPaper>
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
              {totalPrice ? `Total Price: $${totalPrice}` : (details.listing.price ? 'Price: $' + details.listing.price + '/night' : 'Price on Request')}
            </Typography>
            <Typography variant='h6' style={{ wordWrap: 'break-word', fontSize: '23px', fontWeight: 400 }}>
              {`Property Type: ${details.listing.metadata.propertyType || 'Type on Request'}`}
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
            <Typography variant='h6' style={{ wordWrap: 'break-word', fontSize: '23px', fontWeight: 400 }}>
              {`Reviews: ${Array.isArray(details.listing.reviews) ? details.listing.reviews.length : 0}`}
            </Typography>
          </StyledPaper>
        </Grid>
      </Grid>
      <Grid container spacing={0} justifyContent='center' >
        <Grid item xs={10} sm={10} md={10}>
          {reviews.length === 0
            ? (
              <Paper elevation={3} style={{ margin: 8, padding: 8 }}>
                <Rating value={5} readOnly />
                <Typography variant='body1'>There are no comments yet.</Typography>
              </Paper>
              )
            : (
                reviews.map((review, index) => (
                  <Paper key={index} elevation={3} style={{ margin: 8, padding: 8 }}>
                    <Rating value={review.score} readOnly />
                    <Typography variant='body1'>{review.comment}</Typography>
                    <Typography variant='body2'>{new Date(review.date).toLocaleDateString()}</Typography>
                  </Paper>
                )))}
        </Grid>
        <Grid item xs={10} sm={10} md={10}>
          <Rating
            name='score'
            value={score}
            onChange={handleRatingChange}
            style={{ margin: 8 }}
          />
          <TextField
            label='Comment'
            variant='outlined'
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ margin: 8, width: '95%' }}
          />
          <Button variant='contained' color='primary' onClick={handleCommentSubmit}>
            Submit Review
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
