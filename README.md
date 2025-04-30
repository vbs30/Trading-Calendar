# Stock Trading Profit/Loss Calendar

A React-based calendar application designed specifically for Indian stock market traders to track daily profit and loss entries with persistent data storage.

![Trading Calendar Demo](https://github.com/yourusername/trading-profit-loss-calendar/raw/main/demo.png)

## Features

- **Daily Profit/Loss Tracking**: Easily record your trading performance for each trading day
- **Automatic Data Persistence**: All entries are automatically saved and persist even after page reloads
- **Market-Aware Calendar**: 
  - Highlights weekends and market holidays
  - Prevents entries on non-trading days
  - Includes Indian market holidays for 2024-2025
- **Monthly Summaries**:
  - Track total profit, total loss, and net P&L for each month
  - View all-time total performance
  - See trading day count for each month
- **Data Management**:
  - Export your trading data as JSON file for backup
  - Import previously exported data
  - Option to clear all data with confirmation

## Live Demo

Check out the live demo [here](https://yourusername.github.io/trading-profit-loss-calendar)

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/trading-profit-loss-calendar.git
   ```

2. Navigate to the project directory:
   ```
   cd trading-profit-loss-calendar
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Usage

### Recording Entries
- Navigate to the desired month using the arrow buttons
- Enter profit (positive) or loss (negative) amounts for each trading day
- Data is automatically saved to your browser's localStorage

### Data Management
- **Export Data**: Click "Export Data" to download a JSON file of all your entries
- **Import Data**: Click "Import Data" to upload a previously exported JSON file
- **Clear Data**: Click "Clear All Data" to remove all entries (requires confirmation)

## Tech Stack

- React.js
- localStorage for data persistence
- Tailwind CSS for styling

## Customization

### Adding More Holidays

To add or modify market holidays, update the `holidays` object in the `ProfitLossCalendar.jsx` file:

```javascript
const holidays = {
  // Format: "YYYY-M-D": "Holiday Name"
  "2026-0-1": "New Year's Day", // January 1, 2026
  // Add more holidays as needed
};
```

Note: Month is zero-indexed (0 = January, 11 = December)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- Calendar design inspired by modern finance applications
- Holiday data sourced from official NSE/BSE market calendars

---

Made with ❤️ for Indian stock market traders