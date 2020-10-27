import * as React from "react";
import useKeyboardShortcut from "../hooks/useKeyboardShortcut";

const SvgArea: React.FC = (): JSX.Element => {
  const [texts, setTexts] = React.useState<string[]>([]);

  const keyboardShortcut = useKeyboardShortcut();

  React.useEffect(() => {
    setTexts((prevTexts) => {
      return prevTexts.concat(keyboardShortcut)
    });
  }, [keyboardShortcut])

  return (
    <>
      {
        texts.map((text, index) => (
          <div key={index} style={{ padding: "5px" }}>
            {text}
          </div>
        ))
      }
    </>
  );
};

export default SvgArea;
