// DOCS for jest: https://jestjs.io/docs/api

import SibApiV3Sdk from "@getbrevo/brevo";
import {
  brevoGetAccount,
  createBrevoContact,
  sendBrevoEmail,
  handleBrevoError,
  BrevoTemplates,
  BrevoLists,
  BrevoContact,
  BrevoError,
  BrevoGender,
} from "./brevo.js";

const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
};

jest.mock("@getbrevo/brevo");
jest.mock("./logger", () => mockLogger);

describe("Brevo Integration Tests", () => {
  const mockApiKey = "test-api-key";

  beforeEach(() => {
    jest.resetAllMocks();
    process.env.BREVO_API_KEY = mockApiKey;
    mockLogger.info.mockClear();
    mockLogger.error.mockClear();
  });

  describe("brevoGetAccount", () => {
    it("should fetch account information successfully", async () => {
      const mockAccountInfo = { companyName: "Test Company" };
      const mockGetAccount = jest.fn().mockResolvedValue(mockAccountInfo);

      SibApiV3Sdk.AccountApi.mockImplementation(() => ({
        setApiKey: jest.fn(),
        getAccount: mockGetAccount,
      }));

      const result = await brevoGetAccount();

      expect(result).toEqual(mockAccountInfo);
      expect(mockGetAccount).toHaveBeenCalled();
    });

    it("should handle errors when fetching account information", async () => {
      const mockError: BrevoError = {
        body: "Error body",
        statusCode: 400,
        request: "Request details",
        code: "ERROR_CODE",
        message: "Error message",
      };

      SibApiV3Sdk.AccountApi.mockImplementation(() => ({
        setApiKey: jest.fn(),
        getAccount: jest.fn().mockRejectedValue(mockError),
      }));

      await expect(brevoGetAccount()).rejects.toThrow("ERROR_CODE");
    });
  });

  describe("createBrevoContact", () => {
    it("should create a contact successfully", async () => {
      const mockCreateContact = jest.fn().mockResolvedValue({ id: "123" });

      SibApiV3Sdk.ContactsApi.mockImplementation(() => ({
        setApiKey: jest.fn(),
        createContact: mockCreateContact,
      }));

      const email = "test@example.com";
      const attributes: BrevoContact = { FIRSTNAME: "John", LASTNAME: "Doe" };
      const listIds = [BrevoLists.EXAMPLE_LIST_ONE];

      const result = await createBrevoContact(email, attributes, listIds);

      expect(result).toEqual({ id: "123" });
      expect(mockCreateContact).toHaveBeenCalledWith(
        expect.objectContaining({
          email,
          attributes,
          listIds,
          updateEnabled: true,
        })
      );
    });
  });

  describe("sendBrevoEmail", () => {
    it("should send a transactional email successfully", async () => {
      const mockSendTransacEmail = jest
        .fn()
        .mockResolvedValue({ messageId: "abc123" });

      SibApiV3Sdk.TransactionalEmailsApi.mockImplementation(() => ({
        setApiKey: jest.fn(),
        sendTransacEmail: mockSendTransacEmail,
      }));

      const recipients = [{ email: "recipient@example.com" }];
      const templateId = BrevoTemplates.EXAMPLE_TEMPLATE_ONE;

      const result = await sendBrevoEmail(recipients, templateId);

      expect(result).toEqual({ messageId: "abc123" });
      expect(mockSendTransacEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: recipients,
          templateId,
        })
      );
    });
  });
  describe("handleBrevoError", () => {
    it("should log error and throw with error code", async () => {
      const mockError: BrevoError = {
        body: "Error body",
        statusCode: 400,
        request: "Request details",
        code: "ERROR_CODE",
        message: "Error message",
      };

      await expect(
        handleBrevoError(mockError, "TestBreadcrumb", { testData: "value" })
      ).rejects.toThrow("ERROR_CODE");
      expect(mockLogger.error).toHaveBeenCalledWith(
        "TestBreadcrumb",
        expect.objectContaining({
          message: "Error message",
          data: expect.objectContaining({
            data: { testData: "value" },
            statusCode: 400,
          }),
        })
      );
    });
  });
  describe("Edge cases and input validation", () => {
    it("should handle empty contact data", async () => {
      const mockCreateContact = jest.fn().mockResolvedValue({ id: "123" });
      SibApiV3Sdk.ContactsApi.mockImplementation(() => ({
        setApiKey: jest.fn(),
        createContact: mockCreateContact,
      }));

      const email = "test@example.com";
      const attributes: BrevoContact = {};

      await createBrevoContact(email, attributes);
      expect(mockCreateContact).toHaveBeenCalledWith(
        expect.objectContaining({
          email,
          attributes: {},
          updateEnabled: true,
        })
      );
    });

    it("should handle invalid email for contact creation", async () => {
      const mockCreateContact = jest
        .fn()
        .mockRejectedValue(new Error("Invalid email"));
      SibApiV3Sdk.ContactsApi.mockImplementation(() => ({
        setApiKey: jest.fn(),
        createContact: mockCreateContact,
      }));

      const email = "invalid-email";
      const attributes: BrevoContact = { FIRSTNAME: "John" };

      await expect(createBrevoContact(email, attributes)).rejects.toThrow(
        "Invalid email"
      );
    });
  });
  describe("BrevoGender enum usage", () => {
    it("should correctly use BrevoGender enum in contact creation", async () => {
      const mockCreateContact = jest.fn().mockResolvedValue({ id: "123" });
      SibApiV3Sdk.ContactsApi.mockImplementation(() => ({
        setApiKey: jest.fn(),
        createContact: mockCreateContact,
      }));

      const email = "test@example.com";
      const attributes: BrevoContact = {
        FIRSTNAME: "Jane",
        LASTNAME: "Doe",
        ANREDE: BrevoGender.woman.toString(),
      };

      await createBrevoContact(email, attributes);
      expect(mockCreateContact).toHaveBeenCalledWith(
        expect.objectContaining({
          attributes: expect.objectContaining({
            ANREDE: "1",
          }),
        })
      );
    });
  });
});
