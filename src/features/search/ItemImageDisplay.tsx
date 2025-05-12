import React from 'react';

interface ItemImageDisplayProps {
  imageUrl?: string;
  altText: string;
  attribution?: string;
}

const ItemImageDisplay: React.FC<ItemImageDisplayProps> = ({
  imageUrl,
  altText,
  attribution,
}) => {
  if (!imageUrl) {
    return <div>No image available</div>;
  }

  return (
    <figure>
      <img src={imageUrl} alt={altText} />
      {attribution && <figcaption>{attribution}</figcaption>}
    </figure>
  );
};

export default ItemImageDisplay;