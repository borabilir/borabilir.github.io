import ReactDOM from "react-dom";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  container?: Element | null;
};

const Portal: React.FC<Props> = ({ children, container }) => {
  return container ? ReactDOM.createPortal(children, container) : null;
};
export default Portal;