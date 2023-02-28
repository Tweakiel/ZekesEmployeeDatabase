-- INSERT VALUES FROM DEMO INTO TABLES--

INSERT INTO department (depName)
VALUES ("Sales"),
       ("Finance"),
       ("Engineering"),
       ("Legal");


INSERT INTO roles(department_id, title, salary)
VALUES (1 ,"Sales Lead", 100000),
       (1 , "Salesperson", 80000),
       (2 , "Lead Engineer", 150000),
       (2 , "Software Engineer",120000),
       (3 , "Account Manager", 160000),
       (3 , "Accountant", 125000),
       (4 , "Legal Team lead",250000),
       (4 , "Lawyer",190000);
      

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ("John" , "Doe", 1, NULL),
       ("Mike" , "Chan", 1, 1 ),
       ("Ashley" , "Rodriguez", 2, NULL),
       ("Kevin" , "Chan", 2, 2),
       ("Kunal" , "Singh", 3, NULL),
       ("Malia" , "Brown", 3, 3),
       ("Sarah" , "Lourd", 4, NULL),
       ("Tom" , "Allen", 4, 4);

SELECT * FROM department;
SELECT * FROM roles;
SELECT * FROM employee;