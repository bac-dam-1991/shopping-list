# Shopping list application

## About

In this series, we will be creating a shopping list application. I will take you from local development all the way to deployment in AWS via Terraform. 

Moreover, the code that I will be taking you through will be production-ready as we will be running through on how to write end-to-end tests with Cypress and unit tests using Jest. We will talk about importance of maintainable code and use the three-tier architecture for better abstractions.

The application that we will be making will include authentication and authorisation so that users can sign up and log in. This is a never-before-seen comprehensive tutorial to web appplication development.

## Technology Stack

### Front-end
1. React Typescript (Front-end framework)
2. Material UI (UI library)
3. React Hook Form (Form management)
4. Joi (Form validation)
5. Cypress (E2E testing library)

### Back-end
1. Express (Server)
2. Joi (Payload validation)
3. MongoDB (NoSQL database)
4. Jest (Unit testing)

### Infrastructure
1. AWS (Cloud provider)
2. Terraform (Infrastructure-as-Code)
3. Okta Auth0 (Authentication)
4. Three-tier architecture
   1. Controllers
   2. Services
   3. Repositories

### Toolbox
1. Visual Studio Code (Code editor)
2. Github (Git version control system)
3. Prettier (Code formatting)
4. Postman (HTTP client)

## Prerequisite
1. Basic knowledge of Javascript and React
   1. Having knowledge about Typescript will help but not necessary

## Videos

### Introduction
1. Project overview
2. Prerequisites
3. What you will learn

### Setting up your machine
1. Installing Visual Studio Code
2. Installing Node and NPM

### Getting to know ReactJs
1. What is React?
2. Why React? (React vs Vue vs Angular)
3. Installing React
4. React fundamentals (theory)
5. JSX and functional components
6. The `useState` hook
7. Sharing states between sibling components

### Version control, Github and Prettier
1. What is version control and Git?
2. Setting up a Github account
3. Setting up a repository in Github
4. Setting up our project for Git
5. Setting up Prettier

### Coding with Typescript
1. What is Typescript?
2. Why Typescript?
3. Using Typescript with React

### UI component libraries
1. What are they?
2. UI components for React (MUI, Antd, Mantine, Chakra, Bootstrap)
3. Why use them?
4. Why MaterialUI (MUI)?
5. Installing MUI
6. Testing MUI (by creating a `NewGroceryListForm` component)

### Client-side routing
1. What is client-side routing (CSR)?
2. Installing React router DOM
3. Setting up views for our routes

### Setting up our server
1. What is a server?
2. What is a RESTful API?
3. HTTP verbs
4. HTTP status codes
5. Setting up an Express server

### Setting up MongoDB
1. What is a database?
2. Different types of databases
3. What is MongoDB?
4. Why use MongoDB?
5. Installing MongoDB, MongoDB client and Compass
6. Introduction to MongoDB
7. Introduction to Compass

### Creating our grocery list endpoints
1. Getting all grocery lists
2. Getting a grocery list
3. Add a new grocery list
4. Update an existing grocery list
5. Delete an existing grocery list

### Using Postman
1. What is Postman?
2. Why use Postman?
3. Installing Postman
4. Calling our endpoints with Postman

### Express routing
1. Middlewares and routers
2. Using routing in express
3. Custom errors and error handling in Express

### Creating our grocery items endpoints
1. Adding new grocery item
2. Removing a grocery item
3. Updating an existing grocery item

### Three-tier architecture and logging
1. What is it? (Controllers, services, repositories)
2. How does it help?
3. Refactor our endpoints into controllers, services and repositories

### Unit testing with Jest
1. What is unit testing?
2. What is Jest?
3. Installing and setting up Jest
4. Writing JSDoc
5. Writing unit tests for our repository functions
6. Writing unit tests for our service functions

### Integrations
1. Installing Axios
2. Fetching grocery lists
3. Fetching an individual grocery list
4. Adding a new grocery list
5. Deleting a grocery list
6. Updating a grocery list
7. Adding a new grocery item
8. Updating a grocery item
9. Removing a grocery item

### Form management
1. What is a form management library?
2. Form management libraries for React (`react-hook-form`, `formik`, `rc-field-form`)
3. Why use them?
4. Why React Hook Form?
5. Installing React Hook Form
6. Refactor `NewGroceryListForm` to use React Hook Form
7. Refactor `UpdateGroceryListForm` to use React Hook Form
8. Designing resuable forms
9. Refactor `NewGroceryListForm` and `UpdateGroceryListForm` into `GroceryListForm`
10. Create `GroceryItemForm`

### Form and payload validations
1. Front-end validation vs back-end validation
2. Installing Joi
3. Back-end validation using Joi
4. Adding validation to get an existing grocery list endpoint
5. Adding validation to add a grocery list endpoint
6. Adding validation to update a grocery list endpoint
7. Adding validation to delete a grocery list endpoint
8. Adding validation to add a grocery item endpoint
9. Adding validation to update a grocery item endpoint
10. Adding validation to remove a grocery item endpoint
11. Adding validation to add a grocery list form
12. Adding validation to update a grocery list form
13. Adding validation to add a grocery item form
14. Adding validation to update a grocery item form

### Authentication and authorisation
1. What is Auth system?
2. Setting up an Auth0 account
3. Setting up auth for front-end
4. Setting up auth for back-end

### End-to-end testing with Cypress
1. What is Cypress?
2. What is E2E testing?
3. Setting up Cypress
4. Testing the add a grocery list flow
5. Testing the update a grocery list flow
6. Testing the delete a grocery list flow
7. Testing the add a grocery item flow
8. Testing the update a grocery item flow
9. Testing the remove a grocery item flow

### Deploying to AWS using Terraform
1. What is AWS?
2. Lambda, S3, Cloudfront and API Gateway
3. What is Terraform?
4. Introduction to Terraform
5. Writing our Terraform code
6. Environment variables and secrets

### Wrapping up
1. What we have achieved?
2. Moving forward