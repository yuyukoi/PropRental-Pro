import '@testing-library/cypress/add-commands';

describe('Registers successfully', () => {
  it('Successfully registers a new user', () => {
    cy.visit('localhost:3000/register');
    const email  = 'yuy4.yan@gmail.com';
    const name = 'Yu';
    const password = 'Yuuyu';
    const confirmPassword = 'Yuuyu';
    cy.get('#Email').type(email).should('have.value', email);
    cy.get('#Name').type(name).should('have.value', name);
    cy.get('#Password').type(password).should('have.value', password);
    cy.get('#confirmPassword').type(confirmPassword).should('have.value', confirmPassword);
    cy.get('#submit').click();
  });
});

describe('Creates a new listing successfully', () => {
  it('Successfully creates a new listing', () => {
    cy.visit('localhost:3000/createNewList');
    const title = 'My Apartment';
    const street = '200 pitt st';
    const city = 'Sydney';
    const state = 'NSW';
    const post = '2017';
    const country = 'AU';
    const price = 900;
    cy.get('#title').type(title).should('have.value', title);
    cy.get('#street').type(street).should('have.value', street);
    cy.get('#city').type(city).should('have.value', city);
    cy.get('#state').type(state).should('have.value', state);
    cy.get('#post').type(post).should('have.value', post);
    cy.get('#country').type(country).should('have.value', country);
    cy.get('#price').type(price).should('have.value', price.toString());
    cy.get('#propertyType').click();
    cy.get('ul[role="listbox"]').find('li').contains('Apartment').click();
    cy.get('#bathrooms').click();
    cy.get('ul[role="listbox"]').find('li').contains('2').click();
    cy.get('#bedromms').click();
    cy.get('ul[role="listbox"]').find('li').contains('3').click();
    cy.get('#beds').click();
    cy.get('ul[role="listbox"]').find('li').contains('4').click();
    cy.get('#air').click();
    cy.get('#pool').click();
    cy.get('#kitchen').click();
    cy.get('#wifi').click();
    cy.get('#image-upload').selectFile('./cypress/e2e/default.jpg', { force: true });
    cy.get('#submit').click();
  });
});

describe('Creates a new test listing successfully', () => {
  it('Successfully creates a new listing', () => {
    cy.visit('localhost:3000/createNewList');
    const title = 'My Apartment2';
    const street = '2200 pitt st';
    const city = 'Sydney';
    const state = 'NSW';
    const post = '2017';
    const country = 'AU';
    const price = 2900;
    cy.get('#title').type(title).should('have.value', title);
    cy.get('#street').type(street).should('have.value', street);
    cy.get('#city').type(city).should('have.value', city);
    cy.get('#state').type(state).should('have.value', state);
    cy.get('#post').type(post).should('have.value', post);
    cy.get('#country').type(country).should('have.value', country);
    cy.get('#price').type(price).should('have.value', price.toString());
    cy.get('#propertyType').click();
    cy.get('ul[role="listbox"]').find('li').contains('Apartment').click();
    cy.get('#bathrooms').click();
    cy.get('ul[role="listbox"]').find('li').contains('2').click();
    cy.get('#bedromms').click();
    cy.get('ul[role="listbox"]').find('li').contains('3').click();
    cy.get('#beds').click();
    cy.get('ul[role="listbox"]').find('li').contains('4').click();
    cy.get('#air').click();
    cy.get('#pool').click();
    cy.get('#kitchen').click();
    cy.get('#wifi').click();
    cy.get('#image-upload').selectFile('./cypress/e2e/default.jpg', { force: true });
    cy.get('#submit').click();
  });
});

describe('Updates the thumbnail and title of the listing successfully', () => {
  it('Updates the thumbnail and title of the listing successfully', () => {
    cy.visit('localhost:3000/yourList');
    cy.get('#totalButton').click();
    cy.get('#myList').click();
    cy.get('#edit').click();
    const title = 'new title';
    cy.get('#title').type(title);
    cy.get('#remove').click();
    cy.get('#image-upload').selectFile('./cypress/e2e/test2.jpg', { force: true });
    cy.get('#save').click();
  });
});

describe('Publish a listing successfully', () => {
  it('Publish a listing successfully', () => {
    cy.visit('localhost:3000/yourList');
    cy.get('#live').click();
    cy.get('#submit').click();
  });
});

describe('Unpublish a listing successfully', () => {
  it('Unpublish a listing successfully', () => {
    cy.visit('localhost:3000/yourList');
    cy.get('#delete').click();
  });
});

describe('Publish a listing successfully', () => {
  it('Publish a listing successfully', () => {
    cy.visit('localhost:3000/yourList');
    cy.get('#live').click();
    cy.get('#submit').click();
  });
});

describe('Make a booking successfully', () => {
  it('Make a booking successfully', () => {
    cy.get('#airbrb').click();
    cy.get('#title').click();
    cy.get('#book').click();

  });
});

describe('Logs out of the application successfully', () => {
  it('Logs out of the application successfully', () => {
    cy.visit('localhost:3000/');
    cy.get('#logout').click();
  });
});

describe('Logs back into the application successfully', () => {
  it('Logs back into the application successfully', () => {
    cy.get('#logout').click();
    const email  = 'yuy4.yan@gmail.com';
    const password = 'Yuuyu';
    cy.get('#Email').type(email).should('have.value', email);
    cy.get('#Password').type(password).should('have.value', password);
    cy.get('#submit').click();
  });
});