import React, {Component } from "react";
import { fetchImages } from '../services/api';
import { Searchbar } from "./Searchbar/Searchbar";
import { ImageGallery } from "./ImageGallery/ImageGallery";
import Button from "./Button/Button"
import { Loader } from "./Loader/Loader";

import Notiflix from 'notiflix';
import css from "./App.module.css"


export const Status = {
    idle: 'idle',
    pending: 'pending',
    success: 'success',
    error: 'error',
    notfound: 'notfound'
}
export default class App extends Component {
  
  state = {
    page: 1,
    query: '',
    images: null,
    status: Status.idle,
    total: 0,
    largeImageURL: '',
    loading: false
  }

  handleSubmit = query => {
    this.setState({
      query,
      page: 1,
      total: 0,
      images: [],
      status: Status.pending,
      loading: true
    });
  };

  handleLoadMore = () => {
    this.setState(prev => ({
      page: prev.page + 1,
      status: Status.pending,
      loading: true
    }));
  };

  resetState = newStatus =>
    this.setState({
      page: 1,
      total: 0,
      images: null,
      status: newStatus,
      loading: false
    });
  
  async componentDidUpdate(_, prevState) {
    const { page: newPage, query: newQuery, total } = this.state;
    if (
      newQuery === prevState.query &&
      newPage === prevState.page &&
      total === prevState.total
    ) {
      return;
    }
    if (newQuery === '') {
      this.resetState(Status.idle);
      return;
    }

    if (total === 0) {
      try {
        const apiResponse = await fetchImages(newQuery);
        if (apiResponse.total === 0) {
          Notiflix.Notify.warning("Sorry, we didn't find any pictures");
          this.resetState(Status.notfound);
        } else {
          this.setState({
            total: apiResponse.total,
            images: apiResponse.hits.map(image => ({
              id: image.id,
              webformatURL: image.webformatURL,
              largeImageURL: image.largeImageURL,
            })),
            status: Status.success,
            loading: false
          });
        }
      } catch (error) {
        this.resetState(Status.error);
        Notiflix.Notify.error('Sorry, something went wrong.');

      }
      return;
    }
    if (newPage > prevState.page) {
      try {
        const apiResponse = await fetchImages(newQuery, newPage);
        const newImages = apiResponse.hits.map(image => ({
          id: image.id,
          webformatURL: image.webformatURL,
          largeImageURL: image.largeImageURL,
        }));
        this.setState(prevState => ({
          images: [...prevState.images, ...newImages],
          status: Status.success,
          loading: false
        }));
      } catch (error) {
        this.resetState(Status.error);
        Notiflix.Notify.error('Sorry, something went wrong.');
      }
    }
  }

  render() {
    const { status, total, images, loading } = this.state;
    const isButtonVisible = total > images?.length;
    return (
      <>
        <Searchbar onSubmit={this.handleSubmit} />
        <section className={css.Section}>
          {status === Status.error && (
            <p style={{ color: 'tomato' }}>
              Sorry, something went wrong. Please try again.
            </p>
          )}
          {status === Status.idle && (
            <p>Please, write query in search fild and hit Enter</p>
          )}
          {status === Status.notfound && (
            <p>Sorry, we didn't find any pictures for your query</p>
          )}
          
          {loading && (
            <div className={css.loaderOverlay}>
              <Loader />
            </div>
          )}

          {
            status === Status.success && <ImageGallery images={this.state.images} status={this.state.status} />
          }
        </section>
        <section className={css.Section}>
          {isButtonVisible && (<Button onClick={this.handleLoadMore}>Load More</Button>)}
        </section>
      </>
    );
  }
};