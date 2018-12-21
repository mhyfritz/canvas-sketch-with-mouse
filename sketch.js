import canvasSketch from "canvas-sketch";

const settings = {
  animate: true,
  dimensions: "a4"
};

function withMouse(sketch) {
  return initalProps => {
    const { canvas, width, height } = initalProps;
    const mouse = { x: undefined, y: undefined, event: undefined };

    canvas.addEventListener("mousemove", event => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (event.clientX - rect.left) * (width / rect.width);
      mouse.y = (event.clientY - rect.top) * (height / rect.height);
      mouse.event = event;
    });

    const render = sketch(initalProps);
    return renderProps => {
      renderProps.mouse = mouse;
      render(renderProps);
    };
  };
}

const sketch = ({ width, height }) => {
  const gradient = document.createElement("canvas");
  gradient.width = width;
  gradient.height = height;
  const gradientContext = gradient.getContext("2d");
  const fill = gradientContext.createLinearGradient(0, 0, width, height);
  fill.addColorStop(0, "cyan");
  fill.addColorStop(1, "orange");
  gradientContext.fillStyle = fill;
  gradientContext.fillRect(0, 0, width, height);

  return ({ context, mouse }) => {
    const imageData = gradientContext.getImageData(mouse.x, mouse.y, 1, 1);
    context.fillStyle = `rgb(${imageData.data[0]},${imageData.data[1]},${
      imageData.data[2]
    })`;
    context.fillRect(0, 0, width, height);
  };
};

canvasSketch(withMouse(sketch), settings);
