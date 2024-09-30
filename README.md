# Brevo TypeScript-Node Recipe

This repository contains a comprehensive integration of the Brevo API v3 using TypeScript and Node.js. 
It provides a robust way to interact with Brevo's email and contact management services, including account information retrieval, contact management, and email sending capabilities.

## Documentation and Resources

- [Brevo API Documentation](https://developers.brevo.com/reference/getting-started-1)
- [Postman Collection](https://developers.brevo.com/docs/postman)

## Getting Started

1. Clone this repository:
   ```
   git clone https://github.com/your-username/brevo-typescript-node-recipe.git
   ```

2. Set up your Brevo API key:
   - Create a `.env` file in the root directory
   - Add your Brevo API key:
     ```
     BREVO_API_KEY=your_api_key_here
     ```

3. Update the `BREVO_API_KEY` constant in `brevo.ts` to use the environment variable:
   ```typescript
   const BREVO_API_KEY = process.env.BREVO_API_KEY || "";
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

The `index.ts` file provides a comprehensive example of a Brevo workflow:

1. Retrieve account information
2. Sync users to Brevo contacts
3. Send a promotional email to all contacts
4. Send a transactional email to a specific user

To run the example workflow:

```
ts-node index.ts
```

## Customization

### Templates and Lists

Customize available email templates and contact lists by modifying the `BrevoTemplates` and `BrevoLists` enums in `brevo.ts`.

### Contact Attributes

The `BrevoContact` interface in `brevo.ts` defines the structure for contact attributes. Modify this interface to match your specific needs.

## Testing

This project uses Jest for unit testing. To run the tests:

```
npm test
```

The test suite is located in `./brevo.spec.ts` and covers the main functionalities of the Brevo integration:


### Test Coverage

1. **Account Information Retrieval**
   - Successful fetching of account information
   - Error handling when fetching account information fails

2. **Contact Creation**
   - Successful creation of a contact with full details
   - Handling of empty contact data
   - Validation of email addresses
   - Correct usage of the BrevoGender enum

3. **Transactional Email Sending**
   - Successful sending of a transactional email

4. **Error Handling**
   - Proper logging and throwing of errors with the `handleBrevoError` function

5. **Edge Cases and Input Validation**
   - Handling of empty contact data
   - Handling of invalid email addresses

### Test Structure

The tests use Jest's mocking capabilities to mock the Brevo SDK (`@getbrevo/brevo`) and isolate the functionality of our integration. Each main function (`brevoGetAccount`, `createBrevoContact`, `sendBrevoEmail`, and `handleBrevoError`) has its own describe block with multiple test cases.

### Extending the Test Suite

When adding new features or modifying existing ones, make sure to update or add corresponding tests in `brevo.spec.ts`. This helps maintain the reliability and robustness of the integration.

## Logging

The integration uses a logger (import it from your favorite logging library) to track operations and errors. Ensure you have a logging mechanism in place.

## Error Handling

The `handleBrevoError` function in `brevo.ts` provides centralized error handling. It logs errors and can be extended to handle specific error types or perform additional actions.

## Types and Interfaces

The integration includes TypeScript types and interfaces for Brevo-specific data structures, ensuring type safety throughout the application.

## Best Practices

- Use environment variables for sensitive information like API keys
- Implement proper error handling and logging
- Use TypeScript types and interfaces for better code quality and developer experience
- Follow the example in `index.ts` to structure your Brevo-related operations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.