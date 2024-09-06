import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';
import { Box, Grid, Paper } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

export const PublishListing = () => {
  // only can select from today
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const { listingId } = useParams();
  const navigate = useNavigate();
  const goBack = () => {
    navigate('/yourList');
  };
  const [dateRanges, setDateRanges] = useState([{ startDate: today, endDate: tomorrow }]);
  const whenDateChange = (index, field, newValue) => {
    const updatedDateRanges = [...dateRanges];
    updatedDateRanges[index][field] = newValue;
    setDateRanges(updatedDateRanges);
  };
  // put start date and end date
  const toPublish = async () => {
    const isAnyDateRangeIncomplete = dateRanges.some(range => !range.startDate || !range.endDate);
    if (isAnyDateRangeIncomplete) {
      alert('Please complete all start and end dates before publishing.');
      return;
    }
    const token = localStorage.getItem('token');
    const url = `http://localhost:5005/listings/publish/${listingId}`;
    const formattedAvailability = dateRanges.map(range => ({
      start: range.startDate,
      end: range.endDate
    }));
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          availability: formattedAvailability,
          published: true,
        })
      });
      const res = await response.json();
      if (response.ok) {
        navigate('/yourList');
        console.log(res);
      } else {
        console.error('Failed', res);
      }
    } catch (error) {
      console.error('Failed', error);
    }
  };

  const StyledPaper = styled(Paper)({
    margin: 'auto',
    overflow: 'hidden',
    padding: 8,
    cursor: 'pointer',
  });
  const removeDateRange = (index) => {
    const updatedDateRanges = dateRanges.filter((_, idx) => idx !== index);
    setDateRanges(updatedDateRanges);
  };
  const getDisabledDates = () => {
    const disabledDates = [];
    dateRanges.forEach(range => {
      if (range.startDate && range.endDate) {
        const currentDate = new Date(range.startDate);
        while (currentDate <= range.endDate) {
          disabledDates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    });
    return disabledDates;
  };
  const addNewDateRange = () => {
    const disabledDates = getDisabledDates();
    const newDateRange = { startDate: null, endDate: null, disabledDates };
    setDateRanges([...dateRanges, newDateRange]);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={12} md={12} marginTop='10px'>
          <Button variant='contained' color='primary' onClick={goBack}>Back to Listings</Button>
        </Grid>
        {dateRanges.map((range, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StyledPaper>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label='Start Date'
                  id='start'
                  value={range.startDate}
                  onChange={(newValue) => whenDateChange(index, 'startDate', newValue)}
                  renderInput={(params) => <TextField {...params} />}
                  shouldDisableDate={(date) =>
                    getDisabledDates().some(disabledDate =>
                      disabledDate.getTime() === date.getTime()
                    )
                  }
                  minDate={today}
                />
                <DatePicker
                  label='End Date'
                  id='end'
                  value={range.endDate}
                  onChange={(newValue) => whenDateChange(index, 'endDate', newValue)}
                  renderInput={(params) => <TextField {...params} />}
                  minDate={tomorrow}
                  disabled={!range.startDate}
                />
              </LocalizationProvider>
              <Button variant='contained' color='error'
                id='delete'
                onClick={() => removeDateRange(index)}
                size='small'
                style={{ display: 'flex', float: 'right' }}>
                Delete
              </Button>
            </StyledPaper>
          </Grid>
        ))}
        <Grid item xs={12} sm={12} md={12} style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
          <Button variant='contained' color='secondary' onClick={addNewDateRange}>Add other date</Button>
          <Button id='submit' variant='contained' color='secondary' onClick={toPublish}>Publish</Button>
        </Grid>
      </Grid>
    </Box>
  );
};
