import React from 'react';
import s from './Input.module.scss';

const Input = ({value, onChange}) => {
    return <input className={s.styledInput} type="text" value={value} onChange={onChange}/>
}

export default Input;
