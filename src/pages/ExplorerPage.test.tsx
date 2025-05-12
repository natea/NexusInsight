import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExplorerPage from './ExplorerPage';
import { describe, it, expect, vi, beforeEach, afterEach, type MockInstance, type MockedFunction } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// Mock react-router-dom's useParams using vi.hoisted to ensure initialization before mock factory
const { mockUseParams } = vi.hoisted(() => {
  return { mockUseParams: vi.fn() };
});
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...(actual as any), // Spread actual exports
    useParams: mockUseParams, // Mock useParams
  };
});

describe('ExplorerPage', () => {
  const defaultMockEntityId = 'Q173897'; // Star Wars
  const defaultMockEntityLabel = 'Star Wars';

  beforeEach(() => {
    userEvent.setup();
    vi.clearAllMocks(); // Clears fetch and mockUseParams calls, etc.
    global.fetch = vi.fn() as MockedFunction<typeof fetch>; // Mock global fetch

    // Add tooltip portal root for Tooltip component
    const portalRoot = document.createElement('div');
    portalRoot.id = 'tooltip-portal-root';
    document.body.appendChild(portalRoot);
  });

  afterEach(() => {
    // vi.restoreAllMocks(); // Not strictly needed if vi.clearAllMocks() and re-mocking fetch in beforeEach
    const portalRoot = document.getElementById('tooltip-portal-root');
    if (portalRoot) {
      document.body.removeChild(portalRoot);
    }
  });

  it('TC_FUNC_001 & TC_FUNC_009: renders initial entity, calls API, and displays basic elements', async () => {
    mockUseParams.mockReturnValue({ entityId: defaultMockEntityId });
    (fetch as MockedFunction<typeof fetch>).mockResolvedValueOnce(
      new Response(JSON.stringify({
        centralEntity: { id: defaultMockEntityId, label: defaultMockEntityLabel, description: 'Sci-fi franchise' },
        nodes: [{ id: defaultMockEntityId, label: defaultMockEntityLabel, isCentral: true }],
        edges: [],
        relationshipGroups: [],
      }), {
        status: 200,
        statusText: 'OK',
        headers: { 'Content-type': 'application/json' },
      })
    );

    render(
      <MemoryRouter initialEntries={[`/explorer/${defaultMockEntityId}`]}>
        <Routes>
          <Route path="/explorer/:entityId" element={<ExplorerPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText(/Interactive Visual Explorer/i, {}, { timeout: 3000 })).toBeInTheDocument();
await waitFor(() => {
  expect(fetch).toHaveBeenCalledWith(
    expect.stringContaining(`/api/entity/${defaultMockEntityId}/connections?depth=1&common_groups=true`)
  );
});
    expect(fetch).toHaveBeenCalledTimes(1);

    // Assuming GraphCanvas renders the central node's label within the "node-list"
    const graphCanvas = await screen.findByLabelText('Interactive graph visualization');
    const nodeList = await within(graphCanvas).findByRole('list', { name: /node-list/i });
    expect(await within(nodeList).findByText(new RegExp(defaultMockEntityLabel, 'i'))).toBeInTheDocument();
    expect(await within(nodeList).findByText(/\(Central\)/i)).toBeInTheDocument();

    // Check for NodeInfoPanel displaying initial entity details
    const nodeInfoPanel = await screen.findByRole('complementary', { name: /node details/i }); // Assuming NodeInfoPanel has role="complementary" and an aria-label or title
    expect(await within(nodeInfoPanel).findByText(`Node Details: ${defaultMockEntityLabel}`)).toBeInTheDocument();
    expect(await within(nodeInfoPanel).findByText((content, element) => {
      // We want to match the <p> element that contains "ID:" and the entity ID.
      // The `element` passed to the matcher can be any node.
      // We should check if the `element` itself is the <p> tag we're looking for.
      if (element?.tagName.toLowerCase() !== 'p') {
        return false;
      }
      const pTextContent = element.textContent || '';
      return pTextContent.includes('ID:') && pTextContent.includes(defaultMockEntityId);
    })).toBeInTheDocument();
  });

  it('TC_NEG_002: gracefully handles API error when fetching initial entity data', async () => {
    mockUseParams.mockReturnValue({ entityId: defaultMockEntityId });
    (fetch as MockedFunction<typeof fetch>).mockRejectedValueOnce(new Error('API Error: Server down'));

    render(
      <MemoryRouter initialEntries={[`/explorer/${defaultMockEntityId}`]}>
        <Routes>
          <Route path="/explorer/:entityId" element={<ExplorerPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Example error message, depends on ExplorerPage's error handling
    expect(await screen.findByText(/failed to load graph data/i, {}, { timeout: 3000 })).toBeInTheDocument();
    expect(screen.queryByText(defaultMockEntityLabel)).not.toBeInTheDocument();
  });

  it('TC_FUNC_003: displays quick info on node hover (implementation dependent)', async () => {
    const nodeToHoverId = 'Q52545';
    const nodeToHoverLabel = 'Luke Skywalker';
    const nodeToHoverDescription = 'fictional character';
    mockUseParams.mockReturnValue({ entityId: defaultMockEntityId });

    (fetch as MockedFunction<typeof fetch>).mockResolvedValueOnce(
      new Response(JSON.stringify({
        centralEntity: { id: defaultMockEntityId, label: defaultMockEntityLabel },
        nodes: [
          { id: defaultMockEntityId, label: defaultMockEntityLabel, isCentral: true },
          { id: nodeToHoverId, label: nodeToHoverLabel, description: nodeToHoverDescription },
        ],
        edges: [{ source: defaultMockEntityId, target: nodeToHoverId, property: { id: 'P1', label: 'connects' } }],
        relationshipGroups: [],
      }), {
        status: 200,
        statusText: 'OK',
        headers: { 'Content-type': 'application/json' },
      })
    );

    render(
      <MemoryRouter initialEntries={[`/explorer/${defaultMockEntityId}`]}>
        <Routes>
          <Route path="/explorer/:entityId" element={<ExplorerPage />} />
        </Routes>
      </MemoryRouter>
    );

    const nodeElement = await screen.findByText(nodeToHoverLabel, {}, { timeout: 3000 });
    await userEvent.hover(nodeElement);

    // Assertion depends heavily on how hover info is implemented (e.g., tooltip, panel update)
    // Check for the tooltip content. The tooltip is rendered in a portal.
    // We need to find it in the document body, not within a specific container.
    const tooltip = await screen.findByRole('tooltip', {}, { timeout: 2000 }); // Increased timeout for portal rendering
    expect(within(tooltip).getByText(nodeToHoverLabel)).toBeInTheDocument();
    expect(within(tooltip).getByText(new RegExp(nodeToHoverDescription, 'i'))).toBeInTheDocument();
    
    await userEvent.unhover(nodeElement);
    // Optional: Assert tooltip disappears
    // await waitFor(() => expect(screen.queryByText(new RegExp(nodeToHoverDescription, 'i'))).not.toBeInTheDocument());
  });

  it('TC_FUNC_004 & TC_FUNC_010: clicking a node refocuses graph and fetches new data (implementation dependent)', async () => {
    const initialEntityId = 'Q1'; // Universe
    const initialEntityLabel = 'Universe';
    const nodeToClickId = 'Q2'; // Earth
    const nodeToClickLabel = 'Earth';
    const connectedToClickedNodeLabel = 'Russia'; // Node connected to Earth

    // Set up useParams for the initial render (Q1)
    mockUseParams.mockReturnValue({ entityId: initialEntityId });

    // Initial load for Q1
    (fetch as MockedFunction<typeof fetch>).mockResolvedValueOnce(
      new Response(JSON.stringify({
        centralEntity: { id: initialEntityId, label: initialEntityLabel },
        nodes: [
          { id: initialEntityId, label: initialEntityLabel, isCentral: true },
          { id: nodeToClickId, label: nodeToClickLabel },
        ],
        edges: [{ source: initialEntityId, target: nodeToClickId, property: {id: 'P_CONTAINS', label: 'contains'} }],
        relationshipGroups: [],
      }), {
        status: 200,
        statusText: 'OK',
        headers: { 'Content-type': 'application/json' },
      })
    );

    // Data for Q2 after click
    (fetch as MockedFunction<typeof fetch>).mockResolvedValueOnce(
      new Response(JSON.stringify({
        centralEntity: { id: nodeToClickId, label: nodeToClickLabel },
        nodes: [
          { id: nodeToClickId, label: nodeToClickLabel, isCentral: true },
          { id: 'Q159', label: connectedToClickedNodeLabel },
        ],
        edges: [{ source: nodeToClickId, target: 'Q159', property: {id: 'P_HAS_COUNTRY', label: 'has country'} }],
        relationshipGroups: [],
      }), {
        status: 200,
        statusText: 'OK',
        headers: { 'Content-type': 'application/json' },
      })
    );
    
    render(
      // The key for MemoryRouter helps force re-renders if the path changes internally
      // For this test, we assume clicking a node in GraphCanvas triggers a navigation
      // or an internal state update in ExplorerPage that leads to a new fetch.
      <MemoryRouter initialEntries={[`/explorer/${initialEntityId}`]} initialIndex={0}>
        <Routes>
          <Route path="/explorer/:entityId" element={<ExplorerPage />} />
        </Routes>
      </MemoryRouter>
    );

    const nodeElement = await screen.findByText(nodeToClickLabel, {}, { timeout: 3000 });
    // Ensure initial API call for Q1 happened
    await waitFor(() => expect(fetch).toHaveBeenCalledWith(expect.stringContaining(`/api/entity/${initialEntityId}/connections`)));
    expect(fetch).toHaveBeenCalledTimes(1); // Ensure it was called once for Q1

    // Simulate click. This assumes GraphCanvas handles click and ExplorerPage reacts.
    // If ExplorerPage itself causes navigation, MemoryRouter will handle it.
    // If GraphCanvas calls a prop (e.g., onNodeSelect(nodeId)), ExplorerPage must handle it.
    // For this test to pass as written, ExplorerPage must update its internal entityId
    // and trigger a new fetch, or navigate which causes useParams to update.
    
    // We also need to update mockUseParams if navigation to a new route is expected to be the trigger
    // This part is complex and depends on ExplorerPage's internal logic for node clicks.
    // Let's assume clicking the node *eventually* leads to ExplorerPage using the new ID.
    // A common pattern is that GraphCanvas calls navigate, changing the URL.
    // Then ExplorerPage re-renders, useParams provides the new ID, and useEffect fetches.
    // To simulate this, the click on nodeElement should trigger navigation.
    // If it doesn't, this test will fail at the second fetch assertion.
    // For now, we'll assume the component handles this transition.

    // After clicking, MemoryRouter and navigate() in ExplorerPage should handle useParams update.
    // Now, set up useParams to return the new ID for the re-render caused by navigation.
    mockUseParams.mockReturnValue({ entityId: nodeToClickId });
    await userEvent.click(nodeElement);


    await waitFor(() => {
      // Now fetch should have been called for Q2 as well
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/entity/${nodeToClickId}/connections?depth=1&common_groups=true`)
      );
    }, { timeout: 3000 });
    // After the click and navigation, fetch should have been called for Q2.
    // The mockImplementation for useParams ensures the new entityId is used.
    // The first call was for Q1, the second for Q2.
    expect(fetch).toHaveBeenCalledTimes(2);

    // Verify new central node and its connections are displayed
    expect(await screen.findByText(nodeToClickLabel, {}, { timeout: 3000 })).toBeInTheDocument(); // Earth
    expect(await screen.findByText(connectedToClickedNodeLabel, {}, { timeout: 3000 })).toBeInTheDocument(); // Russia
  });

  it('TC_FUNC_002: displays node clusters when API provides relationshipGroups', async () => {
    mockUseParams.mockReturnValue({ entityId: defaultMockEntityId });
    const group1Name = 'Planets';
    const group2Name = 'Characters';
    (fetch as MockedFunction<typeof fetch>).mockResolvedValueOnce(
      new Response(JSON.stringify({
        centralEntity: { id: defaultMockEntityId, label: defaultMockEntityLabel, description: 'Sci-fi franchise' },
        nodes: [
          { id: defaultMockEntityId, label: defaultMockEntityLabel, isCentral: true },
          { id: 'Q2', label: 'Tatooine', group_name: group1Name },
          { id: 'Q3', label: 'Hoth', group_name: group1Name },
          { id: 'Q52545', label: 'Luke Skywalker', group_name: group2Name },
        ],
        edges: [
          { source: defaultMockEntityId, target: 'Q2', property: {id: 'P_HAS_PLANET', label: 'has planet'} },
          { source: defaultMockEntityId, target: 'Q3', property: {id: 'P_HAS_PLANET', label: 'has planet'} },
          { source: defaultMockEntityId, target: 'Q52545', property: {id: 'P_HAS_CHARACTER', label: 'has character'} },
        ],
        relationshipGroups: [
          { name: group1Name, count: 2, propertyId: 'P_IS_PLANET_GROUP', propertyLabel: 'Planets Group' },
          { name: group2Name, count: 1, propertyId: 'P_IS_CHARACTER_GROUP', propertyLabel: 'Characters Group' },
        ],
      }), {
        status: 200,
        statusText: 'OK',
        headers: { 'Content-type': 'application/json' },
      })
    );

    render(
      <MemoryRouter initialEntries={[`/explorer/${defaultMockEntityId}`]}>
        <Routes>
          <Route path="/explorer/:entityId" element={<ExplorerPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for initial elements to ensure page is loaded
    const graphCanvasClustered = await screen.findByLabelText('Interactive graph visualization');
    
    // Check for the central node label within the "node-list" (aria-label for "Other Nodes" ul)
    // This list should exist even when relationshipGroups are present, for un-grouped nodes.
    const otherNodesList = await within(graphCanvasClustered).findByRole('list', { name: /node-list/i });
    expect(await within(otherNodesList).findByText(new RegExp(defaultMockEntityLabel, 'i'))).toBeInTheDocument();
    expect(await within(otherNodesList).findByText(/\(Central\)/i)).toBeInTheDocument();

    // Assert that group names are rendered. This depends on how GraphCanvas will display clusters.
    // For now, we'll assume the group names themselves are rendered as text within the relationship group list.
    const relationshipGroupList = await within(graphCanvasClustered).findByRole('list', { name: /relationship-group-list/i });
    // Find the <li> element that is a direct child of relationshipGroupList
    // and whose text content starts with the group name and includes the count like "Group Name (X)"
    const group1Li = await within(relationshipGroupList).findByText((content, element) => {
      const isDirectLiChild = element?.parentElement === relationshipGroupList && element.tagName.toLowerCase() === 'li';
      if (!isDirectLiChild) return false;
      // Match "Group Name" followed by " (count)"
      const expectedPattern = new RegExp(`^${group1Name}\\s*\\(\\d+\\)`, 'i');
      return expectedPattern.test(content.trim());
    });
    expect(group1Li).toBeInTheDocument();

    const group2Li = await within(relationshipGroupList).findByText((content, element) => {
      const isDirectLiChild = element?.parentElement === relationshipGroupList && element.tagName.toLowerCase() === 'li';
      if (!isDirectLiChild) return false;
      const expectedPattern = new RegExp(`^${group2Name}\\s*\\(\\d+\\)`, 'i');
      return expectedPattern.test(content.trim());
    });
    expect(group2Li).toBeInTheDocument();
  });

  // TODO: Implement further tests based on the test plan:
  // - TC_FUNC_005 & TC_FUNC_011: Filter by Relationship Type & API
  // - TC_FUNC_006 & TC_FUNC_011: Filter by Item Type & API
  // - TC_FUNC_007: Breadcrumb Trail/History
  // - TC_FUNC_008: Data Attribution
});