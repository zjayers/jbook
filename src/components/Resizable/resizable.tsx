/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { ResizableBox, ResizableBoxProps } from 'react-resizable';
import './resizable.styles.css';
import useWindowSizeListener from '../../hooks/useWindowSizeListener';

const DEFAULT_HEIGHT = 200;

interface ResizableProps {
  direction: 'horizontal' | 'vertical';
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  const [panelWidth, setPanelWidth] = useState(window.innerWidth * 0.75);
  const [innerWidth, innerHeight] = useWindowSizeListener(
    panelWidth,
    setPanelWidth,
  );
  let resizableProps: ResizableBoxProps;

  switch (direction) {
    case 'horizontal':
      resizableProps = {
        className: 'resize-horizontal',
        height: Infinity,
        maxConstraints: [innerWidth * 0.75, Infinity],
        minConstraints: [innerWidth * 0.3, Infinity],
        onResizeStop: (_, data) => {
          setPanelWidth(data.size.width);
        },
        resizeHandles: ['e'],
        width: panelWidth,
      };
      break;
    case 'vertical':
      resizableProps = {
        height: DEFAULT_HEIGHT,
        maxConstraints: [Infinity, innerHeight * 0.9],
        minConstraints: [Infinity, DEFAULT_HEIGHT],
        resizeHandles: ['s'],
        width: Infinity,
      };
      break;
  }

  return <ResizableBox {...resizableProps}>{children}</ResizableBox>;
};

export default Resizable;
