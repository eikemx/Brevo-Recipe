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

export async function sendSaveQuoteEmailToUser(
  quote: SaveQuoteArgs & { id: string },
  continueUrl: string
): Promise<BrevoResponse> {
  const { global, id, channel } = quote;
  const gender = BrevoGender[quote.policyHolder.gender];
  const product = BrevoProduct[quote.productKey as keyof typeof BrevoProduct];
  const variant = BrevoVariant[quote.variantKey as keyof typeof BrevoVariant];
  const isBrokerChannel = [
    channelByName.broker,
    channelByName.brokerPool,
  ].includes(channel as any);
  const formattedDate = new Date().toLocaleDateString("de-DE");
  const contactData: BrevoContact = {
    FIRSTNAME: quote.policyHolder.first_name,
    LASTNAME: quote.policyHolder.name,
    ANREDE: gender,
    GEBURTSTAG: quote.global.main_insured_date_of_birth,
    TELEFONNUMMER: quote.policyHolder.telephone_number,
    PRODUCT: product,
    ANTRAGSNUMMER: id,
    VARIANT: variant,
    CONTINUE_URL: continueUrl,
    OPT_IN_90_TAGE: true,
    TRANSACTIONAL_ID: id,
    TRANSACTIONAL_PRODUCT: quote.productKey,
    TRANSACTIONAL_INTERMEDIARY: quote.misc.intermediary,
    TRANSACTIONAL_DATE: formattedDate,
    TRANSACTIONAL_CONTINUE_URL: continueUrl,
    TRANSACTIONAL_FIRSTNAME_VN: quote.policyHolder.first_name,
    TRANSACTIONAL_LASTNAME_VN: quote.policyHolder.name,
    TRANSACTIONAL_EMAIL_VN: "",
    TRANSACTIONAL_PHONE: quote.policyHolder.telephone_number,
  };

  try {
    await Promise.all(
      global.additional_emails.map((additionalEmail: BrevoRecipient) => {
        contactData.TRANSACTIONAL_EMAIL_VN = additionalEmail.email;
        return createBrevoContact(
          additionalEmail.email,
          contactData,
          isBrokerChannel
            ? [BrevoLists.SAVE_QUOTE_B2B]
            : [BrevoLists.SAVE_QUOTE_B2C]
        ).then(
          (data: any) => {
            logger.info(
              "Brevo Create Contact: API called successfully. Returned data:",
              { data }
            );
          },
          (error: any) => {
            handleBrevoError(error, "SaveQuote.brevo.createContact", {
              applicationId: quote.id,
            });
            throw error;
          }
        );
      })
    );
  } catch (error) {
    logger.error("SaveQuote.sendEmail.createBrevoContact", {
      message: "Something went wrong while trying to create a Brevo Contact.",
      data: { error },
    });
    throw error;
  }

  try {
    return await sendBrevoEmail(
      global.additional_emails,
      isBrokerChannel
        ? BrevoTemplates.SAVE_QUOTE_B2B
        : BrevoTemplates.SAVE_QUOTE_B2C,
      null,
      brevoExtractAndFormatData(quote, id, continueUrl)
    );
  } catch (error) {
    logger.error("SaveQuote.sendEmail.sendBrevoEmail", {
      message: "Something went wrong while trying to send a Brevo Email.",
      data: { error },
    });
    informTeamsAboutBrevoError(
      `Sending saveQuoteEmail to user unsuccessful: ${error}`,
      `applicationId: ${id}`
    );
    throw error;
  }
}
