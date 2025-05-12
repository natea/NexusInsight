import React from 'react';

interface MetadataLinksSectionProps {
  qid?: string;
  title: string;
}

const MetadataLinksSection: React.FC<MetadataLinksSectionProps> = ({ qid, title }) => {
  const wikidataBaseUrl = 'https://www.wikidata.org/wiki/';

  const handleCopyQid = async () => {
    if (qid) {
      try {
        await navigator.clipboard.writeText(qid);
        console.log('QID copied to clipboard');
      } catch (err) {
        console.error('Failed to copy QID: ', err);
      }
    }
  };

  return (
    <section>
      <h2>{title}</h2>
      {qid ? (
        <>
          <p>
            Item QID: {qid}
            <button onClick={handleCopyQid} aria-label="Copy QID" style={{ marginLeft: '8px' }}>
              Copy QID
            </button>
          </p>
          <p>
            <a href={`${wikidataBaseUrl}${qid}`} target="_blank" rel="noopener noreferrer">
              View on wikidata.org
            </a>
          </p>
        </>
      ) : (
        <p>QID not available</p> // Or render nothing, or a more specific message
      )}
    </section>
  );
};

export default MetadataLinksSection;