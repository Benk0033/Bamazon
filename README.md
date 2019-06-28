# Bamazon

This app is an Amazon-like storefront which can take in orders from customers and deplete stock from the store's inventory. It can also track product sales across your store's departments and then provide a summary of the highest-grossing departments in the store. The app comes in three flavors:
1. BamazonCustomer
2. BamazonManager
3. BamazonSupervisor

1. BamazonCustomer

   * Running this application will first display all of the items available for sale.
   ![image](https://user-images.githubusercontent.com/47204339/59488186-b4d75d00-8e33-11e9-868d-557204be40c8.png)

    -Then the app should prompts the user with two messages after confirming with them if they would like to buy anything
   * The first should ask them the ID of the product they would like to buy.
   * The second message should ask how many units of the product they would like to buy.
   * Once the customer has placed the order, the application should check if the store has enough of the product to meet the customer's request.
   * if the store has enough of the product, the customer's order will be fulfilledand the mySQL database will subtract the quantity that was purchased from the database

Image of database and stock before purchase
   ![image](https://user-images.githubusercontent.com/47204339/59488568-cbca7f00-8e34-11e9-8527-22e62f5c6470.png)
   
   ![image](https://user-images.githubusercontent.com/47204339/59488254-e9e3af80-8e33-11e9-88ea-a8c8f21eb5f5.png)
Image of database and stock after purchase
   ![image](https://user-images.githubusercontent.com/47204339/59488677-08967600-8e35-11e9-9f91-042e64cae34c.png)

   * If not, the app will let the customer know that there is insufficient quantity and how many is actually in stock, and then prevent the order from going through
   ![image](https://user-images.githubusercontent.com/47204339/59488436-670f2480-8e34-11e9-931d-f09fa4776ee4.png)


2. BamazonManager

 * List a set of menu options:

    * View Products for Sale
    
    * View Low Inventory
    
    * Add to Inventory
    
    * Add New Product

  * If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.

  * If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.

  * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.

  * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.

![image](https://user-images.githubusercontent.com/47204339/59488764-409db900-8e35-11e9-9aa2-c9c622a717d7.png)

![image](https://user-images.githubusercontent.com/47204339/59488839-780c6580-8e35-11e9-9aa4-c157cdc8911d.png)

![image](https://user-images.githubusercontent.com/47204339/59488872-8ce8f900-8e35-11e9-9e85-ba55328fead1.png)

![image](https://user-images.githubusercontent.com/47204339/59488911-af7b1200-8e35-11e9-8a50-2e13584f2147.png)

![image](https://user-images.githubusercontent.com/47204339/59488954-ce79a400-8e35-11e9-8d4f-5397d3bde594.png)


3. BamazonSupervisor

Running this application will list a set of menu options:

   * View Product Sales by Department
   
   * Create New Department

   When a supervisor selects `View Product Sales by Department`, the app should display a summarized table in their terminal/bash window

   The `total_profit` column should be calculated on the fly using the difference between `over_head_costs` and `product_sales`. `total_profit`

   ![image](https://user-images.githubusercontent.com/47204339/59489135-3203d180-8e36-11e9-9459-afb00077807e.png)

   ![image](https://user-images.githubusercontent.com/47204339/59489196-58c20800-8e36-11e9-83a4-63575698eb56.png)


Database View

![image](https://user-images.githubusercontent.com/47204339/59538264-f6a4e980-8ead-11e9-9bbf-dfd5fa67a0cd.png)

