import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import { EditListing } from './Edit';
import userEvent from '@testing-library/user-event';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    listingId: '123',
  }),
  useNavigate: () => jest.fn(),
}));

describe('EditListing Component', () => {

    // rendering
  it('renders EditListing component', () => {
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useParams: () => ({
        listingId: '123',
      }),
    }));

    const { getByText, getByLabelText } = render(
      <Router>
        <EditListing />
      </Router>
    );

    expect(getByText('Back to Your Listings')).toBeInTheDocument();
    expect(getByLabelText('Title:')).toBeInTheDocument();
    expect(getByLabelText('Street')).toBeInTheDocument();
    expect(getByLabelText('City')).toBeInTheDocument();
    expect(getByLabelText('State')).toBeInTheDocument();
    expect(getByLabelText('Postcode')).toBeInTheDocument();
    expect(getByLabelText('Country')).toBeInTheDocument();
    expect(getByLabelText('Price (per night):')).toBeInTheDocument();
    expect(getByLabelText('Country')).toBeInTheDocument();
    expect(getByLabelText('Property type')).toBeInTheDocument();
  });

  // input
  it('entering listing details', () => {
    const { getByLabelText } = render(
      <Router>
        <EditListing />
      </Router>
    );
    const titleInput = getByLabelText('Title:');
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
    expect(titleInput.value).toBe('Updated Title');
  });

  // select
  it('renders property type select options', () => {
    const { getByText, getByLabelText } = render(
      <Router>
        <EditListing />
      </Router>
    );
    const propertyTypeSelect = screen.getByLabelText('Property type');
    userEvent.click(propertyTypeSelect);
    const type = screen.getByRole('option', { name: 'Apartment' });
    userEvent.click(type);
    expect(propertyTypeSelect.textContent).toBe('Apartment');

    const bathroomSelect = screen.getByLabelText('Number of bathrooms');
    userEvent.click(bathroomSelect);
    const bathroom = screen.getByRole('option', { name: '2' });
    userEvent.click(bathroom);
    expect(bathroomSelect.textContent).toBe('2');

    const bedroomSelect = screen.getByLabelText('Number of bedrooms');
    userEvent.click(bedroomSelect);
    const bedroom = screen.getByRole('option', { name: '2' });
    userEvent.click(bedroom);
    expect(bedroomSelect.textContent).toBe('2');

    const bedSelect = screen.getByLabelText('Number of beds');
    userEvent.click(bedSelect);
    const bed = screen.getByRole('option', { name: '2' });
    userEvent.click(bed);
    expect(bedSelect.textContent).toBe('2');
  });

  // checkbox
  it('renders property amenities checkboxes', () => {
    const { getByText, getByLabelText } = render(
      <Router>
        <EditListing />
      </Router>
    );
    const airConditionCheckbox = screen.getByLabelText('Air-Condition');
    userEvent.click(airConditionCheckbox);
    expect(airConditionCheckbox).toBeChecked();

    const poolCheckbox = screen.getByLabelText('Pool');
    userEvent.click(poolCheckbox);
    expect(poolCheckbox).toBeChecked();

    const kitchenCheckbox = screen.getByLabelText('Kitchen');
    userEvent.click(kitchenCheckbox);
    expect(kitchenCheckbox).toBeChecked();

    const wifiCheckbox = screen.getByLabelText('Wi-Fi');
    userEvent.click(wifiCheckbox);
    expect(wifiCheckbox).toBeChecked();
  });

  // upload image
  it('upload image on button click', () => {
    const { getByText, getByLabelText } = render(
      <Router>
        <EditListing />
      </Router>
    );
    const fileInput = {
      click: jest.fn(),
      addEventListener: jest.fn(),
    };
    const spy = jest.spyOn(document, 'getElementById');
    spy.mockReturnValue(fileInput);
    const uploadButton = getByText('Upload Image');
    fireEvent.click(uploadButton);
    expect(fileInput.click).toHaveBeenCalled();
  });

  // save
  it('click save button', () => {
    const { getByText, getByLabelText } = render(
      <Router>
        <EditListing />
      </Router>
    );
    const saveChangesButton = getByText('Save Changes');
    fireEvent.click(saveChangesButton);

    jest.unmock('react-router-dom');
  });
});
