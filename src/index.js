
/**
 * 通过iframe打印局部内容
 * content: 打印内容(html)
 * options: {
 *    direction: 方向
 *    style: 样式
 *    iframeId: 打印iframeid
 *    beforePrint: 打印之前的回调
 * }
 * @returns
 */
 export default function (content, options = {}) {
  const {
    direction = "portrait",
    style = "",
    iframeId = "printIframe",
    beforePrint,
  } = options;

  const iframe = document.createElement("iframe");
  iframe.id = iframeId;
  iframe.style.display = "none";

  document.documentElement.appendChild(iframe);

  const printWindow = iframe.contentWindow;

  printWindow.document.write(`
    <style>
      body { -webkit-print-color-adjust: exact; }
      @page { size: ${direction};}
      .paging {
        page-break-inside: avoid;
        page-break-after: auto;
      }
      ${style}
    </style>
    ${content}
  `);

  beforePrint && printWindow.addEventListener("beforeprint", beforePrint);

  printWindow.focus();
  printWindow.print();

  printWindow.parent.document
    .querySelectorAll(`#${iframeId}`)
    .forEach((item) => item.remove());
}