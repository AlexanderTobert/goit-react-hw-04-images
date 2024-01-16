import React, { useState, useEffect } from 'react';
import { fetchImages } from '../services/api';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import { Loader } from './Loader/Loader';
import Notiflix from 'notiflix';
import css from './App.module.css';

export const Status = {
  idle: 'idle',
  pending: 'pending',
  success: 'success',
  error: 'error',
  notfound: 'notfound',
};

const App = () => {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [images, setImages] = useState(null);
  const [status, setStatus] = useState(Status.idle);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = newQuery => {
    setQuery(newQuery);
    setPage(1);
    setTotal(0);
    setImages([]);
    setStatus(Status.pending);
    setLoading(true);
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
    setStatus(Status.pending);
    setLoading(true);
  };

  const resetState = newStatus => {
    setPage(1);
    setTotal(0);
    setImages(null);
    setStatus(newStatus);
    setLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (query === '') {
        resetState(Status.idle);
        return;
      }

      if (total === 0) {
        try {
          const apiResponse = await fetchImages(query);
          if (apiResponse.total === 0) {
            Notiflix.Notify.warning("Sorry, we didn't find any pictures");
            resetState(Status.notfound);
          } else {
            setTotal(apiResponse.total);
            setImages(
              apiResponse.hits.map(image => ({
                id: image.id,
                webformatURL: image.webformatURL,
                largeImageURL: image.largeImageURL,
              }))
            );
            setStatus(Status.success);
            setLoading(false);
          }
        } catch (error) {
          resetState(Status.error);
          Notiflix.Notify.error('Sorry, something went wrong.');
        }
        return;
      }

      if (page > 1) {
        try {
          const apiResponse = await fetchImages(query, page);
          const newImages = apiResponse.hits.map(image => ({
            id: image.id,
            webformatURL: image.webformatURL,
            largeImageURL: image.largeImageURL,
          }));
          setImages(prevImages => [...prevImages, ...newImages]);
          setStatus(Status.success);
          setLoading(false);
        } catch (error) {
          resetState(Status.error);
          Notiflix.Notify.error('Sorry, something went wrong.');
        }
      }
    };

    fetchData();
  }, [query, page, total]);

  const isButtonVisible = total > images?.length;

  return (
    <>
      <Searchbar onSubmit={handleSubmit} />
      <section className={css.Section}>
        {status === Status.error && (
          <p style={{ color: 'tomato' }}>
            Sorry, something went wrong. Please try again.
          </p>
        )}
        {status === Status.idle && (
          <p>Please, write query in search field and hit Enter</p>
        )}
        {status === Status.notfound && (
          <p>Sorry, we didn't find any pictures for your query</p>
        )}

        {loading && (
          <div className={css.loaderOverlay}>
            <Loader />
          </div>
        )}

        {status === Status.success && (
          <ImageGallery images={images} status={status} />
        )}
      </section>
      <section className={css.Section}>
        {isButtonVisible && <Button onClick={handleLoadMore}>Load More</Button>}
      </section>
    </>
  );
};

export default App;