import {JSDOM} from "jsdom";
import fs from "fs";
import  path from 'path';
import { readPdfFile } from ".";
import download from "../worker";
import { cachedProcessedData } from "./cachedProcessedData";

type PdfLinkObject = {
  [key: string]: {
    pdfs: string[];
    expired_at: number;
  };
}

const extractPdffiles = (domElement: JSDOM, hostname: string, isConCurrent?: boolean): string[] => {
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
          if (isConCurrent) download('', '', [src.substring(startIndex, endIndex + 4)]);
        }
        else if(src.endsWith('.pdf') && !src.startsWith('http')){
          const pdfUrl = 'http://'+path.normalize(path.join(hostname, src.replaceAll('\\', '/')));
          pdfFiles.push(pdfUrl);
          if (isConCurrent) download('', '', [pdfUrl]);
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
          if (isConCurrent) download('', '', [data.substring(startIndex, endIndex + 4)]);
        }
        else if(data.endsWith('.pdf') && !data.startsWith('http')){
          const pdfUrl = 'http://'+path.normalize(path.join(hostname, data.replaceAll('\\', '/')));
          pdfFiles.push(pdfUrl);
          if (isConCurrent) download('', '', [pdfUrl]);
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
          if (isConCurrent) download('', '', [src.substring(startIndex, endIndex + 4)]);
        }
        else if(src.endsWith('.pdf') && !src.startsWith('http')){
          const pdfUrl = 'http://'+path.normalize(path.join(hostname, src.replaceAll('\\', '/')));
          pdfFiles.push(pdfUrl);
          if (isConCurrent) download('', '', [pdfUrl]);
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
          if (isConCurrent) download('', '', [href.substring(startIndex, endIndex + 4)]);
        }
        else if(href.endsWith('.pdf') && !href.startsWith('http')){
          const pdfUrl = 'http://'+path.normalize(path.join(hostname, href.replaceAll('\\', '/')));
          pdfFiles.push(pdfUrl);
          if (isConCurrent) download('', '', [pdfUrl]);
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

export const getPdfFiles = (
  htmlBody: string, 
  hostname: string, 
  searchString?: string, 
  url?: string, 
  isConCurrent?: boolean, 
  saveAs?: string, 
  ttl?: number ): string[] => {

  const saveData = readPdfFile(saveAs || 'pdf-links');

  if(saveData[`${url}`]) {
    const {pdfs, expired_at} = saveData[`${url}`];
    if (Date.now() < expired_at) {
      console.log("pdf already dowloaded for the provided url, returned cached pdfs links\n", pdfs);
      process.exit(0);
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
      pdfFiles = extractPdffiles(adoc, hostname, isConCurrent);
    }
  }
  else{
    pdfFiles = extractPdffiles(domElement, hostname, isConCurrent);
  }
  // if there is pdf files then persist them by caching it to the disk
  if (pdfFiles.length > 0) cachedProcessedData(pdfFiles, saveAs ||'pdf-links', url ||'', ttl);
  return pdfFiles;
};