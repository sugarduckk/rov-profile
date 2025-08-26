type Template = {
  name: string;
  image: string;
  mapping: {
    topLeft: { x: number; y: number; };
    topRight: { x: number; y: number; };
    bottomLeft: { x: number; y: number; };
    bottomRight: { x: number; y: number; };
  };
};

export default Template;
