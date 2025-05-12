import React, { useState } from 'react';
// Import types from SearchPage as they are the source of truth for ItemData structure
import { Statement, Qualifier, StatementValue } from '../../pages/SearchPage';

// Helper to render statement values, which could be links or literals
// This can be shared or moved to a utils file if used elsewhere
const renderValue = (value: StatementValue) => {
  if (value.value_is_item && value.value_qid && value.value_label) {
    // In a real app, this could be a link to another item page:
    // return <a href={`/item/${value.value_qid}`}>{value.value_label}</a>;
    return value.value_label; // Simplified for now
  }
  if (value.value_string) {
    return value.value_string;
  }
  if (value.value_time) {
    // Format time appropriately
    return new Date(value.value_time).toLocaleDateString();
  }
  // Add rendering for other types like coordinates, quantities etc.
  return 'N/A';
};

interface StatementsRelationshipsSectionProps {
  title: string;
  statements?: Record<string, Statement[]>; // Aligned with ItemData.statements
  // propertyLabels are implicitly part of Statement objects now (statement.property_label)
}

const StatementsRelationshipsSection: React.FC<StatementsRelationshipsSectionProps> = ({
  title,
  statements,
}) => {
  const [expandedQualifiers, setExpandedQualifiers] = useState<Record<string, boolean>>({});

  const toggleQualifiers = (key: string) => {
    setExpandedQualifiers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!statements || Object.keys(statements).length === 0) {
    return (
      <section aria-labelledby={`${title.replace(/\s+/g, '-').toLowerCase()}-heading`}>
        <h2 id={`${title.replace(/\s+/g, '-').toLowerCase()}-heading`}>{title}</h2>
        <p>No statements available for this section.</p>
      </section>
    );
  }

  return (
    <section aria-labelledby={`${title.replace(/\s+/g, '-').toLowerCase()}-heading`}>
      <h2 id={`${title.replace(/\s+/g, '-').toLowerCase()}-heading`}>{title}</h2>
      {Object.entries(statements).map(([pid, statementGroup]) => {
        // Assuming all statements in a group share the same property_label for the group header
        const propertyLabel = statementGroup[0]?.property_label || `Property ${pid}`;
        const displayLabel = `${propertyLabel} (${pid})`;

        return (
          <div key={pid} className="property-group" role="group" aria-labelledby={`prop-heading-${pid}`}>
            <h3 id={`prop-heading-${pid}`}>{displayLabel}</h3>
            <ul className="statements-list">
              {statementGroup.map((statement, index) => {
                const statementKey = `stmt-${pid}-${statement.value_qid || statement.value_string || statement.value_label || 'val'}-${index}`;
                const hasQualifiers = statement.qualifiers && statement.qualifiers.length > 0;
                const isQualifierListExpanded = !!expandedQualifiers[statementKey];

                return (
                  <li key={statementKey} className="statement-item">
                    <div className="statement-value-container">
                      {renderValue(statement)}
                      {hasQualifiers && (
                        <button
                          onClick={() => toggleQualifiers(statementKey)}
                          aria-expanded={isQualifierListExpanded}
                          aria-controls={`qualifiers-for-${statementKey}`}
                          className="qualifier-toggle-button"
                          type="button"
                        >
                          {isQualifierListExpanded ? 'Hide Qualifiers' : `Show Qualifiers (${statement.qualifiers?.length})`}
                        </button>
                      )}
                    </div>
                    {hasQualifiers && isQualifierListExpanded && (
                      <ul id={`qualifiers-for-${statementKey}`} className="qualifiers-list" role="list">
                        {statement.qualifiers?.map((qualifier: Qualifier, qIndex: number) => (
                          <li key={`qualifier-${statementKey}-${qIndex}`} className="qualifier-item">
                            <span className="qualifier-property">{qualifier.property_label} ({qualifier.property_pid}):</span>
                            <span className="qualifier-value">{renderValue(qualifier)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </section>
  );
};

export default StatementsRelationshipsSection;