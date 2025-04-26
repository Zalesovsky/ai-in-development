# API Testing: Identifying Defects in Product Data

## Task Description
Develop automated tests to validate data provided by a public API to detect errors and anomalies.

## Tools
- CursorAI for generating test scenarios or ChatGPT
- ReqBin (reqbin.com) or Postman for executing API requests
- API: https://fakestoreapi.com/products (mock store)

## Test Objectives
1. Verify server response code (expected 200)
2. Confirm the presence of the following attributes for each product:
   - `title` (name) - must not be empty
   - `price` (price) - must not be negative
   - `rating.rate` - must not exceed 5
3. Generate a list of products containing defects

## Implementation
The implementation will be done using Python with the following structure:
- `tests/` - Contains test files
- `src/` - Contains the main implementation
- `requirements.txt` - Project dependencies

## Getting Started
1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run tests:
```bash
python -m pytest tests/
```

## Expected Output
The tests should identify and report any products that:
- Have empty titles
- Have negative prices
- Have rating rates exceeding 5
- Are missing any required fields 