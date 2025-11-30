# Norwegian Address Autocomplete

A full-stack application providing real-time address autocomplete search functionality for Norwegian street addresses. Built with Node.js/TypeScript (backend) and React/TypeScript (frontend).

## Project Overview

This project consists of two parts:
- **Backend**: Express.js API server with trie-search for fast address lookup
- **Frontend**: React single-page application with real-time autocomplete

## Project Structure

```
Unleash/
├── backend/                 # Node.js/TypeScript Express API
│   ├── src/
│   │   ├── index.ts        # Express server entry point
│   │   ├── services/
│   │   │   └── addressSearch.ts  # Trie-based search service
│   │   └── types/
│   │       └── address.ts         # TypeScript interfaces
│   ├── adresses.json       # Norwegian address dataset
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # React/TypeScript SPA
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API client
│   │   ├── types/          # TypeScript types
│   │   └── __tests__/      # Test files
│   ├── package.json
│   └── vite.config.ts
└── README.md               # This file
```

## Requirements

- **Node.js**: 18+ 
- **npm** or **yarn**
- The `adresses.json` dataset file (already included in backend)

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend will start on `http://localhost:8080`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

### 3. Access the Application

Open `http://localhost:5173` in your browser. Start typing an address (minimum 3 characters) to see autocomplete suggestions.

## Backend Documentation

### Overview

The backend is a Node.js/TypeScript Express API server that provides autocomplete search functionality for Norwegian street addresses using a trie data structure for fast lookups.

### Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Search**: trie-search library
- **Development**: nodemon, ts-node

### Installation & Setup

```bash
cd backend
npm install
```

### Available Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Compile TypeScript to JavaScript
npm start        # Run production build
npm run type-check  # Type check without emitting files
```

### API Endpoints

#### `GET /search/:query`

Search for addresses matching the query.

**Parameters:**
- `query` (path parameter): Search query string (minimum 3 characters)

**Response:**
```json
[
  {
    "postNumber": 501,
    "city": "OSLO",
    "street": "Rodeløkka Postboks 6500-6599",
    "typeCode": 4,
    "type": "Postboksadresse",
    "district": "Grünerløkka",
    "municipalityNumber": 301,
    "municipality": "Oslo",
    "county": "Oslo"
  }
]
```

**Example:**
```bash
curl http://localhost:8080/search/rod
curl http://localhost:8080/search/%C3%B8sten  # URL encoded special characters
```

**Features:**
- Minimum 3 characters required
- Returns up to 20 results
- Case-insensitive substring matching
- Searches across: street, city, municipality, post number fields
- Supports Norwegian special characters (ø, å, æ)

#### `GET /monitoring`

Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

### Backend Architecture

**AddressSearchService** (`src/services/addressSearch.ts`):
- Loads address dataset from `adresses.json` on startup
- Uses trie-search for fast prefix/substring matching
- Indexes multiple fields: street, city, municipality, post number
- Implements substring matching with case-insensitive search
- Limits results to 20 matches

**Server** (`src/index.ts`):
- Express server with CORS enabled
- Error handling middleware
- URL decoding for special characters
- Runs on port 8080 (configurable via `PORT` environment variable)

### Environment Variables

- `PORT`: Server port (default: 8080)

### Production Build

```bash
npm run build
npm start
```

The compiled JavaScript will be in the `dist/` directory.

## Frontend Documentation

### Overview

The frontend is a React TypeScript single-page application providing a real-time autocomplete search interface for Norwegian addresses.

### Technology Stack

- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Testing**: Vitest + React Testing Library
- **Styling**: CSS

### Installation & Setup

```bash
cd frontend
npm install
```

### Available Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run test     # Run tests with Vitest
npm run lint     # Run ESLint
```

### Frontend Architecture

#### Components

- **AddressAutocomplete**: Main search component with input, keyboard navigation, and results display
- **AddressList**: Presentational component displaying search results
- **ErrorBoundary**: Catches and handles React component errors

#### Custom Hooks

- **useDebounce**: Debounces search queries (300ms delay)
- **useAddressSearch**: Manages search state, API calls, loading, and errors
- **useClickOutside**: Detects clicks outside component for dropdown UX

#### Services

- **addressApi**: API client with error handling, timeouts, and request cancellation

### State Management

