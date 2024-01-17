/* eslint-disable jsx-a11y/label-has-associated-control */
import './Input.css';

type FileInputProps = Readonly<{
  'data-test-id'?: string;
  accept?: string;
  label: string;
  onChange: (files: FileList | null) => void;
}>;

function FileInput({
  accept,
  label,
  onChange,
  'data-test-id': dataTestId,
}: FileInputProps) {
  return (
    <div className="Input__wrapper">
      <label className="Input__label">{label}</label>
      <input
        type="file"
        accept={accept}
        onChange={(e) => onChange(e.target.files)}
        data-test-data={dataTestId}
        className="Input__input"
      />
    </div>
  );
}

export default FileInput;
