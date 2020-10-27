import * as React from "react";
import useKeyboardShortcut from "../hooks/useKeyboardShortcut/useKeyboardShortcut";
import styled from "styled-components";

const SvgArea: React.FC = (): JSX.Element => {
  const keyboardShortcut = useKeyboardShortcut();

  return (
    <Svg>
      <SvgText x={30} y={60}>
        {keyboardShortcut}
      </SvgText>
    </Svg>
  )
};

export default SvgArea;

const Svg = styled.svg.attrs({
  version: "1.1",
  xmlns: "http://www.w3.org/2000/svg",
  xmlnsXlink:" 'http://www.w3.org/1999/xlink'"
})`
  background-color: crimson;
  font-size: 30px;
  height: 100px;
  width: 300px;
`;

const SvgText = styled.text`
  fill: aliceblue;
  padding: 5px;
`;
