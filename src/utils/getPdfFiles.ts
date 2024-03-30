import {JSDOM} from "jsdom";


const extractPdffiles = (domElement: JSDOM ): string[] => {
  const embemdedElements = domElement.window.document.querySelectorAll('embed[src$=".pdf"]');
  const iframeElements = domElement.window.document.querySelectorAll('iframe[src$=".pdf"]');
  const objectElements = domElement.window.document.querySelectorAll('object[data$=".pdf"]');
  const achorElements = domElement.window.document.querySelectorAll('a[href$=".pdf"]');

  const pdfFiles = <string[]>[];

  const embededEleLength = embemdedElements.length;
  const iframeEleLength = iframeElements.length;
  const objectEleLength = objectElements.length;
  const achorEleLength = achorElements.length;
  
  const maxLength = Math.max(embededEleLength, objectEleLength, iframeEleLength, achorEleLength);

  for(let i = 0; i < maxLength; i++){
    if(i <  embededEleLength ){
      const src = embemdedElements[i].getAttribute('src');
      if(src && src.endsWith('.pdf')){
        pdfFiles.push(src);
      }
    }
    if(i < objectEleLength ){
      const data = objectElements[i].getAttribute('data');
      if(data && data.endsWith('.pdf')){
        pdfFiles.push(data);
      }
    }
    if(i < iframeEleLength ){
      const src = iframeElements[i].getAttribute('src');
      if(src && src.endsWith('.pdf')){
        pdfFiles.push(src);
      }
    }
    if(i < achorEleLength ){
      const href = achorElements[i].getAttribute('href');
      if(href && href.endsWith('.pdf')){
        pdfFiles.push(href);
      }
    }
      
  }
  return pdfFiles;
};


const findNodeByText = (rootNode: HTMLElement, searchString: string): HTMLElement | null => {
  // loop through the dom elements
  const stack: ChildNode[]  = [rootNode];
  while (stack.length > 0) {
      const currentNode  = stack.pop();
      if (!currentNode) continue;

      // Check if the current node's text content matches the search string
      if (currentNode.nodeValue?.trim().includes(searchString)) {
          return (currentNode.parentNode as HTMLElement);
      }
      // Push child nodes to the stack for further traversal
      if (currentNode.childNodes) {
        for (let i = 0; i < currentNode.childNodes.length; i++) {
          stack.push(currentNode.childNodes[i]);
        }
      }
  }
  return null;
}

export const getPdfFiles = (htmlBody: string, searchString?: string): string[] => {
  const domElement = new JSDOM(htmlBody);
  if (searchString ) {
    const node = findNodeByText(domElement.window.document.body, searchString);
    if (node) {
      const adoc =  new JSDOM(node.outerHTML);
      const pdfFiles = extractPdffiles(adoc);
      return pdfFiles;
    }
  }
    return extractPdffiles(domElement);
};