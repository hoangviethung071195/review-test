import { TextField } from '@mui/material';
import { ChangeEventHandler, InputHTMLAttributes } from 'react';

export function Input(props: {
  type?: InputHTMLAttributes<unknown>['type'];
  required?: boolean;
  error?: boolean;
  label?: string;
  submitted?: boolean;
  value: unknown;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}) {
  const { type = 'text', required = false, error, label, value, submitted = true, onChange } = props;

  const isAnyError = (error || error === false) ? error : !value && submitted;
  return (
    <TextField
      type={type}
      required={required}
      error={required ? isAnyError : false}
      label={label}
      value={value}
      onChange={onChange}
      fullWidth
      variant="standard"
    />
  );
}
