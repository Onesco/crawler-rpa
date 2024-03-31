import {JSDOM} from "jsdom";
import fs from "fs";
import  path from 'path';
import { readPdfFile } from ".";
import main from "../worker";

type PdfLinkObject = {
  [key: string]: {
    pdfs: string[];
    expired_at: number;
  };
}

const extractPdffiles = (domElement: JSDOM, isConCurrent?: boolean ): string[] => {
  const embemdedElements = domElement.window.document.querySelectorAll('embed[src*=".pdf"]');
  const iframeElements = domElement.window.document.querySelectorAll('iframe[src*=".pdf"]');
  const objectElements = domElement.window.document.querySelectorAll('object[data*=".pdf"]');
  const achorElements = domElement.window.document.querySelectorAll('a[href*=".pdf"]');

  const pdfFiles = <string[]>[];

  const embededEleLength = embemdedElements.length;
  const iframeEleLength = iframeElements.length;
  const objectEleLength = objectElements.length;
  const achorEleLength = achorElements.length;
  
  const maxLength = Math.max(embededEleLength, objectEleLength, iframeEleLength, achorEleLength);
 
  for(let i = 0; i < maxLength; i++){
    if(i <  embededEleLength ){
      const src = embemdedElements[i].getAttribute('src');
      if(src){
        const startIndex = src.indexOf('http');
        const endIndex = src.indexOf('.pdf')
        if(startIndex >=0 && startIndex!== -1 && endIndex!== -1){
          pdfFiles.push(src.substring(startIndex, endIndex + 4));
          if (isConCurrent) main('', '', [src.substring(startIndex, endIndex + 4)]);
        }
      }
    }
    if(i < objectEleLength ){
      const data = objectElements[i].getAttribute('data');
      if(data){
        const startIndex = data.indexOf('http');
        const endIndex = data.indexOf('.pdf')
        if(startIndex >=0 && startIndex!== -1 &&  endIndex!== -1){
          pdfFiles.push(data.substring(startIndex, endIndex + 4));
          if (isConCurrent) main('', '', [data.substring(startIndex, endIndex + 4)]);
        }
      }
    }
    if(i < iframeEleLength ){
      const src = iframeElements[i].getAttribute('src');
      if(src){
        const startIndex = src.indexOf('http');
        const endIndex = src.indexOf('.pdf')
        if(startIndex >=0 && startIndex!== -1 && endIndex!== -1){
          pdfFiles.push(src.substring(startIndex, endIndex + 4));
          if (isConCurrent) main('', '', [src.substring(startIndex, endIndex + 4)]);
        }
      }
    }
    if(i < achorEleLength ){
      const href = achorElements[i].getAttribute('href');
      if(href){
        const startIndex = href.indexOf('http');
        const endIndex = href.indexOf('.pdf')
        if( startIndex >=0 && startIndex!== -1 && endIndex!== -1){
          pdfFiles.push(href.substring(startIndex, endIndex + 4));
          if (isConCurrent) main('', '', [href.substring(startIndex, endIndex + 4)]);
        }
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
};

const cachedProcessedData = (pdfLinks: string[], fileName: string, url: string, ttl = 86_400) => { // ttl: the time to live of 24 hours

  console.log('caching data to disk')
  const baseDownloadDir = "cached-crawled-pdf-links";
  if (!fs.existsSync(baseDownloadDir)) {
    fs.mkdirSync(baseDownloadDir); 
  }
  const data: PdfLinkObject = readPdfFile(fileName);

  if (data[`${url}`]) {
    const {expired_at} = data[`${url}`];
    if (Date.now() < expired_at) {
      return;
    }
    else{
      delete data[`${url}`];
    }
  }

  data[`${url}`] = {
    pdfs: pdfLinks,
    expired_at: Date.now() + ttl,
  }
  const destination = path.resolve(baseDownloadDir, `${fileName}.json`);

  fs.writeFile(destination, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.log("error in caching file");
      return;
    }
    console.log("The file was saved!");
  });
};


export const getPdfFiles = (htmlBody: string, searchString?: string, url?: string, isConCurrent?: boolean): string[] => {
  const saveData = readPdfFile('pdf-links');

  if(saveData[`${url}`]) {
    const {pdfs, expired_at} = saveData[`${url}`];
    if (Date.now() < expired_at) {
      console.log("returned cached pdfs links")
      return pdfs;
    }
    else{
      delete saveData[`${url}`];
    }
  }
  const domElement = new JSDOM(htmlBody);
  let pdfFiles: string[] = [];
  if (searchString ) {
    const node = findNodeByText(domElement.window.document.body, searchString);
    if (node) {
      const adoc =  new JSDOM(node.outerHTML);
      pdfFiles = extractPdffiles(adoc);
    }
  }
    pdfFiles = extractPdffiles(domElement, isConCurrent);
    if (pdfFiles.length > 0) cachedProcessedData(pdfFiles, 'pdf-links', url ||'');
    return pdfFiles;
};