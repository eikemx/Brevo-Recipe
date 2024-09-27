import logger from ""; // Import your favorite logger
import {
  BrevoContact,
  BrevoGender,
  BrevoLists,
  BrevoResponse,
  BrevoTemplates,
  createBrevoContact,
  handleBrevoError,
  sendBrevoEmail,
} from "./brevo";

export async function sendBrevoEmailToUser(quote): Promise<BrevoResponse> {
  const { id } = quote;
  const gender = BrevoGender[quote.policyHolder.gender];
  const formattedDate = new Date().toLocaleDateString("de-DE");
  const email = "daisy.duck@mail.com";
  const contactData: BrevoContact = {
    FIRSTNAME: "Daisy",
    LASTNAME: "Duck",
    ANREDE: gender,
    GEBURTSTAG: "01/01/1990",
    TRANSACTIONAL_ID: id,
    TRANSACTIONAL_DATE: formattedDate,
  };
  try {
    createBrevoContact(email, contactData, [BrevoLists.EXAMPLE_LIST_ONE]).then(
      (data: any) => {
        logger.info(
          "Brevo Create Contact: API called successfully. Returned data:",
          { data }
        );
      },
      (error: any) => {
        handleBrevoError(
          error,
          "QuoteApplication.applyQuote.brevo.createContact",
          {
            applicationId: id,
          }
        );
      }
    );
  } catch (error) {
    logger.error("QuoteApplication.sendEmail.createBrevoContact", {
      message: "Something went wrong while trying to create a Brevo Contact.",
      data: { error },
    });
  }
  try {
    sendBrevoEmail([{ email }], BrevoTemplates.EXAMPLE_TEMPLATE_ONE).then(
      (data: any) => {
        logger.info(
          "Brevo Send Email: API called successfully. Returned data:",
          { data }
        );
      },
      (error: any) => {
        handleBrevoError(error, "QuoteApplication.applyQuote.brevo.sendEmail", {
          applicationId: id,
        });
      }
    );
  } catch (error) {
    logger.error("QuoteApplication.sendEmail", {
      message: "Something went wrong while trying to send a Brevo Email.",
      data: { error },
    });
  }
}
