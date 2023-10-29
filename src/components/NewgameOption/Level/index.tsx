import Option from 'components/Layouts/Option';
import { Link } from 'react-router-dom';

function Level() {
  return (
    <Option>
      {[
        {
          element: (
            <Link to="/main/EASY" className="link">
              Dễ
            </Link>
          ),
          action: () => {},
        },
        {
          element: (
            <Link to="/main/MEDIUM" className="link">
              Trung bình
            </Link>
          ),
          action: () => {},
        },
        {
          element: (
            <Link to="/main/HARD" className="link">
              Khó
            </Link>
          ),
          action: () => {},
        },
      ]}
    </Option>
  );
}

export default Level;