Uses React hooks for state management:
- `useState` for local component state
- Custom hooks for shared logic
- Request cancellation to prevent race conditions

### Features

- ✅ Real-time search with debouncing (300ms)
- ✅ Keyboard navigation (arrow keys, Enter, Escape)
- ✅ Accessibility (ARIA labels, roles, keyboard support)
- ✅ Error handling (error boundaries and API errors)
- ✅ Loading states and indicators
- ✅ Request cancellation
- ✅ Click outside to close dropdown

### Environment Variables

- `VITE_API_BASE_URL`: Backend API base URL (default: `http://localhost:8080`)

Create a `.env` file in the frontend directory:
```
VITE_API_BASE_URL=http://localhost:8080
```

### Testing

#### Run Tests

```bash
cd frontend
npm run test              # Run all tests
npm run test -- --watch   # Watch mode
npm run test -- --coverage # With coverage
```

#### Test Coverage

- **Unit Tests**: Components, hooks, and services
- **Integration Tests**: Full search flow and error scenarios
- **Test Framework**: Vitest + React Testing Library

### Production Build

```bash
npm run build
```

Output will be in the `dist/` directory, ready to be served by any static file server.

## Browser Compatibility

### Supported Browsers

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ⚠️ IE11: React 19 does not support IE11. For IE11 support, consider:
  - Downgrading to React 17
  - Adding polyfills for modern JavaScript features
  - Using a transpilation target that supports IE11

## Development Workflow

### Running Both Services

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Testing

**Backend:**
- Manual testing via curl or Postman
- API endpoint: `http://localhost:8080/search/:query`

**Frontend:**
```bash
cd frontend
npm run test
```

## Production Deployment

### Backend

1. Build the TypeScript code:
   ```bash
   cd backend
   npm run build
   ```

2. Set environment variables:
   ```bash
   export PORT=8080
   ```

3. Start the server:
   ```bash
   npm start
   ```

### Frontend

1. Build for production:
   ```bash
   cd frontend
   npm run build
   ```

2. Serve the `dist/` directory with any static file server (nginx, Apache, etc.)

3. Configure environment variable `VITE_API_BASE_URL` to point to your backend URL

### Production Considerations

**Backend:**
- ✅ Error handling middleware
- ✅ CORS configuration
- ✅ Request validation
- ✅ Health check endpoint (`/monitoring`)
- ✅ Logging structure

**Frontend:**
- ✅ Error boundaries for component errors
- ✅ API error handling with user-friendly messages
- ✅ Request timeout handling (5s default)
- ✅ Request cancellation to prevent race conditions
- ✅ Accessibility features (ARIA labels, keyboard navigation)
- ✅ Security: Input sanitization, URL encoding
- ✅ Performance: Debouncing, memoization, request cancellation

## Security

### Backend
- Input validation (minimum 3 characters)
- CORS configuration
- Error handling without exposing internal details

### Frontend
- Input sanitization (query parameters are URL encoded)
- XSS prevention (React escapes content by default)
- No dangerous code patterns (no eval())
- CORS handled by backend configuration

## Performance

### Backend
- Trie-search for fast O(m) prefix/substring matching where m is query length
- Dataset loaded once on startup
- Results limited to 20 matches

### Frontend
- Debouncing (300ms) to limit API calls
- Request cancellation (previous requests cancelled on new searches)
- Memoization of expensive computations
- Efficient rendering (only necessary components re-render)

## Code Quality

- **TypeScript**: Strict mode enabled for both frontend and backend
- **ESLint**: Configured with TypeScript and React rules
- **Code Style**: Consistent formatting and naming conventions
- **Comments**: Complex logic is documented

## Known Limitations

1. **IE11 Support**: React 19 doesn't support IE11 (see Browser Compatibility)
2. **No Offline Support**: Requires active connection to backend API
3. **No Search History**: Previous searches are not persisted
4. **Dataset Size**: Large JSON file loaded into memory (consider database for production scale)

## Future Enhancements

- [ ] Add search history/localStorage persistence
- [ ] Add analytics/monitoring integration
- [ ] Add E2E tests with Playwright/Cypress
- [ ] Move address dataset to database for better scalability
- [ ] Add pagination for large result sets
- [ ] Implement search result caching

## License

ISC

