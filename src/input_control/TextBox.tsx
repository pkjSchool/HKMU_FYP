import { FC } from 'react';

interface InputBoxProps {
    onChange?:  React.Dispatch<React.SetStateAction<string>>;
    onBlur?: () => void;
    value?: string;
    name?: string;
    ref?: React.Ref<any>
    disabled?: boolean;
}

const TextBox: FC<InputBoxProps> = (props) => {
  return (
    <input 
        value={props.value}
        onChange={(event) => (props.onChange)?props.onChange(event.target.value):null}
        ref={props.ref}
        onBlur={props.onBlur}
        name={props.name}
        disabled={props.disabled}
    />
  );
};

export default TextBox;