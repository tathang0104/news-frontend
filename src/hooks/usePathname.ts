import { useLocation } from "react-router-dom";

const usePathname = () => {
  const pathname = useLocation().pathname;
  return pathname;
};

export default usePathname;
