# Expense Calculator

A simple web application for calculating monthly expenses.

## Project Structure

```
calculator/
├── src/
│   └── frontend/
│       ├── index.html
│       └── script.js
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
├── manage.sh
└── README.md
```

## Features

- Add and remove expenses
- Calculate total monthly expenses
- Calculate average daily expenses
- Display top 3 largest expenses
- Automatic test data population

## Running the Application

### Using the Management Script (Recommended)

The project includes a management script (`manage.sh`) that provides an interactive menu for managing the application:

1. Make the script executable:
```bash
chmod +x manage.sh
```

2. Run the script:
```bash
./manage.sh
```

3. Choose from the following options:
   - 1: Start application
   - 2: Rebuild application
   - 3: Stop application
   - 4: Run tests
   - 5: Exit

### Manual Docker Commands

Alternatively, you can use Docker commands directly:

1. Start the application:
```bash
docker-compose -f docker/docker compose.yml up -d
```

2. Stop the application:
```bash
docker-compose -f docker/docker compose.yml down
```

3. Rebuild the application:
```bash
docker-compose -f docker/docker compose.yml build --no-cache
```

4. Run tests:
```bash
docker build -f Dockerfile.test -t expense-calculator-tests .
docker run --rm expense-calculator-tests
```

## Usage

1. Open your browser and navigate to:
```
http://localhost:8080
```

2. Use the application:
   - Click "Load Test Data" to populate example expenses
   - Add new expenses using the input fields
   - Remove expenses using the "Remove" button
   - Click "Calculate" to see the results

## Example

Input:
- Groceries: $15,000
- Rent: $40,000
- Transportation: $5,000
- Entertainment: $10,000
- Communication: $2,000
- Gym: $3,000

Results:
- Total Expenses: $75,000
- Average Daily Expense: $2,500
- Top 3 Largest Expenses:
  1. Rent: $40,000
  2. Groceries: $15,000
  3. Entertainment: $10,000 