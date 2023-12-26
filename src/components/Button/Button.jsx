import css from "./Button.module.css"

const Button = ({ onClick, children }) => {
    return (
        <button className={css.Button} type="button" onClick={onClick}>
            {children}
        </button>
    );
};

export default Button;