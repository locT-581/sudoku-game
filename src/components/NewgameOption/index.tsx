import { Link } from 'react-router-dom';
import Option from 'components/Layouts/Option';

function NewGameOption() {
  return (
    <Option>
      {[
        {
          element: (
            <Link to="/main-level" className="link">
              Tự động
            </Link>
          ),
          action: () => {},
        },
        {
          element: (
            <Link to="/newgame-option/input-type" className="link">
              Nhập ô số
            </Link>
          ),
          action: () => {},
        },
      ]}
    </Option>
  );
}

export default NewGameOption;
