import { useContext } from "react";
import ReaderContext from "../contexts/readerContext.jsx";

const useReader = () => {
  const context = useContext(ReaderContext);
  if (context === undefined) {
    throw new Error("useReader must be used within a ReaderProvider");
  }
  return context;
};

export default useReader;
