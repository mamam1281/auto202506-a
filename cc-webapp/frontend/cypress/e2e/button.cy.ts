// cypress/e2e/button.cy.ts

describe('Button Component E2E Tests', () => {
  beforeEach(() => {
    // Button 데모 페이지 방문 (생성 예정)
    cy.visit('/components/button-demo');
  });

  describe('Basic Functionality', () => {
    it('renders different button variants', () => {
      cy.get('[data-testid="button-primary"]').should('be.visible');
      cy.get('[data-testid="button-secondary"]').should('be.visible');
      cy.get('[data-testid="button-outline"]').should('be.visible');
    });

    it('handles click events', () => {
      cy.get('[data-testid="button-clickable"]').click();
      cy.get('[data-testid="click-counter"]').should('contain', '1');
    });

    it('prevents clicks when disabled', () => {
      cy.get('[data-testid="button-disabled"]').should('be.disabled');
      cy.get('[data-testid="button-disabled"]').click({ force: true });
      cy.get('[data-testid="click-counter"]').should('contain', '0');
    });
  });

  describe('Visual States', () => {
    it('displays loading state correctly', () => {
      cy.get('[data-testid="button-loading"]').should('contain', '로딩 중');
      cy.get('[data-testid="button-loading"]').should('be.disabled');
      cy.get('[data-testid="button-loading"] .spinner').should('exist');
    });

    it('shows different sizes', () => {
      cy.get('[data-testid="button-small"]').should('have.class', 'sm');
      cy.get('[data-testid="button-medium"]').should('have.class', 'md');
      cy.get('[data-testid="button-large"]').should('have.class', 'lg');
    });
  });

  describe('Icon Functionality', () => {
    it('displays icons correctly', () => {
      cy.get('[data-testid="button-with-icon"]').within(() => {
        cy.get('[data-testid="button-icon"]').should('exist');
      });
    });

    it('handles icon-only buttons', () => {
      cy.get('[data-testid="button-icon-only"]').should('have.class', 'iconOnly');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      cy.get('[data-testid="button-disabled"]').should('have.attr', 'aria-disabled', 'true');
      cy.get('button').each(($btn) => {
        cy.wrap($btn).should('have.attr', 'type');
      });
    });

    it('is keyboard accessible', () => {
      cy.get('[data-testid="button-clickable"]').focus();
      cy.get('[data-testid="button-clickable"]').type('{enter}');
      cy.get('[data-testid="click-counter"]').should('contain', '1');
    });
  });

  describe('Responsive Design', () => {
    it('adapts to different screen sizes', () => {
      // Mobile
      cy.viewport(375, 667);
      cy.get('[data-testid="button-full-width"]').should('have.class', 'fullWidth');
      
      // Tablet
      cy.viewport(768, 1024);
      cy.get('[data-testid="button-full-width"]').should('be.visible');
      
      // Desktop
      cy.viewport(1280, 720);
      cy.get('[data-testid="button-full-width"]').should('be.visible');
    });
  });

  describe('Performance', () => {
    it('renders quickly', () => {
      const startTime = Date.now();
      cy.get('[data-testid="button-primary"]').should('be.visible').then(() => {
        const endTime = Date.now();
        expect(endTime - startTime).to.be.lessThan(1000);
      });
    });

    it('handles rapid clicking', () => {
      for (let i = 0; i < 10; i++) {
        cy.get('[data-testid="button-clickable"]').click();
      }
      cy.get('[data-testid="click-counter"]').should('contain', '10');
    });
  });

  describe('Visual Regression', () => {
    it('matches visual snapshots', () => {
      // Note: Visual regression testing would require additional setup
      cy.get('[data-testid="button-variants-container"]').should('be.visible');
      // cy.matchImageSnapshot('button-variants'); // Requires cypress-image-snapshot
    });
  });
});
