import axios from "axios";

const BASE_URL = 'https://pixabay.com/api/';

const searchParams = {
    key: '30526563-3a19cb9b5f514848ef7bbd71f',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: 12,
};

async function fetchImages(query, page = 1) {
    try {
        searchParams.q = query;
        searchParams.page = page;
        const { data } = await axios.get(BASE_URL, { params: searchParams, responseType: 'json' });
        return data;
    } catch (error) {
        console.error('Error fetching images from Pixabay API:', error);
        throw error;
    }
}

export { fetchImages };