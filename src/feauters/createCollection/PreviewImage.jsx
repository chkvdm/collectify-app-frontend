import React from 'react';

const PreviewImage = ({ target: { files } }) => {
  const [preview, setPreview] = React.useState(null);

  if (files && files[0]) {
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      setPreview(reader.result);
    };
  }

  return (
    <div>
      <img src={preview} alt="Preview" width={150} height="auto" />
    </div>
  );
};

export default PreviewImage;
