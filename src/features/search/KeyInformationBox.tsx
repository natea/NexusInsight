import React from 'react';

interface KeyFact {
  propertyLabel: string;
  propertyId: string;
  valueLabel: string;
  valueId: string | null;
  valueLink?: string;
}

interface KeyInformationBoxProps {
  title: string;
  facts?: KeyFact[];
}

const KeyInformationBox: React.FC<KeyInformationBoxProps> = ({ title, facts }) => {
  if (!facts || facts.length === 0) {
    return (
      <section>
        <h2>{title}</h2>
        <p>No key information available.</p>
      </section>
    );
  }

  return (
    <section>
      <h2>{title}</h2>
      <ul>
        {facts.map((fact) => (
          <li key={fact.propertyId}>
            <strong>{fact.propertyLabel}:</strong>{' '}
            {fact.valueLink ? (
              <a href={fact.valueLink}>{fact.valueLabel}</a>
            ) : (
              <span>{fact.valueLabel}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default KeyInformationBox;