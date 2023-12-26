import { Component } from 'react';
import Modal from "../Modal/Modal";
import css from "./ImageGalleryItem.module.css"

class ImageGalleryItem extends Component {
    state = {
        shownModal: false,
    };

    onModal = () => {
        this.setState(({ shownModal }) => ({ shownModal: !shownModal }));
    };
    render() {
        const { image } = this.props;

        return (
            <li className={css.ImageGalleryItem}>
                <img
                    onClick={this.onModal}
                    className={css.ImageGalleryItemImage}
                    src={image.webformatURL}
                    data-image={image.largeImageURL}
                    alt=""
                />
                {this.state.shownModal && <Modal onClose={this.onModal} image={image} />}
            </li>
        );
    }
}

export default ImageGalleryItem;