import React from 'react';

interface StatementValue {
  valueLabel: string;
  valueId: string | null;
  valueLink?: string;
  rank: string; // 'normal', 'preferred', 'deprecated' - though rank isn't explicitly tested for display changes here
  valueType?: string; // e.g., 'time', 'wikibase-item', 'string', etc.
}

interface Statements {
  [propertyId: string]: StatementValue[];
}

interface PropertyLabels {
  [propertyId: string]: string;
}

interface StatementsRelationshipsSectionProps {
  title: string;
  statements?: Statements;
  propertyLabels?: PropertyLabels;
}

const StatementsRelationshipsSection: React.FC<StatementsRelationshipsSectionProps> = ({
  title,
  statements,
  propertyLabels,
}) => {
  if (!statements || Object.keys(statements).length === 0) {
    return (
      <section>
        <h2>{title}</h2>
        <p>No statements available.</p>
      </section>
    );
  }

  return (
    <section>
      <h2>{title}</h2>
      {Object.entries(statements).map(([pid, values]) => {
        const label = propertyLabels && propertyLabels[pid] ? propertyLabels[pid] : pid;
        const displayLabel = propertyLabels && propertyLabels[pid] ? `${label} (${pid})` : pid;
        return (
          <div key={pid} className="property-group">
            <h3>{displayLabel}</h3>
            <ul>
              {values.map((val, index) => (
                <li key={`${pid}-${val.valueId || index}-${val.valueLabel}`}>
                  {val.valueLink ? (
                    <a href={val.valueLink}>{val.valueLabel}</a>
                  ) : (
                    <span>{val.valueLabel}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </section>
  );
};

export default StatementsRelationshipsSection;