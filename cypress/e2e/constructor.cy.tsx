const buns = '[data-cy=buns]';
const mains = '[data-cy=mains]';
const sauces = '[data-cy=sauces]';
const modal = '[data-cy=modal]';
const modalOverlay = '[data-cy=modal-overlay]';
import { TIngredient } from '@utils-types';

describe('Burger constructor tests', function () {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('ingredients');
    cy.visit('/');
  });

  it('Adding a bun', function () {
    cy.wait('@ingredients').then((interception) => {
      const bunName = interception.response?.body.data.find(
        (item: TIngredient) => item.type === 'bun'
      ).name;

      cy.get(buns).contains('Добавить').click();
      cy.get('.constructor-element_pos_top').contains(bunName);
      cy.get('.constructor-element_pos_bottom').contains(bunName);
    });
  });

  it('Adding a main', function () {
    cy.wait('@ingredients').then((interception) => {
      const mainName = interception.response?.body.data.find(
        (item: TIngredient) => item.type === 'main'
      ).name;

      cy.get(mains).contains('Добавить').click();
      cy.get('.constructor-element').contains(mainName);
    });
  });

  it('Adding a sauce', function () {
    cy.wait('@ingredients').then((interception) => {
      const sauceName = interception.response?.body.data.find(
        (item: TIngredient) => item.type === 'sauce'
      ).name;

      cy.get(sauces).contains('Добавить').click();
      cy.get('.constructor-element').contains(sauceName);
    });
  });
});

describe('Modal tests', function () {
  let itemName: string = ''

  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as(
      'ingredients'
    );
    // cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' });
    cy.visit('/');

    cy.wait('@ingredients')
      .then((interception) => {
        const ingredients = interception.response?.body.data;
        const index = Math.floor(ingredients.length * Math.random());
        itemName = interception.response?.body.data[index].name;
      });
  });

  it('Open modal', function () {
    cy.contains(itemName).click();
    cy.get(modal).should('exist');
    cy.get(modal).contains(itemName);
  });

  it('Close on button click', function () {
    cy.contains(itemName).click();
    cy.get(modal).find('button').click();
    cy.get(modal).should('not.exist');
  });

  it('Close on Esc key', function () {
    cy.contains(itemName).click();
    cy.get('body').type('{esc}');
    cy.get(modal).should('not.exist');
  });

  it('Close on overlay', function () {
    cy.contains(itemName).click();
    cy.get(modalOverlay).click({ force: true });
    cy.get(modal).should('not.exist');
  });
});

describe('Order creation tests', function () {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('POST', '/api/auth/login', { fixture: 'user.json' });
    cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', '/api/orders', { fixture: 'order.json' });
    cy.setCookie('accessToken', 'qwertyasdfghzxcvbn');
    window.localStorage.setItem('refreshToken', 'qwertyasdfghzxcvbn');

    cy.visit('/');
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    window.localStorage.removeItem('refreshToken');
  });

  it('Order creation', function () {
    cy.get(buns).contains('Добавить').click();
    cy.get(mains).contains('Добавить').click();
    cy.get(sauces).contains('Добавить').click();

    cy.contains('Оформить заказ').click();
    cy.get(modal).should('exist');
    cy.get(modal).contains('46918');
    cy.get(modalOverlay).click({ force: true });
    cy.get(modal).should('not.exist');

    cy.get('.text_type_main-default').contains('Выберите булки');
    cy.get('.text_type_main-default').contains('Выберите начинку');
  });
});
