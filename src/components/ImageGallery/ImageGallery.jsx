
import { Status } from "../App";

import ImageGalleryItem from "components/ImageGalleryItem/ImageGalleryItem";
import css from "./ImageGallery.module.css"

export const ImageGallery = ({ images, status, onClick }) => {
    return (
        <ul className={css.ImageGallery} id="gallery" onClick={onClick}>
            {(status === Status.success) && images?.map(image => (
                <ImageGalleryItem key={image.id} image={image} />
            ))}
        </ul>
    );
};