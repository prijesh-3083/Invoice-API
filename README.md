# Invoice Generator API

## Project Overview

This Invoice Generator API is a comprehensive Node.js backend application designed to manage invoices with robust functionality and secure access controls. The system provides a complete solution for invoice creation, management, and tracking with role-based access control.

## Features

### Invoice Management
- **Full CRUD Operations**: Complete functionality for creating, reading, updating, and deleting invoices, generate invoice pdf
- **Automatic Invoice Number Generation**: Unique identifier for each invoice
- **Comprehensive Invoice Details**:
  - Customer information
  - Itemized billing
  - Tax calculations
  - Payment status tracking

### Authentication and Security
- **Role-Based Access Control (RBAC)**
  - Admin users: Full access to all invoice operations
  - Regular users: Read-only access to invoices
- **Secure JWT-Based Authentication**
  - Credential-based login
  - Protected routes with token authorization

### Key Functionalities
- Automatic tax calculation
- Discount support
- Payment status management
- Secure user authentication
- Generate Invoice Pdf

## Technology Stack

- **Backend**: Node.js
- **Authentication**: JSON Web Tokens (JWT)
- **Database**: MongoDB
- **Additional Libraries**:
    ```bash
    npm i bcryptjs dotenv express joi jsonwebtoken mongoose passport passport-jwt pdf-lib nodemon
    ```

## Prerequisites

- Node.js (v18.17.1)
- MongoDB installed
- npm package manager

## Installation

1. Clone the repository
   ```bash
   git clone https://github.com/prijesh-3083/Invoice-API.git
   ```

2. Install dependencies
   ```bash
   cd Invoice-API
   npm install
   ```

3. Set up environment variables
   - Create a `.env` file
   - Configure database connection
   - Set JWT configuration

4. Run the application
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST api/auth/login`: User/Admin authentication
- `POST api/auth/register`: User/Admin registration
- `POST api/auth/logout`: User/Admin logout

### GET Profile
- `GET api/auth/profile`: Get Authenticated User's profile

### Invoice Operations
- `POST api/invoices`: Create new invoice (Admin)
- `GET api/invoices`: List All invoices (Admin can access all, Regular User can access only own)
- `GET api/invoices/:id`: Retrieve specific invoice (Based on Id)
- `PUT api/invoices/:id`: Update invoice (Admin)
- `DELETE api/invoices/:id`: Delete invoice (Admin)
- `GET api/invoices/:id/pdf`: Get invoice Pdf (Admin)

## User Roles

- **Admin**
  - Full CRUD access to invoices
  - Manage payment statuses
  - Apply discounts and taxes
  - Generate invoice pdf

- **Regular User**
  - User's profile
  - View invoices
  - Limited read-only access

## Security Considerations

- JWT-based authentication
- Role-based access control
- Secure route protection
- Input validation

## Issues
    
- **1.Authorization Header Missing**
  - This error occurs when you make a request to the API (If you forgot to set Header-postman)

- **2.PDF Doesn't Load**
  - When you make a request in Postman, the page doesn't load

## Solution
- **1.Authorization Header Missing-Solution**
  - Select the Type: Choose the appropriate type "Bearer Token" from the dropdown.
  - Provide Credentials: Paste the bearer token.
  - Send the Request: Click the "Send" button to execute the request.

- **2.PDF Doesn't Load-Solution**
  - Install Extension in VS Code: vscode-pdf
  - Saving the PDF Document
   ```bash
   const pdfBytes = await pdfDoc.save();
   ```
  - Constructing the PDF File Path:
  ```bash
  const pdfpath = path.join('statics',${invoice.invoiceNumber}.pdf);
  ```
  - Writing the PDF to Disk:
  ```bash
  fs.writeFile(pdfpath, pdfBytes, (err)=>{});
  ```
  - Returning the PDF Path:
  ```bash
  return pdfpath;
  ```


## Contact

[Prijesh Vaghasiya] - [prijeshvaghasiya2003@gmail.com]

Project Link: [https://github.com/prijesh-3083/Invoice-API](https://github.com/prijesh-3083/Invoice-API)