import React from 'react';
import SvgArea from "./components/SvgArea";
import styled from "styled-components";

function App() {

  return (
    <Wrapper>
      <SvgArea />
    </Wrapper>
  );
}

export default App;

const Wrapper = styled.div`
  border: 1px solid greenyellow;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  color: red;
`;
