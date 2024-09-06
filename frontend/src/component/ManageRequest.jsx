import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Paper, Typography, Box, Button } from '@mui/material';

export const ManageRequest = () => {
  const { listingId } = useParams();
  const [booking, setBooking] = useState([]);
  const [postedOn, setPostedOn] = useState(null);
  const [price, setPrice] = useState(0);
  const [acceptedBookings, setAcceptedBookings] = useState([]);

  // get details of booking, if pending, I can accept or deny, if accept one, cannot accept other same time request
  const getBooking = async () => {
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
        const booking = res.bookings.find(b => b.listingId === listingId);
        if (booking) {
          console.log(booking);
          const filteredBookings = res.bookings.filter(b => b.listingId === listingId);
          setBooking(filteredBookings);
        }
      } else {
        console.error('error fetching bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };
  // accept
  const acceptRequest = async (id) => {
    if (!id) {
      console.log('No booking ID available');
      return;
    }
    const token = localStorage.getItem('token');
    const url = `http://localhost:5005/bookings/accept/${id}`;
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await response.json();
      console.log(res);
      if (response.ok) {
        console.log('success');
        const newAcceptedBooking = booking.find(b => b.id === id);
        setAcceptedBookings([...acceptedBookings, newAcceptedBooking]);
        getBooking();
      } else {
        console.error('error accept');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  // deny
  const denyRequest = async (id) => {
    if (!id) {
      console.log('No booking ID available');
      return;
    }
    const token = localStorage.getItem('token');
    const url = `http://localhost:5005/bookings/decline/${id}`;
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await response.json();
      console.log(res);
      if (response.ok) {
        console.log('success decline');
        getBooking();
      } else {
        console.error('error decline');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  // get details of poston and price
  const getDetails = async () => {
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
      const res = await response.json();
      console.log(res);
      if (response.ok) {
        console.log(res.listing);
        setPostedOn(res.listing.postedOn);
        setPrice(res.listing.price);
      } else {
        console.error('error decline');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  // calculate how many days poston
  const calculateDaysOnline = (postedOn) => {
    if (!postedOn) return '0 days';
    const postedDate = new Date(postedOn);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - postedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 1 ? `${diffDays} day` : `${diffDays} days`;
  };

  useEffect(() => {
    getBooking();
    getDetails();
  }, []);
  if (booking.length === 0) {
    return <Typography>Loading...</Typography>;
  }
  const isDateOverlapping = (newBooking, acceptedBookings) => {
    const newStart = new Date(newBooking.dateRange.start);
    const newEnd = new Date(newBooking.dateRange.end);
    return acceptedBookings.some(booking => {
      const start = new Date(booking.dateRange.start);
      const end = new Date(booking.dateRange.end);
      return (newStart <= end && newEnd >= start);
    });
  };
  // how many days has been booked
  const calculateBookedDays = (bookings) => {
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31);
    let totalDays = 0;
    bookings.forEach(booking => {
      const start = new Date(booking.dateRange.start);
      const end = new Date(booking.dateRange.end);
      if (end >= startOfYear && start <= endOfYear) {
        const adjustedStart = start < startOfYear ? startOfYear : start;
        const adjustedEnd = end > endOfYear ? endOfYear : end;
        const diffTime = Math.abs(adjustedEnd - adjustedStart);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        totalDays += diffDays;
      }
    });
    return totalDays;
  };
  const calculateProfit = (bookings, pricePerDay) => {
    const bookedDays = calculateBookedDays(bookings);
    const profit = bookedDays * pricePerDay;
    return profit;
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', margin: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={10} >
            <Typography variant='h5'>Booking Details</Typography>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {booking.map((bookings, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper sx={{ padding: 2 }}>
                <Typography variant='body1'>Booking ID: {bookings.id}</Typography>
                <Typography variant='body1'>Listing ID: {bookings.listingId}</Typography>
                <Typography variant='body1'>Start Date: {bookings.dateRange.start}</Typography>
                <Typography variant='body1'>End Date: {bookings.dateRange.end}</Typography>
                <Typography>Request a reservation from user: {bookings.owner}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                  <Button
                  disabled={bookings.status !== 'pending' || isDateOverlapping(bookings, acceptedBookings)}
                  sx={{ backgroundColor: bookings.status === 'pending' && !isDateOverlapping(bookings, acceptedBookings) ? '#1976d2' : 'light', color: 'white' }}
                  onClick={() => acceptRequest(bookings.id)}>
                  Accept
                  </Button>
                  <Button
                  disabled={bookings.status !== 'pending'}
                  sx={{ backgroundColor: bookings.status === 'pending' ? 'grey' : 'light', color: 'white' }}
                  onClick={() => denyRequest(bookings.id)}>
                  Deny
                  </Button>
              </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', margin: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={10}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant='body1'>This listing has been online for: {calculateDaysOnline(postedOn)}</Typography>
              <Typography variant='body1'>This listing has been booked for {calculateBookedDays(booking)} days this year</Typography>
              <Typography variant='body1'>This listing brought ${calculateProfit(booking, price)} profits to the owners this year</Typography>

            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
