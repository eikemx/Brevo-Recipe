import logger from "./logger"; // Import your favorite logger
import {
  BrevoContact,
  BrevoGender,
  brevoGetAccount,
  BrevoLists,
  BrevoResponse,
  BrevoTemplates,
  createBrevoContact,
  handleBrevoError,
  sendBrevoEmail,
} from "./brevo";

const users = [
  {
    id: 1,
    email: "daisy.duck@mail.com",
    firstName: "Daisy",
    lastName: "Duck",
    gender: "woman",
    birthday: "1990-01-01",
  },
  {
    id: 2,
    email: "donald.duck@mail.com",
    firstName: "Donald",
    lastName: "Duck",
    gender: "man",
    birthday: "1990-10-10",
  },
];

async function runBrevoWorkflow() {
  try {
    // Step 1: Get Brevo account information
    const accountInfo = await brevoGetAccount();
    logger.info("Brevo Account Info", { accountInfo });

    // Step 2: Sync users to Brevo contacts
    for (const user of users) {
      await syncUserToBrevoContact(user);
    }

    // Step 3: Send a promotional email to all contacts
    await sendPromotionalEmail();

    // Step 4: Send a transactional email to a specific user
    const specificUser = users[0];
    await sendTransactionalEmailToUser(specificUser.id, "ORDER_CONFIRMATION");

    logger.info("Brevo workflow completed successfully");
  } catch (error) {
    logger.error("Error in Brevo workflow", { error });
  }
}

async function syncUserToBrevoContact(user: (typeof users)[0]): Promise<void> {
  const contactData: BrevoContact = {
    FIRSTNAME: user.firstName,
    LASTNAME: user.lastName,
    ANREDE: user.gender,
    GEBURTSTAG: user.birthday,
  };

  try {
    const result = await createBrevoContact(user.email, contactData, [
      BrevoLists.EXAMPLE_LIST_ONE,
    ]);
    logger.info("User synced to Brevo contact", {
      userId: user.id,
      brevoContactId: result.id,
    });
  } catch (error) {
    await handleBrevoError(error, "syncUserToBrevoContact", {
      userId: user.id,
    });
  }
}

async function sendPromotionalEmail(): Promise<void> {
  const recipients = users.map((user) => ({ email: user.email }));

  try {
    const result = await sendBrevoEmail(
      recipients,
      BrevoTemplates.EXAMPLE_TEMPLATE_ONE
    );
    logger.info("Promotional email sent", { messageId: result.messageId });
  } catch (error) {
    await handleBrevoError(error, "sendPromotionalEmail");
  }
}

async function sendTransactionalEmailToUser(
  userId: number,
  transactionType: string
): Promise<BrevoResponse> {
  const user = users.find((user) => user.id === userId);
  if (!user) {
    throw new Error(`User not found: ${userId}`);
  }

  const formattedDate = new Date().toLocaleDateString("de-DE");
  const contactData: BrevoContact = {
    FIRSTNAME: user.firstName,
    LASTNAME: user.lastName,
    ANREDE: BrevoGender[user.gender as keyof typeof BrevoGender].toString(),
    GEBURTSTAG: user.birthday,
    TRANSACTIONAL_ID: userId.toString(),
    TRANSACTIONAL_DATE: formattedDate,
  };

  try {
    await createBrevoContact(user.email, contactData);

    const result = await sendBrevoEmail(
      [{ email: user.email }],
      BrevoTemplates.EXAMPLE_TEMPLATE_TWO
    );
    logger.info("Transactional email sent", {
      userId,
      transactionType,
      messageId: result.messageId,
    });
    return result;
  } catch (error) {
    return handleBrevoError(error, "sendTransactionalEmailToUser", {
      userId,
      transactionType,
    });
  }
}

runBrevoWorkflow().catch((error) => {
  logger.error("Unhandled error in Brevo workflow", { error });
});
