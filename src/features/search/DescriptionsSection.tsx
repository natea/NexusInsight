import React from 'react';

interface Description {
  lang: string;
  value: string;
}

interface DescriptionsSectionProps {
  title: string;
  descriptions?: Description[];
}

const DescriptionsSection: React.FC<DescriptionsSectionProps> = ({
  title,
  descriptions,
}) => {
  if (!descriptions || descriptions.length === 0) {
    return (
      <section>
        <h2>{title}</h2>
        <p>No descriptions available.</p>
      </section>
    );
  }

  return (
    <section>
      <h2>{title}</h2>
      <ul>
        {descriptions.map((desc) => (
          <li key={desc.lang}>
            <strong>{desc.lang.toUpperCase()}:</strong> {desc.value}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default DescriptionsSection;