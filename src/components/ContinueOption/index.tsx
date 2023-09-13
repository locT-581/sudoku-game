/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
import Button from 'UI/Button';
import { decrypt } from 'utils/saveFile';
import React from 'react';
import { Link } from 'react-router-dom';

function ContinueOption() {
  const [rawData, setRawData] = React.useState<string>('');

  const inputRef = React.useRef<HTMLInputElement>(null);
  const handleOpenFile = () => {
    inputRef.current?.click();
  };

  console.log(decrypt(rawData));

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target?.result;
        setRawData(data as string);
        // console.log(typeof data);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="warper">
      <Link to="/">x</Link>
      <Button>
        <p>Last game</p>
      </Button>
      <Button onClick={handleOpenFile}>
        <div>
          <input
            type="file"
            accept=".sdk"
            ref={inputRef}
            className="hidden"
            onChange={handleOnChange}
          />
          <p>Open file</p>
        </div>
      </Button>
    </div>
  );
}

export default ContinueOption;
