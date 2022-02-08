CREATE TABLE IF NOT EXISTS
    products(
        product_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        product_name VARCHAR(100) NOT NULL,
        product_description VARCHAR(500) NOT NULL,
        product_price VARCHAR(100) NOT NULL,
        product_category VARCHAR(100) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS 
    reviews(
        review_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        comment VARCHAR (1000) NOT NULL,
        rate VARCHAR (10) NOT NULL, 
        product_id INTEGER NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );