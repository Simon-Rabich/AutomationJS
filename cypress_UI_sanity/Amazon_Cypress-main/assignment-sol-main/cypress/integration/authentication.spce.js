/// <reference types="cypress" />
import {
  baseUrl,
  clientUrl,
  username_btn,
  password_btn,
  signin_btn,
  eye_icon,
  drawer,
  kabab,
  actions,
  pin_unpin,
  duplicate,
  define,
  define_as_global,
  define_as_wrokspace,
  rename,
  digit_one,
  digit_two,
  digit_three,
  digit_four,
  digit_five,
  digit_six,
  select_another_way,
} from "../../cypress.json";

const serverId = "ys1whah9";
const testEmail = `loud-surrounded@${serverId}.mailosaur.net`;
const email_from = '[{"name":"","email":"no-reply@enigma-x.app","phone":null}]';
const title = "crypto company - Verification";

describe("The Good Path: Auth process as client and making Dashboard Actions" /*{ retries: 3 },*/, function () {
  Cypress.on("uncaught:exception", (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });

  beforeEach(function () {
    cy.visit(clientUrl);

    cy.location().should((loc) => {
      expect(loc.href).to.eq("https://dev.crypto-company.enigma-x.app/Login");
    });
    cy.title().should("equal", "crypto company - Sign In");
  });

  after(() => {
    cy.log("resetDb() opreation");
  });

  it("extract a 6-digit numeric code from a email, validate snacbars, logout", function () {
    cy.get(username_btn).should("exist");
    cy.get(password_btn).should("exist");
    cy.get(signin_btn).should("be.visible").should("exist");
    cy.get(eye_icon).should("be.visible").should("exist");
    cy.contains("Username").should("be.visible");
    cy.contains("Password").should("be.visible");
    cy.get("img").should("exist").should("be.visible");
    cy.get("h6").should("be.visible").should("contain", "Welcome!");

    cy.get(signin_btn).invoke("attr", "data-cy").should("equal", "sign-in"); //cypress element css
    cy.get(signin_btn).invoke("css", "position").should("equal", "relative"); //cypress check css property value

    Cypress.env() ? cy.log(true) : cy.log(false);

    cy.get(username_btn).click().clear().type(Cypress.env("USRNAME"));
    cy.get(password_btn).click().clear().type(Cypress.env("PASSWORD"));
    cy.get(eye_icon).click();
    cy.get(signin_btn).click();

    cy.location().should((loc) => {
      expect(loc.href).to.eq(
        "https://dev.crypto-company.enigma-x.app/verification"
      );
    });

    cy.get("h6").should("contain", "open security app And tap:");

    cy.get("#App_Store > tspan").should("exist").should("be.visible");
    cy.get("#Google_Play > tspan").should("exist").should("be.visible");

    cy.get(select_another_way).click();

    const img = 'img[alt="logo"]';
    cy.get(img).should(
      "have.attr",
      "src",
      "https://dev.assets.enigma-x.io/da654172-d108-11ec-bac9-062cd6ab3e51/logo_light.png"
    );

    cy.get("p").should("contain", "Authentication Link");

    cy.get(":nth-child(2) > .MuiButtonBase-root").click(); //Via email

    cy.get("[data-cy=snackbar-msg]")
      .contains("Open your mobile application please")
      .should("be.visible");

    cy.document().then((doc) => {
      const snackbar = doc.querySelector("[data-cy=snackbar-msg]");
      cy.get(snackbar).should("exist");
      cy.get("[data-cy=snackbar-msg]")
        .contains("Verification code sent to your email")
        .should("be.visible");
    });

    cy.get("h6")
      .first()
      .should("contain", "Verify your identity")
      .should("be.visible");
    cy.get("h2")
      .first()
      .should(
        "contain",
        "To confirm your identity, we emailed you a six-digit code."
      )
      .should("be.visible");
    // cy.get("p")
    //   .should("contain", "******@makor-capital.com")
    //   .should("be.visible");
    cy.get("h2")
      .should("contain", "Enter the code below to continue.")
      .should("be.visible");
    cy.get("p").should("contain", "Verification code").should("be.visible");
    cy.get("p").should("contain", "Resend code");

    // Six digits buttons
    cy.get('[aria-label="Please enter verification code. Character 1"]')
      .should("be.visible")
      .should("exist");
    cy.get('[aria-label="Character 2"]').should("be.visible").should("exist");
    cy.get('[aria-label="Character 3"]').should("be.visible").should("exist");
    cy.get('[aria-label="Character 4"]').should("be.visible").should("exist");
    cy.get('[aria-label="Character 5"]').should("be.visible").should("exist");
    cy.get('[aria-label="Character 6"]').should("be.visible").should("exist");

    cy.wait(5000);

    cy.mailosaurGetMessage(serverId, {
      sentTo: testEmail,
    }).then((email) => {
      expect(email.subject).to.equal("Enigma: Registration verification");
      expect(JSON.stringify(email.from)).to.equal(email_from);
      cy.title().should("equal", title);
      cy.get(email.html.body);
      const regEx = new RegExp("([0-9]{6})");
      const matches = regEx.exec(email.html.body);
      cy.log(matches[0]);
      cy.get(digit_one).type(matches[0][0]);
      cy.get(digit_two).type(matches[0][1]);
      cy.get(digit_three).type(matches[0][2]);
      cy.get(digit_four).type(matches[0][3]);
      cy.get(digit_five).type(matches[0][4]);
      cy.get(digit_six).type(matches[0][5]);
    });

    cy.get("p").should(($p) => {
      expect($p).to.have.length(5 || 4);
      assert.isOk("p");
      //expect($p).to.be.instanceOf(String);
    });

    cy.get("h2").should("contain", "Last Connected");
    cy.get("h3").should("contain", "- admin");
    cy.get('[class="MuiGrid-root MuiGrid-item"]').should("exist"); //the yellow box
    cy.get("p").should("contain", "DEV");

    const img_selector = 'img[alt="logo"]';
    cy.get(img_selector).should(
      "have.attr",
      "src",
      "https://dev.assets.enigma-x.io/da654172-d108-11ec-bac9-062cd6ab3e51/logo_light.png"
    );

    cy.location().should((loc) => {
      expect(loc.href).to.contain(
        "https://dev.crypto-company.enigma-x.app/dashboard/workspaces"
      );
    });

    cy.get("p").should("contain", "Create Your Dashboard");

    cy.wait(1000);
    cy.get(drawer).last().trigger("mouseover");
    cy.get(kabab).last().click({ force: true });
    cy.get(actions).should("exist");
    cy.get(pin_unpin).should("exist");
    cy.get(duplicate).should("exist");
    cy.get(define).should("exist");
    cy.get(define_as_global).should("exist");
    cy.get(define_as_wrokspace).should("exist");
    cy.get(rename).should("exist");

    cy.get(kabab).last().click({ force: true });
    cy.get(pin_unpin).last().click({ force: true }).wait(1000);

    cy.get(kabab).last().click();
    cy.get(pin_unpin).click({ force: true }).wait(1000);

    cy.get(kabab).last().click();
    cy.get(duplicate).click().wait(1000);

    cy.contains("Delete").click({ force: true });
    cy.contains("Yes, delete").click({ force: true });

    cy.get(drawer).last().trigger("mouseover");
    cy.get(kabab).first().click({ force: true });
    if (!cy.get(define).last().should("have.css", "display", "flex"))
      cy.get(define).last().click({ multiple: true }, { force: true }); //cy.get('[data-top="284"]')

    cy.document().then((doc) => {
      const snackbar = doc.querySelector("[data-cy=snackbar-msg]");
      cy.get(snackbar).should("exist");
    });

    // cy.contains("Something went wrong").should("be.visible");

    // cy.get(kabab).first().click({ force: true });
    // cy.get(define_as_global).last().click().wait(1000);

    cy.get(kabab).first().click({ force: true });
    cy.get(define_as_wrokspace).click({ force: true }).wait(1000);

    cy.get("h4").should("contain", "Workspace Icon");
    cy.get("#Name").click();
    cy.get(
      ":nth-child(1) > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root"
    ).click(); //choose first MUI icon
    cy.contains("Save").click();

    cy.get(drawer).last().trigger("mouseover");
    // cy.contains("Delete workspace").should("have.class", "MuiButton-label");
    cy.contains("Delete workspace").click();
    cy.contains("Yes, delete").should("be.visible").click({ force: true });

    // cy.get(drawer).last().trigger("mouseover");
    // cy.get(kabab).first().click({ force: true });
    // cy.get(rename).click({ force: true });

    cy.get(".MuiAvatar-root").click({ multiple: true }, { force: true }); //profile icon
    cy.get('[data-name="Line 15"]').first().click({ force: true }); //make logout
  });
});
