DROP DATABASE IF EXISTS altf4;
CREATE DATABASE altf4;
USE altf4;

CREATE TABLE Product (
    ProductID INT PRIMARY KEY,
    Name VARCHAR(255),
    Rating FLOAT,
    Price FLOAT,
    Stock INT,
    URL LONGTEXT,
    Type ENUM('Desktop','Console','Mobile'),
    Description LONGTEXT  
);

CREATE TABLE Client (
    ClientID INT PRIMARY KEY,
    Password VARCHAR(255),
    Birthdate DATE,
    Username VARCHAR(255),
    Email VARCHAR(255),
    CPF VARCHAR(14),
    Name VARCHAR(255),
    CEP VARCHAR(9),
    Complement VARCHAR(255),
    Address VARCHAR(255),
    HouseNum INT,
    City VARCHAR(255),
    State VARCHAR(255),
    PhoneNumber VARCHAR(255),
    UNIQUE (PhoneNumber) -- Ensures each phone number is unique  
);

CREATE TABLE `Order` (
    OrderID INT PRIMARY KEY,
    ClientID INT,
    Status ENUM('Finalizada', 'Pendente'),
    DateTime DATETIME,
    FOREIGN KEY (ClientID)
        REFERENCES Client (ClientID)
        ON DELETE CASCADE  
);

CREATE TABLE OrderProduct (
    OrderProductID INT PRIMARY KEY,
    ProductID INT,
    OrderID INT,
    Amount INT,
    FOREIGN KEY (ProductID)
        REFERENCES Product (ProductID)
        ON DELETE SET NULL,
    FOREIGN KEY (OrderID)
        REFERENCES `Order` (OrderID)
        ON DELETE SET NULL  
);

CREATE TABLE Review (
    ReviewID INT PRIMARY KEY,
    ClientID INT,
    ProductID INT,
    Text LONGTEXT,
    Rating FLOAT,
    FOREIGN KEY (ClientID)
        REFERENCES Client (ClientID)
        ON DELETE SET NULL,
    FOREIGN KEY (ProductID)
        REFERENCES Product (ProductID)
        ON DELETE SET NULL  
);