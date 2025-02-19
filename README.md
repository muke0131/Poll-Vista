# Poll-Vista
Poll Vista is a dynamic platform that simplifies survey creation, management, and participation. With features like customizable surveys, public/private settings, automatic deadline management, and insightful data visualization through bar and pie charts, Poll Vista empowers users to gather and analyze data with ease and precision.

## Key Features

- User Authentication using JWT Token
- Responsive UI
- Create and Manage Surveys
- Generate Public or Private Surveys & Shareable Links
- Automatic Survey Response Deactivation
- Analytics Using Visual Representation
- Download Responses in Excel

## Databases

### MySQL Databases & Tables (For Structured Data)
- **Database:** poll_vista
  - **users** – Stores user authentication and profile details.
  - **surveys** – Stores survey metadata.

### MongoDB Databases & Collections (For Flexible Data)
- **Database:** poll_vista
  - **questions** – Stores survey questions.
  - **responses** – Stores survey responses.

## Tech Stack

- **Backend:** Spring Boot
- **Frontend:** Angular
- **Databases:** MariaDB and MongoDB

## Installation Steps

### Prerequisites

- Node.js and npm
- Angular CLI
- Java Development Kit (JDK)
- Gradle
- MySQL
- MongoDB

### Backend Setup

1. **Clone the repository:**
   ```sh
   git clone https://github.com/muke0131/PollVista.git
   cd PollVista/backend
   ```

2. **Configure the database:**
   - Create a MySQL database named `poll_vista`.
   - Update the database configuration in application.properties:
     ```properties
     spring.datasource.url=jdbc:mariadb://localhost:3306/poll_vista
     spring.datasource.username=root
     spring.datasource.password=root
     spring.data.mongodb.uri=mongodb://localhost:27017/poll_vista
     ```

3. **Build and run the backend:**
   ```sh
   ./gradlew clean build
   ./gradlew bootRun
   ```

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```sh
   cd ../frontend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Run the frontend:**
   ```sh
   ng serve
   ```

### Access the Application

- The backend server will be running at `http://localhost:8082`.
- The frontend application will be running at `http://localhost:4200`.

You can now access Poll Vista and start creating and managing surveys!