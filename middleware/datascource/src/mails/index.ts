import {
  BrevoContact,
  BrevoGender,
  BrevoLists,
  BrevoProduct,
  BrevoRecipient,
  BrevoResponse,
  BrevoTemplates,
  createBrevoContact,
  handleBrevoError,
  sendBrevoEmail,
} from "./brevo";

export async function sendBrevoEmailToUser(quote): Promise<BrevoResponse> {
  const { global, id } = quote;
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
}
