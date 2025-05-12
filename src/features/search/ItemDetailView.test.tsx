import { render, screen } from '@testing-library/react';
import ItemDetailView from './ItemDetailView';
import { ItemData } from '../../pages/SearchPage'; // Corrected import path for ItemData
import { describe, it, expect, vi } from 'vitest';
import StatementsRelationshipsSection from './StatementsRelationshipsSection'; // Import for mocking

// Mock the child components to isolate ItemDetailView logic
vi.mock('./ItemHeader', () => ({
  default: ({ label, qid }: { label: string; qid: string }) => (
    <div>
      <h1>{label}</h1>
      <span>{qid}</span>
    </div>
  ),
}));

vi.mock('./ItemImageDisplay', () => ({
  default: ({ imageUrl, altText }: { imageUrl?: string; altText?: string }) =>
    imageUrl ? <img src={imageUrl} alt={altText || 'Item image'} /> : null,
}));

vi.mock('./KeyInformationBox', () => ({
  default: ({ facts }: { facts: any[] }) => (
    <div>Key Facts: {facts.length}</div>
  ),
}));

vi.mock('./DescriptionsSection', () => ({
  default: ({ description, aliases }: { description?: string; aliases?: string[] }) => (
    <div>
      <p>{description}</p>
      {aliases && aliases.length > 0 && <p>Aliases: {aliases.join(', ')}</p>}
    </div>
  ),
}));

vi.mock('./StatementsRelationshipsSection', () => ({
  default: vi.fn(({ statements, title }: { statements: any, title: string }) => (
    <div data-testid="mocked-statements-section">
      <h3>{title}</h3>
      <span>Statements Prop Count: {Object.keys(statements || {}).length}</span>
    </div>
  )),
}));

vi.mock('./MetadataLinksSection', () => ({
  default: ({ wikidataUrl }: { wikidataUrl?: string }) =>
    wikidataUrl ? <a href={wikidataUrl}>Wikidata Link</a> : null,
}));


const mockItemWithSingleQualifier: ItemData = {
  qid: 'Q123',
  label: 'Test Item with Single Qualifier',
  description: 'An item used for testing single qualifier display.',
  aliases: ['TISQ'],
  language_info: { label_lang: 'en', description_lang: 'en' },
  image_info: { url: 'http://example.com/image.jpg', alt_text_default: 'Test Image' },
  wikidata_url: 'https://www.wikidata.org/wiki/Q123',
  key_facts: [
    { property_pid: 'P31', property_label: 'instance of', value_qid: 'Q5', value_label: 'human', value_is_item: true },
  ],
  statements: {
    P1: [
      {
        property_pid: 'P1',
        property_label: 'Has Award',
        value_qid: 'Q100',
        value_label: 'Major Award',
        value_is_item: true,
        qualifiers: [
          {
            property_pid: 'P585',
            property_label: 'Point in Time',
            value_string: '2023',
            value_is_item: false,
          },
        ],
      },
    ],
  },
};

const mockItemWithMultipleQualifiers: ItemData = {
  qid: 'Q456',
  label: 'Test Item with Multiple Qualifiers',
  description: 'An item used for testing multiple qualifier display.',
  aliases: ['TIMQ'],
  language_info: { label_lang: 'en', description_lang: 'en' },
  image_info: undefined,
  wikidata_url: 'https://www.wikidata.org/wiki/Q456',
  key_facts: [],
  statements: {
    P2: [
      {
        property_pid: 'P2',
        property_label: 'Member of',
        value_qid: 'Q200',
        value_label: 'Cool Club',
        value_is_item: true,
        qualifiers: [
          {
            property_pid: 'P580',
            property_label: 'Start Time',
            value_string: '2020-01-01',
            value_is_item: false,
          },
          {
            property_pid: 'P582',
            property_label: 'End Time',
            value_string: '2022-12-31',
            value_is_item: false,
          },
        ],
      },
    ],
    P3: [ // Statement without qualifiers
      {
        property_pid: 'P3',
        property_label: 'Occupation',
        value_qid: 'Q300',
        value_label: 'Tester',
        value_is_item: true,
        qualifiers: [],
      }
    ]
  },
};


