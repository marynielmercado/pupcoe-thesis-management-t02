CREATE TABLE "customer_favorite_products" (
  "id" INT,
  "customer_id" INT,
  "product_id" VARCHAR,
  PRIMARY KEY ("id")
);

CREATE INDEX "FK" ON  "customer_favorite_products" ("customer_id");

CREATE TABLE "products" (
  "id" INT,
  "name" VARCHAR(45),
  "about" VARCHAR(1000),
  "price" DECIMAL(5,2),
  "warranty" INT,
  "brand" VARCHAR(45),
  PRIMARY KEY ("id")
);

CREATE INDEX "FK" ON  "products" ("brand");

CREATE TABLE "products_category" (
  "id" INT,
  "product_id" INT,
  "category" VARCHAR(45),
  PRIMARY KEY ("id")
);

CREATE INDEX "FK" ON  "products_category" ("product_id");

CREATE TABLE "orders" (
  "id" INT,
  "product" VARCHAR(45),
  "customer" VARCHAR(45),
  "purchase_date" DATETIME,
  PRIMARY KEY ("id")
);

CREATE INDEX "FK" ON  "orders" ("product", "customer");

CREATE TABLE "customers" (
  "id" INT,
  "email" VARCHAR(45),
  "first_name" VARCHAR(45),
  "last_name" VARCHAR(45),
  "state" VARCHAR(45),
  "city" VARCHAR(45),
  "street" VARCHAR(45),
  "number" INT,
  PRIMARY KEY ("id")
);

CREATE TABLE "brands" (
  "id" INT,
  "description" VARCHAR(250),
  "name" VARCHAR(45),
  PRIMARY KEY ("id")
);

