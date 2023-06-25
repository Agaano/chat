import style from './Header.module.css'

export default () => {
    return (
        <>
            <div className = {style.header__wrapper}>
                <div className = {style.input_name_wrapper}>
                    <button className = {style.input_name_button}>{'Press this button'}</button>
                </div>
            </div>
        </>
    )
}