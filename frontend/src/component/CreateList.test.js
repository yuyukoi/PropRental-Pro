import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import { CreateList } from './CreateList';

describe('CreateList Component', () => {
  // text rendering
  it('renders CreateList component', () => {
    const { getByText } = render(
      <Router>
        <CreateList />
      </Router>
    );
    expect(getByText(/Create your own listing!/i)).toBeInTheDocument();
  });

  // input
  it('entering listing details', () => {
    const { getByLabelText, getByText } = render(
      <Router>
        <CreateList />
      </Router>
    );
    const titleInput = getByLabelText('Listing Title');
    fireEvent.change(titleInput, { target: { value: 'my house' } });
    expect(titleInput.value).toBe('my house');

    const streetInput = getByLabelText('Street');
    fireEvent.change(streetInput, { target: { value: '268 emp St' } });
    expect(streetInput.value).toBe('268 emp St');

    const cityInput = getByLabelText('City');
    fireEvent.change(cityInput, { target: { value: 'Sydney' } });
    expect(cityInput.value).toBe('Sydney');

    const stateInput = getByLabelText('State');
    fireEvent.change(stateInput, { target: { value: 'NSW' } });
    expect(stateInput.value).toBe('NSW');

    const postInput = getByLabelText('Postcode');
    fireEvent.change(postInput, { target: { value: '2017' } });
    expect(postInput.value).toBe('2017');

    const countryInput = getByLabelText('Country');
    fireEvent.change(countryInput, { target: { value: 'AU' } });
    expect(countryInput.value).toBe('AU');

    const priceInput = getByLabelText('Listing Price (per night)');
    fireEvent.change(priceInput, { target: { value: '900' } });
    expect(priceInput.value).toBe('900');

    const submitButton = getByText('Submit');
    expect(submitButton).toBeInTheDocument();
  });

  // select
  it('renders property type select options', () => {
    const { getByLabelText } = render(
      <Router>
          <CreateList />
      </Router>
    );

    const propertyTypeSelect = getByLabelText('Property Type');
    expect(propertyTypeSelect).toBeInTheDocument();

    const bathroomSelect = getByLabelText('Number of Bathrooms');
    expect(bathroomSelect).toBeInTheDocument();

    const bedroomSelect = getByLabelText('Number of Bedrooms');
    expect(bedroomSelect).toBeInTheDocument();

    const bedSelect = screen.getByLabelText('Number of Beds');
    expect(bedSelect).toBeInTheDocument();
  });

  // checkbox
  it('renders property amenities checkboxes', () => {
    const { getByLabelText } = render(
      <Router>
        <CreateList />
      </Router>
    );
    expect(getByLabelText('Air-Condition')).toBeInTheDocument();
    expect(getByLabelText('Pool')).toBeInTheDocument();
    expect(getByLabelText('Kitchen')).toBeInTheDocument();
    expect(getByLabelText('Wi-Fi')).toBeInTheDocument();
  });

  // switch
  it('switchs property amenities checkboxes', () => {
    const { getByLabelText } = render(
      <Router>
        <CreateList />
      </Router>
    );
    const airConditionCheckbox = getByLabelText('Air-Condition');
    fireEvent.click(airConditionCheckbox);
    expect(airConditionCheckbox).toBeChecked();

    const poolCheckbox = getByLabelText('Pool');
    fireEvent.click(poolCheckbox);
    expect(poolCheckbox).toBeChecked();

    const kitchenCheckbox = getByLabelText('Kitchen');
    fireEvent.click(kitchenCheckbox);
    expect(kitchenCheckbox).toBeChecked();

    const wifiCheckbox = getByLabelText('Wi-Fi');
    fireEvent.click(wifiCheckbox);
    expect(wifiCheckbox).toBeChecked();
  });

  // image
  it('upload image on button click', () => {
    const fileInput = {
      click: jest.fn(),
      addEventListener: jest.fn(),
    };
    const spy = jest.spyOn(document, 'getElementById');
    spy.mockReturnValue(fileInput);
    const { getByText } = render(
      <Router>
        <CreateList />
      </Router>
    );
    const uploadButton = getByText('Upload Image');
    fireEvent.click(uploadButton);
    expect(fileInput.click).toHaveBeenCalled();
    spy.mockRestore();
  });
});
