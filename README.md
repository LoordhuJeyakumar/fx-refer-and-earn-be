# Referral and Reward System for Francis Xavier

This project implements a comprehensive referral and reward system for Francis Xavier, enabling users to refer friends and earn rewards for successful referrals.

The system is built using Node.js and Express, with Prisma as the ORM for database interactions. It provides a robust API for managing referrals, tracking referral statuses, and handling user registrations and course purchases.

## Repository Structure

```
.
├── app.js
├── config/
│   ├── emailConfig.js
│   ├── envConfig.js
│   └── prisma-client.js
├── controllers/
│   └── referralController.js
├── index.js
├── middleware/
│   ├── errorHandler.js
│   ├── referralMiddleware.js
│   └── validate_referral.js
├── prisma/
│   └── migrations/
├── routes/
│   ├── index.js
│   ├── integrationRouter.js
│   └── referralRouter.js
├── services/
│   ├── EmailService.js
│   └── referralService.js
├── templates/
│   ├── emailVerification.html
│   ├── passwordReset.html
│   └── referral.html
└── utils/
    └── referralUtils.js
```

## Usage Instructions

### Installation

1. Ensure you have Node.js (version 14 or higher) and npm installed.
2. Clone the repository:
   ```
   git clone <repository-url>
   cd fx-refer-and-earn-be
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:
   ```
   PORT=3000
   EMAIL_HOST=your-email-host
   EMAIL_PORT=your-email-port
   EMAIL_SECURE=true
   EMAIL_USER=your-email-user
   EMAIL_PASSWORD=your-email-password
   FRONTEND_BASEURI=http://your-frontend-url
   ```

### Getting Started

1. Start the server:
   ```
   npm start
   ```
   For development with auto-restart:
   ```
   npm run dev
   ```
2. The server will start on the specified port (default: 3000).

### API Endpoints

1. Create a referral:
   ```
   POST /referral/create
   ```
   Body:
   ```json
   {
     "referrerName": "John Doe",
     "referrerEmail": "john@example.com",
     "refereeName": "Jane Smith",
     "refereeEmail": "jane@example.com",
     "message": "Optional custom message"
   }
   ```

2. Get referral stats:
   ```
   GET /referral/stats/:userId
   ```

3. List referrals:
   ```
   GET /referral/list/:userId
   ```
   Query parameters:
   - `status`: Filter by referral status
   - `page`: Page number (default: 1)
   - `limit`: Number of items per page (default: 10)

4. Handle user registration:
   ```
   POST /integration/userRegistration
   ```
   Body:
   ```json
   {
     "refereeEmail": "jane@example.com",
     "userId": "newUserId"
   }
   ```

5. Handle course purchase:
   ```
   POST /integration/coursePurchase
   ```
   Body:
   ```json
   {
     "refereeEmail": "jane@example.com",
     "courseId": "courseId",
     "purchaseAmount": 100
   }
   ```

### Configuration

- Email configuration: Update `config/emailConfig.js` with your email service settings.
- Environment variables: Modify `config/envConfig.js` to add or change environment variables.

### Testing & Quality

To run tests (once implemented):
```
npm test
```

### Troubleshooting

1. Database Connection Issues:
   - Ensure your database credentials are correct in the `.env` file.
   - Check if the database server is running and accessible.
   - If using a remote database, verify network connectivity.

2. Email Sending Failures:
   - Verify email configuration in `config/emailConfig.js`.
   - Check email service provider status.
   - Ensure `EMAIL_USER` and `EMAIL_PASSWORD` are correct in `.env`.

3. API Errors:
   - Check server logs for detailed error messages.
   - Verify request payload format and required fields.
   - Ensure all required environment variables are set.

For debugging:
- Set `NODE_ENV=development` in your `.env` file for verbose logging.
- Check `console.log` outputs in the terminal running the server.

## Data Flow

The referral system follows this general flow:

1. A user (referrer) creates a referral for a friend (referee).
2. The system generates a unique referral code and sends an invitation email to the referee.
3. When the referee registers, the system updates the referral status to "USER_REGISTERED".
4. If the referee purchases a course, the system updates the status to "COURSE_PURCHASED" and calculates rewards.
5. The system sends success notifications to both the referrer and referee.

```
[Referrer] -> Create Referral -> [System] -> Send Invitation -> [Referee]
                                     |
                                     v
[Referee] -> Register -> [System] -> Update Status
                             |
                             v
[Referee] -> Purchase -> [System] -> Update Status & Calculate Rewards
                             |
                             v
                    Send Success Notifications
```

Note: The system handles various edge cases, such as preventing self-referrals and managing referral expiration.

## Deployment

Deployment instructions are not provided in the current project structure. When implementing deployment, consider using containerization (e.g., Docker) and a CI/CD pipeline for automated testing and deployment.