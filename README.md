# Brevo TypeScript-Node Recipe

This repository contains a comprehensive integration of the Brevo API v3 using TypeScript and Node.js within a middleware structure.
It provides a robust way to interact with Brevo's email and contact management services, including account information retrieval, contact management, and email sending capabilities.
  
## Documentation and Resources

- [Brevo API Documentation](https://developers.brevo.com/reference/getting-started-1)
- [Postman Collection](https://developers.brevo.com/docs/postman)

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- A Brevo account and API key

## Project Structure

```
BREVO/
├── middleware/
│   └── datasource/
│       └── src/
│           └── mails/
│               ├── brevo.spec.ts
│               ├── brevo.ts
│               └── index.ts
├── node_modules/
├── .env
├── .gitignore
├── jest.config.js
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json
```

## Getting Started

1. Clone this repository:
   ```
   git clone https://github.com/your-username/brevo-typescript-node-recipe.git
   cd brevo-typescript-node-recipe
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
4. Update the Brevo configuration:
   - Open `middleware/datasource/src/mails/brevo.ts`
   - Replace the `BREVO_API_KEY` constant with:
     ```typescript
     const BREVO_API_KEY = process.env.BREVO_API_KEY || "";
     ```
5. Configure your Brevo templates and lists:
   - Update the `BrevoTemplates` and `BrevoLists` enums in `brevo.ts` with your actual template and list IDs from your Brevo account.

6. Run the example workflow:
   ```
   npm start
   ```

## Features

This integration provides several functions to interact with Brevo's API:

### Account Information

Retrieve account information from Brevo:

```typescript
import { brevoGetAccount } from "./brevo";

const accountInfo = await brevoGetAccount();
```

### Contact Management

Create or update a contact in Brevo:

```typescript
import { createBrevoContact, BrevoContact, BrevoLists } from "./brevo";

const email = "daisy.duck@email.com";
const contactData: BrevoContact = {
  FIRSTNAME: "Daisy",
  LASTNAME: "Duck",
  ANREDE: "Mrs",
  GEBURTSTAG: "1990-01-01",
};

const newContact = await createBrevoContact(email, contactData, [BrevoLists.EXAMPLE_LIST_ONE]);
```

### Email Sending

Send transactional or promotional emails:

```typescript
import { sendBrevoEmail, BrevoTemplates } from "./brevo";

const recipients = [{ email: "recipient@example.com" }];
const templateId = BrevoTemplates.EXAMPLE_TEMPLATE_ONE;

const emailResult = await sendBrevoEmail(recipients, templateId);
```

### Error Handling

The integration includes robust error handling:

```typescript
import { handleBrevoError } from "./brevo";

try {
  // Brevo API call
} catch (error) {
  await handleBrevoError(error, "ErrorLocation", { additionalData: "value" });
}
```

## Workflow Example

The `middleware/datasource/src/mails/index.ts` file provides a comprehensive example of a Brevo workflow:

1. Retrieve account information
2. Sync users to Brevo contacts
3. Send a promotional email to all contacts
4. Send a transactional email to a specific user

## Customization

### Templates and Lists

Customize available email templates and contact lists by modifying the `BrevoTemplates` and `BrevoLists` enums in `middleware/datasource/src/mails/brevo.ts`.

### Contact Attributes

The `BrevoContact` interface in `middleware/datasource/src/mails/brevo.ts` defines the structure for contact attributes. Modify this interface to match your specific needs.

## Testing

This project uses Jest for unit testing. To run the tests:

```
npm test
```

The test suite is located in `middleware/datasource/src/mails/brevo.spec.ts` and covers the main functionalities of the Brevo integration.

### Test Coverage

1. **Account Information Retrieval**
2. **Contact Creation**
3. **Transactional Email Sending**
4. **Error Handling**
5. **Edge Cases and Input Validation**

### Extending the Test Suite

When adding new features or modifying existing ones, make sure to update or add corresponding tests in `middleware/datasource/src/mails/brevo.spec.ts`. This helps maintain the reliability and robustness of the integration.

## Logging

The integration uses a logger to track operations and errors. Ensure you have a logging mechanism in place.

## Error Handling

The `handleBrevoError` function in `middleware/datasource/src/mails/brevo.ts` provides centralized error handling. It logs errors and can be extended to handle specific error types or perform additional actions.

## Types and Interfaces

The integration includes TypeScript types and interfaces for Brevo-specific data structures, ensuring type safety throughout the application.

## Best Practices

- Use environment variables for sensitive information like API keys
- Implement proper error handling and logging
- Use TypeScript types and interfaces for better code quality and developer experience
- Follow the example in `middleware/datasource/src/mails/index.ts` to structure your Brevo-related operations