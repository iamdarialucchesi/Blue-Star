function Button({children, type}) {
    const style = {
        defaultStyleBtn: 'btn add-button detail-text px-3 py-1',
        filterOrder: 'btn border-0 p-0',
        primaryBtn: 'btn btn-primary px-3 detail-text d-flex align-items-center gap-2 rounded-3',
    }
    return (
        <button className={style[type]}>{children}</button>
    )
}

export default Button;