import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import css from './ImageGalleryItem.module.css';

const ImageGalleryItem = ({ image }) => {
  const [shownModal, setShownModal] = useState(false);

  const onModal = () => {
   setShownModal((prevShownModal) => !prevShownModal);
  };

  return (
    <li className={css.ImageGalleryItem}>
      <img
        onClick={onModal}
        className={css.ImageGalleryItemImage}
        src={image.webformatURL}
        data-image={image.largeImageURL}
        alt=""
      />
      {shownModal && <Modal onClose={onModal} image={image} />}
    </li>
  );
};

export default ImageGalleryItem;