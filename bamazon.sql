-- 1. Create a MySQL Database called `bamazon`.
CREATE DATABASE bamazon;

USE bamazon;

-- 2. Then create a Table inside of that database called `products`.

-- 3. The products table should have each of the following columns:

--    * item_id (unique id for each product)

--    * product_name (Name of product)

--    * department_name

--    * price (cost to customer)

--    * stock_quantity (how much of the product is available in stores)

CREATE TABLE products
(
    item_id INT NOT NULL
    AUTO_INCREMENT,
    product_name VARCHAR
    (100),
    department_name VARCHAR
    (100),
    price DECIMAL
    (10,2),
    stock_quantity INT,
    PRIMARY KEY
    (item_id)
);

    -- 4. Populate this database with around 10 different products. (i.e. Insert "mock" data rows into this database and table).

    INSERT INTO products
        (product_name, department_name, price, stock_quantity)
    VALUES
        ("Glazed donut", "Food", 0.99, 500),
        ("Iphone X", "Electronics", 1200, 100),
        ("Blue Towel", "Home & Kitchen", 10, 1000),
        ("Xbox 720", "Video Games", 720, 720),
        ("PS7", "Video Games", 500, 500),
        ("Beef Jerky", "Food", 2.99, 700),
        ("MacBook Pro", "Electronics", 1300, 300),
        ("Skinny Jeans", "Clothes", 30, 300),
        ("Microwave", "Home & Kitchen", 100, 400),
        ("Snapback Hat", "Clothes", 25, 500);

    -- Add a new column 'COLUMN' to table 'TableName' in schema 'SchemaName'
    ALTER TABLE products
    ADD COLUMN product_sales INT /*new_column_datatype*/ NOT NULL;
    /*new_column_nullability*/


    SELECT *
    FROM products;





