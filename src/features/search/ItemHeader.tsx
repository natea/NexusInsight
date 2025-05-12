import React from 'react';

interface ItemHeaderProps {
  label: string;
  qid: string;
  description?: string;
  aliases?: string[];
}

const ItemHeader: React.FC<ItemHeaderProps> = ({
  label,
  qid,
  description,
  aliases,
}) => {
  const handleCopyQid = async () => {
    try {
      await navigator.clipboard.writeText(qid);
      // Optionally, provide feedback to the user that copy was successful
      console.log('QID copied to clipboard');
    } catch (err) {
      console.error('Failed to copy QID: ', err);
      // Optionally, provide feedback about the error
    }
  };

  return (
    <header className="item-header">
      <h1>{label}</h1>
      <div className="qid-section">
        <span>({qid})</span>
        <button onClick={handleCopyQid} aria-label="Copy QID">
          Copy QID
        </button>
      </div>
      {description && <p className="item-description">{description}</p>}
      {aliases && aliases.length > 0 && (
        <div className="aliases-section">
          <strong>Aliases: </strong>
          <span>{aliases.join(', ')}</span>
        </div>
      )}
    </header>
  );
};

export default ItemHeader;