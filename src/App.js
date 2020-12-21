// import { Component } from 'react';
import { useState, useEffect } from 'react';
import s from './App.module.css';
import SearchBar from './SearchBar/SearchBar';
import ImageGallery from './components/ImageGallery/ImageGallery';
import pixabayApi from './services/pixabay-api';
import Button from './components/Button/Button';
import Modal from './components/Modal/Modal';
import Loader from './components/Loader/Loader';

export default function App() {
  const [gallery, setGallery] = useState([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(8);

  useEffect(() => {
    if (searchQuery) {
      fetchGallery();
    }
  }, [searchQuery, quantity]);

  useEffect(() => {
    scrollToNextPage();
  });

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const fetchGallery = () => {
    setIsLoading(isLoading => !isLoading);

    pixabayApi
      .fetchGallery(searchQuery, page, quantity)
      .then(images => {
        setGallery(gallery => [...gallery, ...images]);
        setPage(page => page + 1);
      })
      .finally(() => setIsLoading(isLoading => !isLoading));
  };

  const handleOpenModal = e => {
    const url = e.target.dataset.url;

    toggleModal();
    setModalImageUrl(url);
  };

  const onChangeQuery = query => {
    setSearchQuery(query);
    setGallery([]);
    setPage(1);
  };

  const onChangeQuantity = value => setQuantity(value);

  const scrollToNextPage = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <SearchBar
        onSubmitForm={onChangeQuery}
        onChangeQuantity={onChangeQuantity}
      />
      <main>
        <ImageGallery galleryPhotos={gallery} onOpenModal={handleOpenModal} />
        <Loader isLoading={isLoading} />

        {gallery.length > 0 && !isLoading && (
          <Button onLoadMore={fetchGallery} />
        )}

        {showModal && (
          <Modal imageUrl={modalImageUrl} onCloseModal={toggleModal} />
        )}
      </main>
    </>
  );
}