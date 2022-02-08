export default function (options) {
  const {
    target,
    text,
    width = 140,
    height = 80,
    textAlign = "center",
    color = "black",
    opacity = 0.2,
    zIndex = 999999999,
    font = "15px Arial",
  } = options || {};
  if (!text) return;

  const targetNode = target ? target() : document.body;
  const isMountRoot = targetNode === document.body;

  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  const context = canvas.getContext("2d");

  canvas.width = width || 140;
  canvas.height = height || 80;

  context.font = font;
  context.textAlign = textAlign;
  context.fillStyle = color;
  context.rotate(-0.4);
  context.fillText(text, canvas.width * 0.35, canvas.height / 1.2);

  // mount
  const headNode = document.querySelector("head");
  const styleNode = document.createElement("style");
  styleNode.setAttribute("type", "text/css");

  styleNode.innerHTML = `
    ${!isMountRoot ? ".watermark { position: relative; }" : ""}
    .watermark::after {
      position: ${!isMountRoot ? "absolute" : "fixed"};
      content: '';
      left: 0px;
      top: 0px;
      width: 100${!isMountRoot ? "%" : "vw"};
      height: 100${!isMountRoot ? "%" : "vh"};
      opacity: ${opacity};
      z-index: ${zIndex};
      pointer-events: none;
      background: url(${canvas.toDataURL("image/png")}) repeat;
    }
  `;

  headNode.appendChild(styleNode);
  targetNode.classList.add("watermark");
  canvas.remove();
  return {
    destroy() {
      targetNode.classList.remove("watermark");
      headNode.removeChild(styleNode);
    },
    toggle() {
      targetNode.classList.toggle("watermark");
    },
  };
}
