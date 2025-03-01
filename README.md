# Yoga Management System

A **Spring Boot and Angular** project for managing yoga sessions, featuring **JWT authentication**, **REST APIs**, and **database integration**.

The goal is to implement a fully tested system ensuring reliability and maintainability across all layers.

---

## Table of Contents

- [Requirements](#requirements)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)

---

## Requirements

Before running this project, make sure you have the following installed:

- **Java 17** → This project requires Java 17 as the runtime environment. Ensure you have it installed. [Download](https://jdk.java.net/archive/)
- **Maven** → Used for managing project dependencies and building the application. [Installation Guide](https://maven.apache.org/install.html)
- **MySQL** → The backend database for storing application data. [Setup Instructions](https://openclassrooms.com/fr/courses/6971126-implementez-vos-bases-de-donnees-relationnelles-avec-sql/7152681-installez-le-sgbd-mysql)
- **Node.js & npm** → Required to install env-cmd, which helps manage environment variables effortlessly.[Download](https://nodejs.org/en/download)

---

## Getting Started

Follow these steps to set up and run the project.

### Dependencies

#### Configure Java Environment Variables

#### Windows

1. Open Command Prompt and run:
   ```sh
   echo %JAVA_HOME%
   ```
   If nothing is displayed, proceed with the following steps:
2. Open **System Properties** > **Advanced** > **Environment Variables**
3. Under **System Variables**, click **New** and add:
   - **Variable name**: `JAVA_HOME`
   - **Variable value**: `C:\Program Files\Java\jdk-17`
4. Add `%JAVA_HOME%\bin` to the **Path** variable.

#### Install npm dependencies globally

```sh
npm install -g env-cmd
```

(`env-cmd` is required to load environment variables from the `.env` file)

### Installing

#### Initialize the Database

#### 1. Login to MySQL

Open a terminal.

```sh
mysql -u root -p
```

(Enter your MySQL root password when prompted)

#### 2. Run the SQL script

Find the script inside the resources of the project.

```sh
source path/to/script.sql;
```


### Executing program BACK

#### Compile the project

```sh
mvn clean package
```

#### Run the application

```sh
mvn spring-boot:run
```

The application will be available at **[http://localhost:8080](http://localhost:8080)**.

#### Run test
```sh
mvn clean test
```
#### Jacoco Report availabe
```
back\target\site\index.html
```
 
---

### Executing program FRONT

Install dependencies:

> npm install

Launch Front-end:

> npm run start;

#### Test

####" E2E

Launching e2e test:

> npm run e2e

Generate coverage report (you should launch e2e test before):

> npm run e2e:coverage

Report is available here:

> front/coverage/lcov-report/index.html

#### Unitary test

Launching test:

> npm run test

for following change:

> npm run test:watch

Generate coverage report

> npm run test:coverage
Report is available here:

> front/coverage/jest/lcov-report/index.html


#### Coverage screens

![Backend](ressources/coverage/coverage-be.png)

![Frontend](ressources/coverage/coverage-front.png)

![E2E](ressources/coverage/coverage-e2e.png)

