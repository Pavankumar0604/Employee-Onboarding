declare module '*.module.css' {
  export const classes: { [key: string]: string };
}
declare module '*.png' {
  const value: string;
  export default value;
}
declare module '*.svg?react' {
  import * as React from 'react';

  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}