describe('ItemDetailView', () => {
  it('renders a loading message when isLoading is true', () => {
    render(<ItemDetailView itemId="test-id" itemData={null} isLoading={true} />);
    const loadingMessage = screen.getByText(/loading item details.../i);
    expect(loadingMessage).toBeInTheDocument();
  });

  it('renders a message when no itemData is provided and not loading', () => {
    render(<ItemDetailView itemId="test-id" itemData={null} isLoading={false} />);
    const selectMessage = screen.getByText(/No item selected or data available./i);
    expect(selectMessage).toBeInTheDocument();
  });

  // Add more tests here for functionality like:
  // - Handling error states

  it('renders item details and passes statements with a single qualifier to StatementsRelationshipsSection', () => {
    // StatementsRelationshipsSection is now consistently mocked.
    // We will check if it was called with the correct props.
    const MockedStatementsSection = vi.mocked(StatementsRelationshipsSection);
    MockedStatementsSection.mockClear(); // Clear any previous calls

    render(<ItemDetailView itemId="Q123" itemData={mockItemWithSingleQualifier} isLoading={false} />);

    expect(screen.getByText('Test Item with Single Qualifier')).toBeInTheDocument();
    expect(screen.getByText('An item used for testing single qualifier display.')).toBeInTheDocument();
    
    // Verify StatementsRelationshipsSection was rendered and received the correct statements
    expect(MockedStatementsSection).toHaveBeenCalledTimes(1);
    expect(MockedStatementsSection).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "All Statements",
        statements: mockItemWithSingleQualifier.statements,
      }),
      undefined // Context/ref for React functional components is often undefined if not used
    );

    // Check that our mock's output is visible (optional, but good for sanity)
    expect(screen.getByTestId('mocked-statements-section')).toBeInTheDocument();
    expect(screen.getByText('All Statements')).toBeInTheDocument();
    expect(screen.getByText('Statements Prop Count: 1')).toBeInTheDocument();
  });

  it('renders item details and passes statements with multiple qualifiers to StatementsRelationshipsSection', () => {
    const MockedStatementsSection = vi.mocked(StatementsRelationshipsSection);
    MockedStatementsSection.mockClear();

    render(<ItemDetailView itemId="Q456" itemData={mockItemWithMultipleQualifiers} isLoading={false} />);
    
    expect(screen.getByText('Test Item with Multiple Qualifiers')).toBeInTheDocument();
    expect(screen.getByText('An item used for testing multiple qualifier display.')).toBeInTheDocument();

    // Verify StatementsRelationshipsSection was rendered and received the correct statements
    expect(MockedStatementsSection).toHaveBeenCalledTimes(1);
    expect(MockedStatementsSection).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "All Statements",
        statements: mockItemWithMultipleQualifiers.statements,
      }),
      undefined
    );
    
    expect(screen.getByTestId('mocked-statements-section')).toBeInTheDocument();
    expect(screen.getByText('All Statements')).toBeInTheDocument();
    expect(screen.getByText('Statements Prop Count: 2')).toBeInTheDocument();
  });

  it('passes empty statements object to StatementsRelationshipsSection if itemData.statements is empty', () => {
    const MockedStatementsSection = vi.mocked(StatementsRelationshipsSection);
    MockedStatementsSection.mockClear();

    const itemWithoutStatements: ItemData = {
      ...mockItemWithSingleQualifier,
      qid: 'Q789', // Ensure unique QID for this test case
      statements: {}, // Empty statements
    };
    render(<ItemDetailView itemId="Q789" itemData={itemWithoutStatements} isLoading={false} />);
    expect(MockedStatementsSection).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "All Statements",
        statements: {},
      }),
      undefined
    );
    expect(screen.getByText('Statements Prop Count: 0')).toBeInTheDocument();
  });

  it('passes undefined statements to StatementsRelationshipsSection if itemData.statements is undefined', () => {
    const MockedStatementsSection = vi.mocked(StatementsRelationshipsSection);
    MockedStatementsSection.mockClear();

    const itemWithUndefinedStatements: ItemData = {
      ...mockItemWithSingleQualifier,
      qid: 'Q790', // Ensure unique QID for this test case
      statements: undefined, // Undefined statements
    };
    render(<ItemDetailView itemId="Q790" itemData={itemWithUndefinedStatements} isLoading={false} />);
    expect(MockedStatementsSection).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "All Statements",
        statements: undefined,
      }),
      undefined
    );
    expect(screen.getByText('Statements Prop Count: 0')).toBeInTheDocument();
  });
});