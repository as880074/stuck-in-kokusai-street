# GEMINI Context: Stuck in Kokusai Street (卡在國際通)

This project is a static web application providing a 4-day, 3-night Okinawa travel itinerary and an interactive packing list. It features a unique "Hand Drawn" sketch aesthetic and supports multiple languages.

## Project Overview

- **Purpose**: A comprehensive travel planning tool for Okinawa, including a packing list with local storage, detailed itineraries for four days, weather forecasts, currency conversion, and map integration.
- **Main Technologies**: 
  - **Frontend**: HTML5, CSS3 (Vanilla CSS with custom properties), Vanilla JavaScript (ES6+).
  - **APIs**: Google Maps API, OpenWeather API, ExchangeRate API.
  - **Data Persistence**: `localStorage` for packing list state and user preferences (language).
- **Architecture**:
  - **Global Configuration**: Centralized settings in `js/config.js`.
  - **Common Utilities**: shared logic for UI components (header, footer, etc.) in `js/common.js`.
  - **Styling**: Hand-drawn sketch style defined in `css/variables.css` and `css/sketch.css`.

## Building and Running

### Development
The project is a static website and can be served using any local HTTP server:

- **Python**: `python -m http.server 8000`
- **Node.js**: `npx http-server -p 8000`
- **VS Code**: Use the Live Server extension.

Access the site at `http://localhost:8000`.

### Testing
There are no automated tests currently implemented. Verification is performed manually by checking the UI and local storage behavior.

## Development Conventions

- **Vanilla JS**: No frameworks or heavy libraries are used. Maintain the pure JavaScript approach for simplicity and performance.
- **Global `CONFIG`**: All API keys, endpoints, and translation strings MUST be added to or updated in `js/config.js`.
- **Translations**: Use the `t('key.subkey')` helper function for multi-language support.
- **Design Style**: Adhere to the "Hand Drawn" (Sketch) aesthetic. Use CSS variables from `css/variables.css` (e.g., `--radius-sketch`, `--font-handwritten`).
- **State Management**: Use `localStorage` via the keys defined in `CONFIG.STORAGE_KEYS`.
- **Responsive Design**: Follow the breakpoints defined in `css/variables.css` (Mobile < 768px, Tablet 768px-1024px).

## Key Files and Directories

- `index.html`: The landing page and packing list interface.
- `itinerary.html`: Overview of the 4-day trip.
- `day1.html` to `day4.html`: Detailed day-by-day plans.
- `js/config.js`: Central configuration, API keys, and translations.
- `js/common.js`: Common UI logic (Header, Footer, Language Switching).
- `css/variables.css`: Design tokens and the "Hand Drawn" style system.
- `_bmad/`: Detailed project specifications and technical documentation.
- `_planning/`: History of UX improvements and feature updates.

## API Configuration

To enable full functionality (Maps, Weather, Currency), you must provide valid API keys in `js/config.js`:

```javascript
const CONFIG = {
    GOOGLE_MAPS_API_KEY: 'YOUR_KEY_HERE',
    WEATHER_API_KEY: 'YOUR_KEY_HERE',
    // ...
};
```
