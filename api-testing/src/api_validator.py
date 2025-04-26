import requests
from typing import List, Dict, Any

class ProductValidator:
    def __init__(self, api_url: str = "https://fakestoreapi.com/products"):
        self.api_url = api_url

    def fetch_products(self) -> List[Dict[Any, Any]]:
        """Fetch products from the API."""
        response = requests.get(self.api_url)
        if response.status_code != 200:
            raise Exception(f"API request failed with status code {response.status_code}")
        return response.json()

    def validate_product(self, product: Dict[Any, Any]) -> List[str]:
        """Validate a single product and return list of defects."""
        defects = []
        
        # Check title
        if not product.get('title'):
            defects.append("Empty title")
        
        # Check price
        price = product.get('price')
        if price is not None and price < 0:
            defects.append("Negative price")
        
        # Check rating
        rating = product.get('rating', {}).get('rate')
        if rating is not None and rating > 5:
            defects.append("Rating exceeds 5")
        
        return defects

    def find_defective_products(self) -> Dict[int, List[str]]:
        """Find all products with defects."""
        products = self.fetch_products()
        defective_products = {}
        
        for product in products:
            defects = self.validate_product(product)
            if defects:
                defective_products[product['id']] = defects
        
        return defective_products 