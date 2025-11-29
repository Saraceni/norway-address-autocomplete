import TrieSearch from 'trie-search';
import * as fs from 'fs';
import * as path from 'path';
import { Address } from '../types/address';

export class AddressSearchService {
    private trie: TrieSearch<Address>;
    private addresses: Address[] = [];

    constructor() {
        this.trie = new TrieSearch<Address>(['addressFormatted'], {
            ignoreCase: true,
            splitOnRegEx: false,
            min: 3,
        });

        this.loadAddresses();
    }

    private loadAddresses(): void {
        try {
            const filePath = path.join(__dirname, '../../adresses.json');
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            this.addresses = JSON.parse(fileContent) as Address[];

            // I need to add the full searchable address string to the addresses array
            // In Norway the address format is: Street Municipality Number, Post Number municipality
            this.addresses = this.addresses.map(address => ({
                ...address,
                addressFormatted: `${address.street} ${address.municipalityNumber} ${address.postNumber} ${address.municipality}`
            }));

            // Add all addresses to the trie
            this.trie.addAll(this.addresses);
        } catch (error) {
            console.error('Error loading addresses:', error);
            throw new Error('Failed to load address dataset');
        }
    }

    public search(query: string): Address[] {

        const queryLower = query.toLowerCase().trim();
        // I need to remove , and . from the query
        const queryWithoutCommasAndDots = queryLower.replace(/,/g, '').replace(/\./g, '');

        const results = this.trie.search(queryWithoutCommasAndDots);

        // Remove trie-search internal fields and limit to 20 results
        return results.slice(0, 20).map((address) => {
            const cleanAddress: Address = {
                postNumber: address.postNumber,
                city: address.city,
                street: address.street,
                typeCode: address.typeCode,
                type: address.type,
                district: address.district,
                municipalityNumber: address.municipalityNumber,
                municipality: address.municipality,
                county: address.county
            };
            return cleanAddress;
        });
    }
}

