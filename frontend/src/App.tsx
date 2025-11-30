import ErrorBoundary from './components/ErrorBoundary';
import { AddressAutocomplete } from './components/AddressAutocomplete';
import type { Address } from './types/address';
import './App.css';

function App() {

  const handleAddressSelect = (address: Address) => {
    console.log('Selected address:', address);
  };

  return (
    <ErrorBoundary
      fallback={
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Application Error</h1>
          <p>Please refresh the page to try again.</p>
        </div>
      }
    >
      <div className="app">
        <header className="app__header">
          <h1>Norwegian Address Search</h1>
          <p>Search for street addresses in Norway</p>
        </header>
        <main className="app__main">
          <AddressAutocomplete
            onSelect={handleAddressSelect}
            placeholder="Type at least 3 characters to search..."
          />
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
