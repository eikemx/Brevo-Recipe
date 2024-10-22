// DOCS: https://developers.brevo.com/docs
import logger from "./logger.js"; // Import your favorite logger
import SibApiV3Sdk from "@getbrevo/brevo";

const BREVO_API_KEY = process.env.BREVO_API_KEY || "";

export enum BrevoTemplates {
  EXAMPLE_TEMPLATE_ONE = 1,
  EXAMPLE_TEMPLATE_TWO = 2,
  EXAMPLE_TEMPLATE_THREE = 3,
}

export enum BrevoLists {
  EXAMPLE_LIST_ONE = 1,
  EXAMPLE_LIST_TWO = 2,
  EXAMPLE_LIST_THREE = 3,
}

export enum BrevoGender {
  woman = 1,
  man = 2,
}

export interface BrevoContact {
  FIRSTNAME?: string;
  LASTNAME?: string;
  ANREDE?: string;
  GEBURTSTAG?: string;
  TELEFONNUMMER?: string;
  ANTRAGSNUMMER?: string;
  OPT_IN?: boolean;
  TRANSACTIONAL_ID?: string;
  TRANSACTIONAL_PRODUCT?: string;
  TRANSACTIONAL_DATE?: string;
}

export interface BrevoRecipient {
  email: string;
  name?: string;
}

export interface BrevoError {
  body: unknown;
  statusCode: number;
  request: unknown;
  code: string;
  message: string;
}

type BrevoResponseSuccess = ReturnType<typeof sendBrevoEmail>;

export type BrevoResponse = BrevoError | Awaited<BrevoResponseSuccess>;

// ACCOUNT ------------------------------------------------------
export async function brevoGetAccount() {
  const apiInstanceAccount = new SibApiV3Sdk.AccountApi();

  apiInstanceAccount.setApiKey(
    SibApiV3Sdk.AccountApiApiKeys.apiKey,
    BREVO_API_KEY
  );

  return apiInstanceAccount.getAccount();
}

// CONTACT ------------------------------------------------------
export async function createBrevoContact(
  email: string,
  attributes: BrevoContact,
  listIds?: number[]
) {
  const apiInstanceContact = new SibApiV3Sdk.ContactsApi();

  apiInstanceContact.setApiKey(
    SibApiV3Sdk.ContactsApiApiKeys.apiKey,
    BREVO_API_KEY
  );

  const createContact = new SibApiV3Sdk.CreateContact();

  createContact.email = email;
  createContact.attributes = attributes;
  createContact.updateEnabled = true;

  if (listIds) {
    createContact.listIds = listIds;
  }

  return apiInstanceContact.createContact(createContact);
}

// TRANSACTIONAL ------------------------------------------------------
export async function sendBrevoEmail(
  recipients: BrevoRecipient[],
  templateId: BrevoTemplates
) {
  const apiInstanceTransactional = new SibApiV3Sdk.TransactionalEmailsApi();

  apiInstanceTransactional.setApiKey(
    SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
    BREVO_API_KEY
  );
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.to = recipients;
  sendSmtpEmail.templateId = templateId;

  return apiInstanceTransactional.sendTransacEmail(sendSmtpEmail);
}

// ERROR HANDLING ------------------------------------------------------
export async function handleBrevoError(
  error: BrevoError,
  breadcrumb = "Middleware",
  data = {}
) {
  logger.error(breadcrumb, {
    message: error.message,
    data: {
      data,
      request: error.request,
      body: error.body,
      statusCode: error.statusCode,
    },
  });

  throw new Error(error.code);
}
