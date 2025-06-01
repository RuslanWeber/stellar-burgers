import * as orderFixture from '../fixtures/order.json';

describe('Интеграционное тестирование конструктора бургеров', () => {
  beforeEach(() => {
    // Мокаем API-запрос получения ингредиентов
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients' });

    cy.visit('/');
  });

  it('Отображаются доступные ингредиенты', () => {
    cy.get('[data-ingredient="bun"]').should('have.length.greaterThan', 0);
    cy.get('[data-ingredient="main"], [data-ingredient="sauce"]').should(
      'have.length.greaterThan',
      0
    );
  });

  describe('Работа модального окна ингредиента', () => {
    context('Открытие', () => {
      it('Модалка появляется при клике на ингредиент', () => {
        cy.get('[data-ingredient="bun"]:first').click();
        cy.get('#modals').children().should('have.length', 2);
      });

      it('Модальное окно сохраняется после перезагрузки', () => {
        cy.get('[data-ingredient="bun"]:first').click();
        cy.reload();
        cy.get('#modals').children().should('have.length', 2);
      });
    });

    context('Закрытие', () => {
      it('Закрытие по кнопке (крестику)', () => {
        cy.get('[data-ingredient="bun"]:first').click();
        cy.get('#modals button:first').click();
        cy.wait(500);
        cy.get('#modals').children().should('have.length', 0);
      });

      it('Закрытие по клику на затемнение', () => {
        cy.get('[data-ingredient="bun"]:first').click();
        cy.get('#modals>div:nth-of-type(2)').click({ force: true });
        cy.wait(500);
        cy.get('#modals').children().should('have.length', 0);
      });

      it('Закрытие по клавише Escape', () => {
        cy.get('[data-ingredient="bun"]:first').click();
        cy.get('body').type('{esc}');
        cy.wait(500);
        cy.get('#modals').children().should('have.length', 0);
      });
    });
  });

  describe('Оформление заказа', () => {
    beforeEach(() => {
      // Подстановка тестовых токенов
      cy.setCookie('accessToken', 'EXAMPLE_ACCESS_TOKEN');
      localStorage.setItem('refreshToken', 'EXAMPLE_REFRESH_TOKEN');

      // Мокаем авторизацию, заказ и получение ингредиентов
      cy.intercept('GET', 'api/auth/user', { fixture: 'user' });
      cy.intercept('POST', 'api/orders', { fixture: 'order' });
      cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients' });

      cy.visit('/');
    });

    it('Успешное оформление заказа после выбора ингредиентов', () => {
      // Изначально кнопка должна быть заблокирована
      cy.get('[data-order-button]').should('be.disabled');

      // Добавляем булку
      cy.get('[data-ingredient="bun"]:first button').click();
      cy.get('[data-order-button]').should('be.disabled');

      // Добавляем начинку
      cy.get('[data-ingredient="main"]:first button').click();
      cy.get('[data-order-button]').should('be.enabled');

      // Оформляем заказ
      cy.get('[data-order-button]').click();

      // Проверяем, что открылось модальное окно с заказом
      cy.get('#modals').children().should('have.length', 2);

      // Убеждаемся, что отображается номер заказа
      cy.get('#modals h2:first').should('have.text', orderFixture.order.number);

      // После завершения заказа кнопка снова должна быть неактивной
      cy.get('[data-order-button]').should('be.disabled');
    });

    afterEach(() => {
      cy.clearCookie('accessToken');
      localStorage.removeItem('refreshToken');
    });
  });
});
