# Brevo TypeScript-Node Recipe

This repository contains a simple integration of the Brevo API v3 using TypeScript and Node.js. It provides a straightforward way to interact with Brevo's email and contact management services.

## Documentation and Resources

- [Brevo API Documentation](https://developers.brevo.com/reference/getting-started-1)
- [Postman Collection](https://developers.brevo.com/docs/postman)

## Getting Started

1. Clone this repository:
   ```
   git clone https://github.com/your-username/brevo-typescript-node-recipe.git
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up your Brevo API key:
   - Create a `.env` file in the root directory
   - Add your Brevo API key:
     ```
     BREVO_API_KEY=your_api_key_here
     ```

4. Update the `BREVO_API_KEY` constant in `brevo.ts` to use the environment variable:
   ```typescript
   const BREVO_API_KEY = process.env.BREVO_API_KEY || "";
   ```

## Usage

This integration provides several functions to interact with Brevo's API:

### Account Information

```typescript
import { brevoGetAccount } from "./brevo";

const accountInfo = await brevoGetAccount();
```

### Create a Contact

```typescript
import { createBrevoContact, BrevoContact, BrevoLists } from "./brevo";

const email = "example@email.com";
const contactData: BrevoContact = {
  FIRSTNAME: "John",
  LASTNAME: "Doe",
  ANREDE: "Mr",
  GEBURTSTAG: "1990-01-01",
};

const newContact = await createBrevoContact(email, contactData, [BrevoLists.EXAMPLE_LIST_ONE]);
```

### Send a Transactional Email

```typescript
import { sendBrevoEmail, BrevoTemplates } from "./brevo";

const recipients = [{ email: "recipient@example.com" }];
const templateId = BrevoTemplates.EXAMPLE_TEMPLATE_ONE;

const emailResult = await sendBrevoEmail(recipients, templateId);
```

### Error Handling

The integration includes error handling functionality:

```typescript
import { handleBrevoError } from "./brevo";

try {
  // Brevo API call
} catch (error) {
  await handleBrevoError(error, "ErrorLocation", { additionalData: "value" });
}
```

## Customization

### Templates and Lists

You can customize the available email templates and contact lists by modifying the `BrevoTemplates` and `BrevoLists` enums in `brevo.ts`.

### Contact Attributes

The `BrevoContact` interface in `brevo.ts` defines the structure for contact attributes. Modify this interface to match your specific needs.

## Example Implementation

The `index.ts` file provides an example of how to use the Brevo integration to send an email and create a contact. You can use this as a starting point for your own implementation.