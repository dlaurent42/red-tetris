const generatePiece = () => {
  const arr = [
    // Cube
    {
      position: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ],
      size: 2,
    },
    // Pipe
    {
      position: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 3, y: 0 },
      ],
      size: 4,
    },
    // Reversed L
    {
      position: [
        { x: 2, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
      ],
      size: 3,
    },
    // L
    {
      position: [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
      ],
      size: 3,
    },
    // S
    {
      position: [
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ],
      size: 3,
    },
    // T
    {
      position: [
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 1, y: 1 },
      ],
      size: 3,
    },
    // Z
    {
      position: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
      ],
      size: 3,
    },
  ];
  return arr[Math.floor(Math.random() * arr.length)];
};

export default generatePiece;


/*
  10x20
*/
