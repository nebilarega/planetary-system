let mouseDown = false,
  mouseX = 0,
  mouseY = 0;

const onMouseMove = (evt, model) => {
  if (!mouseDown) {
    return;
  }

  evt.preventDefault();

  var deltaX = evt.clientX - mouseX,
    deltaY = evt.clientY - mouseY;
  mouseX = evt.clientX;
  mouseY = evt.clientY;
  rotateScene(deltaX, deltaY, model);
};

const onMouseDown = (evt) => {
  evt.preventDefault();

  mouseDown = true;
  mouseX = evt.clientX;
  mouseY = evt.clientY;
};

const onMouseUp = (evt) => {
  evt.preventDefault();
  mouseDown = false;
};
const rotateScene = (deltaX, deltaY, model) => {
  model.rotation.y -= deltaX / 100;
  model.rotation.x += deltaY / 100;
};
export const addMouseHandler = (canvas, model) => {
  canvas.addEventListener(
    "mousemove",
    (e) => {
      onMouseMove(e, model);
    },
    false
  );
  canvas.addEventListener(
    "mousedown",
    (e) => {
      onMouseDown(e);
    },
    false
  );
  canvas.addEventListener(
    "mouseup",
    (e) => {
      onMouseUp(e);
    },
    false
  );
};
