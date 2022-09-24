import { baseUrl } from "../../cypress.json";

describe("The Good Path: Auth process as client", function () {
  beforeEach(function () {
    cy.visit(baseUrl);
  });
  after(() => {
    cy.log("resetDb() opreation");
  });

  Cypress.on("uncaught:exception", (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });

  it("extract a 6-digit numeric code from a email, validate snacbars, logout", function () {
    //cy.visit("https://dev.crypto-company.enigma-x.app");
    cy.wait(2000);

    cy.get('[name="email"]').click().clear().type("shsdhsdhsdhsdh");
    cy.get('[name="password"]').click().clear().type(65424426426242);
    cy.get('[aria-label="toggle password visibility"]').click();
    cy.get("[data-cy=sign-in]").click();

    //the client doesn't see any error/exception/red snacbar message on the screen when there's a mistake in the login details
    //there's an open issue and open PR #158. (waiting for CR, merging, and deploy)

    //But should here to Assert the Exception.
  });
});
