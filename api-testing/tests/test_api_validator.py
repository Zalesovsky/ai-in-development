import pytest
from src.api_validator import ProductValidator

def test_fetch_products():
    validator = ProductValidator()
    products = validator.fetch_products()
    assert isinstance(products, list)
    assert len(products) > 0
    print("\nFetched products:", len(products))

def test_validate_product_empty_title():
    validator = ProductValidator()
    product = {
        'id': 1,
        'title': '',
        'price': 100,
        'rating': {'rate': 4.5}
    }
    defects = validator.validate_product(product)
    assert "Empty title" in defects
    print(f"\nProduct with empty title: ID {product['id']}")

def test_validate_product_negative_price():
    validator = ProductValidator()
    product = {
        'id': 1,
        'title': 'Test Product',
        'price': -100,
        'rating': {'rate': 4.5}
    }
    defects = validator.validate_product(product)
    assert "Negative price" in defects
    print(f"\nProduct with negative price: ID {product['id']}, Price: {product['price']}")

def test_validate_product_high_rating():
    validator = ProductValidator()
    product = {
        'id': 1,
        'title': 'Test Product',
        'price': 100,
        'rating': {'rate': 6.0}
    }
    defects = validator.validate_product(product)
    assert "Rating exceeds 5" in defects
    print(f"\nProduct with high rating: ID {product['id']}, Rating: {product['rating']['rate']}")

def test_find_defective_products():
    validator = ProductValidator()
    defective_products = validator.find_defective_products()
    assert isinstance(defective_products, dict)
    
    print("\n=== Defective Products Report ===")
    if defective_products:
        for product_id, defects in defective_products.items():
            print(f"\nProduct ID: {product_id}")
            print(f"Defects found: {', '.join(defects)}")
    else:
        print("\nNo defective products found!")
    print("===============================") 