import { useState, useEffect } from 'react';

const ProfitLossCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entries, setEntries] = useState({});
  const [totalProfit, setTotalProfit] = useState(0);
  const [monthSummary, setMonthSummary] = useState({
    profit: 0,
    loss: 0,
    net: 0
  });

  // Indian Market Holidays 2024-2025
  // Based on NSE/BSE calendar
  const holidays = {
    // 2024 Indian Market Holidays
    "2024-0-1": "New Year's Day",
    "2024-0-26": "Republic Day",
    "2024-2-8": "Holi",
    "2024-2-29": "Good Friday",
    "2024-3-9": "Ram Navami",
    "2024-3-11": "Dr. Ambedkar Jayanti",
    "2024-3-17": "Mahavir Jayanti",
    "2024-4-1": "Maharashtra Day",
    "2024-5-17": "Bakri Id",
    "2024-7-15": "Independence Day",
    "2024-8-2": "Ganesh Chaturthi",
    "2024-9-2": "Gandhi Jayanti",
    "2024-9-31": "Diwali/Laxmi Pujan",
    "2024-10-15": "Guru Nanak Jayanti",
    "2024-11-25": "Christmas",

    // 2025 Indian Market Holidays (Partial)
    "2025-0-1": "New Year's Day",
    "2025-0-26": "Republic Day",
    "2025-2-28": "Holi",
    "2025-3-18": "Good Friday",
    "2025-4-1": "Maharashtra Day",
    "2025-7-15": "Independence Day",
    "2025-9-2": "Gandhi Jayanti",
    "2025-9-23": "Diwali/Laxmi Pujan",
    "2025-11-25": "Christmas"
  };

  // Load data from localStorage when component mounts
  useEffect(() => {
    const savedEntries = localStorage.getItem('tradingCalendarEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Calculate days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get day of week (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Handle month change
  const changeMonth = (increment) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
  };

  // Handle profit/loss entry
  const handleEntryChange = (day, value) => {
    const key = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;
    const numValue = value === '' ? 0 : parseFloat(value);

    const updatedEntries = {
      ...entries,
      [key]: numValue
    };

    setEntries(updatedEntries);

    // Save to localStorage whenever entries change
    localStorage.setItem('tradingCalendarEntries', JSON.stringify(updatedEntries));
  };

  // Calculate monthly summary whenever entries change
  useEffect(() => {
    let profit = 0;
    let loss = 0;
    let net = 0;
    let total = 0;

    Object.entries(entries).forEach(([key, value]) => {
      const [year, month, _] = key.split('-').map(Number);

      if (year === currentDate.getFullYear() && month === currentDate.getMonth()) {
        if (value > 0) {
          profit += value;
        } else if (value < 0) {
          loss += Math.abs(value);
        }
        net += value;
      }

      total += value;
    });

    setMonthSummary({ profit, loss, net });
    setTotalProfit(total);
  }, [entries, currentDate]);

  // Generate calendar cells
  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const days = [];

    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="bg-gray-100 p-2 border border-gray-200"></div>
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
      const key = `${year}-${month}-${day}`;
      const value = entries[key] || '';

      // Check if the day is a holiday or weekend
      const isHoliday = holidays[key];
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
      const isMarketClosed = isHoliday || isWeekend;
      const isToday = new Date().getDate() === day &&
        new Date().getMonth() === month &&
        new Date().getFullYear() === year;

      // Determine background color based on today, holiday, and weekend status
      let bgColor = 'bg-white';
      if (isToday) bgColor = 'bg-blue-50';
      if (isWeekend) bgColor = 'bg-gray-100';
      if (isHoliday) bgColor = 'bg-red-50';

      const textColor = value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-gray-800';

      days.push(
        <div key={day} className={`${bgColor} p-2 border border-gray-200`}>
          <div className="flex justify-between">
            <div>
              <span className={`font-bold ${isMarketClosed ? 'text-gray-500' : ''}`}>{day}</span>
              {isHoliday && (
                <div className="text-xs text-red-600 font-medium mt-1">{isHoliday}</div>
              )}
              {isWeekend && !isHoliday && (
                <div className="text-xs text-gray-500 font-medium mt-1">Weekend</div>
              )}
            </div>
            {value !== '' && (
              <span className={`${textColor} font-semibold`}>
                {formatCurrency(value)}
              </span>
            )}
          </div>
          {!isMarketClosed && (
            <input
              type="number"
              value={value}
              onChange={(e) => handleEntryChange(day, e.target.value)}
              placeholder="P/L"
              className="w-full mt-1 p-1 border border-gray-300 rounded text-sm"
              step="0.01"
            />
          )}
        </div>
      );
    }

    return days;
  };

  // Get month name
  const getMonthName = () => {
    return currentDate.toLocaleString('default', { month: 'long' });
  };

  // Get trading days count in current month
  const getTradingDaysCount = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);

    let tradingDays = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();
      const key = `${year}-${month}-${day}`;

      const isHoliday = holidays[key];
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      if (!isHoliday && !isWeekend) {
        tradingDays++;
      }
    }

    return tradingDays;
  };

  // Function to clear all data
  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all profit/loss data? This cannot be undone.')) {
      localStorage.removeItem('tradingCalendarEntries');
      setEntries({});
    }
  };

  // Function to export data
  const handleExportData = () => {
    const dataStr = JSON.stringify(entries, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `trading-data-${new Date().toISOString().slice(0, 10)}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Function to import data
  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        setEntries(importedData);
        localStorage.setItem('tradingCalendarEntries', JSON.stringify(importedData));
        alert('Data imported successfully!');
      } catch (error) {
        alert('Failed to import data. Please check the file format.');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);

    // Reset the file input
    event.target.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Calendar Header */}
        <div className="bg-blue-600 text-white p-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => changeMonth(-1)}
              className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded"
            >
              &larr;
            </button>

            <h2 className="text-xl font-bold">
              {getMonthName()} {currentDate.getFullYear()}
            </h2>

            <button
              onClick={() => changeMonth(1)}
              className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded"
            >
              &rarr;
            </button>
          </div>
          <div className="text-center mt-2 text-sm">
            <span className="bg-blue-700 px-2 py-1 rounded">
              Trading Days: {getTradingDaysCount()}
            </span>
          </div>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 bg-gray-200 font-semibold">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-2 text-center">{day}</div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 auto-rows-fr">
          {renderCalendar()}
        </div>

        {/* Summary */}
        <div className="bg-gray-100 p-4 mt-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Monthly Summary</h3>
            <div className="flex space-x-2">
              <div className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded border border-red-200">
                <span className="font-medium">Market Holidays</span>
              </div>
              <div className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200">
                <span className="font-medium">Weekends (Sat-Sun)</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded shadow">
              <p className="text-sm text-gray-500">Total Profit</p>
              <p className="text-green-600 font-bold">{formatCurrency(monthSummary.profit)}</p>
            </div>
            <div className="bg-white p-3 rounded shadow">
              <p className="text-sm text-gray-500">Total Loss</p>
              <p className="text-red-600 font-bold">{formatCurrency(monthSummary.loss)}</p>
            </div>
            <div className="bg-white p-3 rounded shadow">
              <p className="text-sm text-gray-500">Net P/L</p>
              <p className={`font-bold ${monthSummary.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(monthSummary.net)}
              </p>
            </div>
          </div>
          <div className="mt-4 bg-white p-3 rounded shadow">
            <p className="text-sm text-gray-500">All-Time Total</p>
            <p className={`font-bold text-lg ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalProfit)}
            </p>
          </div>

          {/* Data Management Section */}
          <div className="mt-4 p-3 bg-white rounded shadow">
            <h3 className="font-bold text-md mb-2">Data Management</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleExportData}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
              >
                Export Data
              </button>

              <label className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm cursor-pointer">
                Import Data
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportData}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleClearData}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
              >
                Clear All Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitLossCalendar;