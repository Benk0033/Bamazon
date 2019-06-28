-- 1. Create a new MySQL table called `departments`. Your table should include the following columns:

--    * department_id

--    * department_name

--    * over_head_costs (A dummy number you set for each department)

CREATE TABLE departments
(
    department_id INT NOT NULL
    AUTO_INCREMENT,
department_name VARCHAR
    (100),
over_head_cost DECIMAL
    (10, 2) NOT NULL,
    PRIMARY KEY
    (department_id)
);

    -- Insert rows into table 'departments'
    INSERT INTO departments
        ( -- columns to insert data into
        department_name, over_head_costs
        )
    VALUES
        ( -- first row: values for the columns in the list above
            Food, 1000
),
        ( -- second row: values for the columns in the list above
            Electronics, 100000
),
        ( -- first row: values for the columns in the list above
            Home, 10000
),
        ( -- first row: values for the columns in the list above
            Games, 25000
),
        ( -- first row: values for the columns in the list above
            Clothes, 15000
);

