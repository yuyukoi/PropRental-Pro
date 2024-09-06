import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box, Button, Popover } from '@mui/material';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// when click the AirBrB title can go to the dashboard
export const Dashboard = () => {
  const [search, setSearch] = useState('');
  const formatAddress = (address) => {
    return `${address.street}, ${address.city}, ${address.state}, ${address.postcode}, ${address.country}`;
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const [minBedrooms, setMinBedrooms] = useState('1');
  const [maxBedrooms, setMaxBedrooms] = useState('8');
  const [minPrice, setMinPrice] = useState('0');
  const [maxPrice, setMaxPrice] = useState('100000');
  const [activeButton, setActiveButton] = useState('highestFirst');
  const [sortReviewOrder, setSortReviewOrder] = useState('highestFirst');
  const handleSortChange = (order) => {
    setSortReviewOrder(order);
    setActiveButton(order);
  };
  // select from today
  const today = new Date();
  // at least select 1 night
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(tomorrow);
  const [listings, setListings] = useState([]);
  const filteredListings = listings.filter(listing => {
    const titleMatch = listing.title.toLowerCase().includes(search.toLowerCase());
    const cityMatch = listing.address.city.toLowerCase().includes(search.toLowerCase());
    return titleMatch || cityMatch;
  });
  const navigate = useNavigate();
  const whenPaperClick = (listingId) => {
    const startDateIso = new Date(startDate).toISOString();
    const endDateIso = new Date(endDate).toISOString();
    navigate(`/allList/${listingId}?startDate=${encodeURIComponent(startDateIso)}&endDate=${encodeURIComponent(endDateIso)}`);
  };
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
  // only published === true can display
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
      const res = await response.json();
      console.log(res);
      if (response.ok) {
        return res.listing.published;
      } else {
        console.error('error');
      }
    } catch (error) {
      console.error('Error fetching details:', error);
    }
  };
  // sort by bedrooms
  const checkBedrooms = async (listingId) => {
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
      if (response.ok) {
        console.log(res.listing.metadata.propertyBed);
        return res.listing.metadata.propertyBed;
      } else {
        console.error('error');
      }
    } catch (error) {
      console.error('Error fetching details:', error);
    }
  };
  // sort by date
  const checkAvailaDate = async (listingId) => {
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
      if (response.ok) {
        return res.listing.availability;
      } else {
        console.error('error');
      }
    } catch (error) {
      console.error('Error fetching details:', error);
    }
  };
  // get details all listings
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
        const listingsWithStatus = await Promise.all(
          data.listings.map(async (listing) => {
            const [dates, published, bedrooms, bookings] = await Promise.all([
              checkAvailaDate(listing.id),
              checkPublished(listing.id),
              checkBedrooms(listing.id),
              checkBooked(),
            ]);
            const booking = bookings.find(b => b.listingId === listing.id);
            return { ...listing, dates, published, bedrooms, status: booking ? booking.status : null };
          })
        );
        setListings(listingsWithStatus);
      } else {
        console.error(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const sortedListings = React.useMemo(() => {
    return filteredListings.sort((a, b) => {
      const avgRatingA = a.reviews.reduce((acc, curr) => acc + curr.rating, 0) / (a.reviews.length || 1);
      const avgRatingB = b.reviews.reduce((acc, curr) => acc + curr.rating, 0) / (b.reviews.length || 1);
      if (sortReviewOrder === 'highestFirst') {
        if (avgRatingB !== avgRatingA) {
          return avgRatingB - avgRatingA;
        }
      } else {
        if (avgRatingB !== avgRatingA) {
          return avgRatingA - avgRatingB;
        }
      }
      return a.title.localeCompare(b.title);
    });
  }, [filteredListings, sortReviewOrder]);

  useEffect(() => {
    fetchAllListings();
    checkBedrooms();
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
  console.log(listings.map((listing) => (listing.bedrooms)));
  console.log(listings.map((listing) => (listing.reviews)));
  const [showSearch, setShowSearch] = useState(false);
  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };
  const whenPopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const whenPopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const whenSearch = () => {
    const filteredListings = listings.filter(listing => {
      const matchBedrooms = listing.bedrooms >= minBedrooms && listing.bedrooms <= maxBedrooms;
      const matchPrice = listing.price >= minPrice && listing.price <= maxPrice;
      const matchDates = listing.dates.some(dateRange =>
        new Date(dateRange.start) <= new Date(endDate) && new Date(dateRange.end) >= new Date(startDate)
      );
      return matchBedrooms && matchPrice && matchDates;
    });
    setListings(filteredListings);
    whenPopoverClose();
  };

  const resetFilters = () => {
    setSearch('');
    setMinBedrooms('');
    setMaxBedrooms('');
    fetchAllListings();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
        {showSearch && <TextField fullWidth label='Search' value={search} onChange={(e) => setSearch(e.target.value)}/>}
        <IconButton onClick={toggleSearch}><SearchIcon /></IconButton>
        <IconButton onClick={whenPopoverOpen}><ArrowDropDownIcon /></IconButton>
        <Button onClick={resetFilters}>Reset filters</Button>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={whenPopoverClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Box p={2}>
            <Typography variant='h6'>Bedrooms</Typography>
            <Box mt={0} sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField label='Min bedrooms' type='number' value={minBedrooms} onChange={(e) => setMinBedrooms(Number(e.target.value))} sx={{ mr: 2 }}/>
              <TextField label='Max bedrooms' type='number' value={maxBedrooms} onChange={(e) => setMaxBedrooms(Number(e.target.value))} />
            </Box>
            <Typography variant='h6'>Date range</Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box mt={0} sx={{ display: 'flex', alignItems: 'center' }}>
                <DatePicker
                  label='Start Date'
                  value={startDate}
                  onChange={(newDate) => setStartDate(newDate)}
                  renderInput={(params) => <TextField {...params} sx={{ mr: 2 }} />}
                />
                <DatePicker
                  label='End Date'
                  value={endDate}
                  onChange={(newDate) => setEndDate(newDate)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Box>
            </LocalizationProvider>
            <Typography variant='h6'>Price</Typography>
            <Box mt={0} sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField label='Min price' type='number' value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))} sx={{ mr: 2 }} />
              <TextField label='Max price' type='number' value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} />
            </Box>
            <Typography variant='h6'>Sort by Review Rate</Typography>
            <Box mt={0} sx={{ display: 'flex', alignItems: 'center' }}>
              <Button variant='contained' onClick={() => handleSortChange('highestFirst')} sx={{ mr: 2, bgcolor: activeButton === 'highestFirst' ? 'primary.main' : 'grey.300' }}>
                Highest First
              </Button>
              <Button variant='contained' onClick={() => handleSortChange('lowestFirst')} sx={{ bgcolor: activeButton === 'lowestFirst' ? 'primary.main' : 'grey.300' }}>
                Lowest First
              </Button>
            </Box>
            <Box mt={2}>
              <Button variant='contained' onClick={whenSearch}>Search</Button>
            </Box>
          </Box>
        </Popover>
      </Box>
      {listings.length > 0
        ? (
            <Grid container spacing={3} sx={{ cursor: 'pointer' }}>
              {sortedListings.filter(listing => listing.published)
                .map((listing) => (
                <Grid item xs={12} sm={6} md={4} key={listing.id}>
                  <StyledPaper elevation={3} onClick={() => whenPaperClick(listing.id)}>
                    <Typography id='title' variant='h5' gutterBottom style={{ fontWeight: 600 }}>
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
