# Norwegian Address Autocomplete Frontend

A production-ready React TypeScript single-page application providing real-time address autocomplete search functionality for Norwegian street addresses.

## Features

- **Real-time Search**: Autocomplete updates as users type (with debouncing)
- **Keyboard Navigation**: Full keyboard support (arrow keys, Enter, Escape)
- **Accessibility**: ARIA labels, roles, and keyboard navigation support
- **Error Handling**: Comprehensive error boundaries and API error handling
- **Performance**: Request cancellation, debouncing, and optimized rendering
- **Production Ready**: Testing, logging structure, and error monitoring hooks

## Requirements

- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:8080` (configurable)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure API base URL (optional):
   - Create a `.env` file in the root directory
   - Add: `VITE_API_BASE_URL=http://localhost:8080`
   - Defaults to `http://localhost:8080` if not set

3. Start development server:
```bash
npm run dev
```

4. Open `http://localhost:5173` in your browser

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run test` - Run tests with Vitest
- `npm run lint` - Run ESLint

## Architecture

### Project Structure

```
src/
├── components/           # React components
│   ├── AddressAutocomplete.tsx  # Main search component
│   ├── AddressList.tsx          # Results display component
│   └── ErrorBoundary.tsx        # Error boundary component
├── hooks/               # Custom React hooks
│   ├── useDebounce.ts           # Debounce hook
│   ├── useAddressSearch.ts      # Search state management
│   └── useClickOutside.ts       # Click outside detection
├── services/            # API and business logic
│   └── addressApi.ts            # Address search API client
├── types/               # TypeScript type definitions
│   └── address.ts               # Address interface
└── __tests__/           # Test files
    ├── components/              # Component tests
    ├── hooks/                   # Hook tests
    ├── services/                # Service tests
    └── integration/             # Integration tests
```

### Component Architecture

- **AddressAutocomplete**: Main component managing search input, results display, and user interactions
- **AddressList**: Presentational component displaying search results
- **ErrorBoundary**: Catches and handles React component errors

### API Integration

The frontend communicates with the backend API at `/search/:query` endpoint:
- **Method**: GET
- **Query Encoding**: Special characters (ø, å, æ) are URL encoded
- **Minimum Query Length**: 3 characters (enforced by backend)
- **Response**: Array of Address objects

### State Management

Uses React hooks for state management:
- `useState` for local component state
- `useAddressSearch` hook for search logic and API calls
- `useDebounce` to limit API requests (300ms delay)
- `useClickOutside` for dropdown UX

## Testing

### Test Coverage

- **Unit Tests**: Components, hooks, and services
- **Integration Tests**: Full search flow and error scenarios
- **Test Framework**: Vitest + React Testing Library

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with coverage
npm run test -- --coverage
```

### Test Files

- `__tests__/services/addressApi.test.ts` - API service tests
- `__tests__/hooks/useDebounce.test.ts` - Debounce hook tests
- `__tests__/components/AddressAutocomplete.test.tsx` - Main component tests
- `__tests__/components/AddressList.test.tsx` - Results list tests
- `__tests__/integration/searchFlow.test.tsx` - Integration tests

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

The code includes IE11-compatible patterns where possible (e.g., flexbox fallbacks), but full IE11 support would require additional configuration.

## Production Deployment

### Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL (default: `http://localhost:8080`)

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory, ready to be served by any static file server.

### Production Considerations

- ✅ Error handling and logging structure in place
- ✅ Error boundary for component errors
- ✅ API error handling with user-friendly messages
- ✅ Request timeout handling (5s default)
- ✅ Request cancellation to prevent race conditions
- ✅ Accessibility features (ARIA labels, keyboard navigation)
- ✅ Security: Input sanitization, URL encoding, no eval()
- ✅ Performance: Debouncing, memoization, request cancellation

### Monitoring

The codebase includes error logging hooks ready for integration with monitoring services:
- Error boundary logs errors to console (replace with your monitoring service)
- API errors are caught and logged
- Network failures are handled gracefully

## Security

- **Input Sanitization**: Query parameters are URL encoded
- **XSS Prevention**: React escapes content by default
- **No eval()**: No dangerous code patterns used
- **CORS**: Handled by backend configuration

## Performance Optimizations

- **Debouncing**: 300ms delay to limit API calls
- **Request Cancellation**: Previous requests are cancelled on new searches
- **Memoization**: Expensive computations are memoized
- **Efficient Rendering**: Only necessary components re-render

## Code Quality

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured with React and TypeScript rules
- **Code Style**: Consistent formatting and naming conventions
- **Comments**: Complex logic is documented

## Known Limitations

1. **IE11 Support**: React 19 doesn't support IE11. See Browser Compatibility section.
2. **No Offline Support**: Requires active connection to backend API
3. **No Search History**: Previous searches are not persisted

## Future Enhancements

- [ ] Add search history/localStorage persistence
- [ ] Implement address selection confirmation
- [ ] Add loading skeleton animations
- [ ] Implement request retry logic with exponential backoff
- [ ] Add analytics/monitoring integration
- [ ] Add unit tests for ErrorBoundary component
- [ ] Add E2E tests with Playwright/Cypress

## License

ISC
