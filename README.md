# Yoga Management System

A **Spring Boot and Angular** project for managing yogo sessions, featuring **JWT authentication**, **REST APIs**, and **database integration**.
The goal is to implement a fully tested system ensuring reliability and maintainability across all layers. 🚀
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

TODO
