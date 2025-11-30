import type { Address } from '../types/address';
import './AddressList.css';

interface AddressListProps {
  addresses: Address[];
  onSelect: (address: Address) => void;
  highlightedIndex: number;
}

/**
 * Component to display a list of address search results
 */
export function AddressList({
  addresses,
  onSelect,
  highlightedIndex,
}: AddressListProps) {
  if (addresses.length === 0) {
    return null;
  }

  return (
    <ul className="address-list" role="listbox" aria-label="Address suggestions">
      {addresses.map((address, index) => (
        <li
          id={`address-option-${index}`}
          key={`${address.street}-${address.postNumber}-${address.city}-${index}`}
          className={`address-list-item ${
            index === highlightedIndex ? 'address-list-item--highlighted' : ''
          }`}
          role="option"
          aria-selected={index === highlightedIndex}
          onClick={() => onSelect(address)}
          onMouseDown={(e) => {
            // Prevent input blur on click
            e.preventDefault();
          }}
        >
          <div className="address-list-item__content">
            <div className="address-list-item__street">{address.street} {address.municipalityNumber}</div>
            <div className="address-list-item__details">
              {address.postNumber} {address.municipality}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

