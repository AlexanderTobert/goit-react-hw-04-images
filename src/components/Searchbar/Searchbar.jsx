import css from "./Searchbar.module.css"

const Searchbar = ({ onSubmit }) => {
    const handleSubmit = event => {
        event.preventDefault();
        const query = event.currentTarget.elements.searchInput.value.trim();
        onSubmit(query);
    };

    return (
        <header className={css.Searchbar}>
            <form className={ css.SearchForm } onSubmit={handleSubmit}>
                <button className={ css.button } type="submit">
                </button>

                <input
                    className={css.input}
                    type="text"
                    name="searchInput"
                    placeholder="Search images and photos"
                />
            </form>
        </header>
    );
};

export { Searchbar }