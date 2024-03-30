import fs from "fs";
import  { mkdir }  from "fs/promises";
import { Readable} from 'stream';
import { finished } from 'stream/promises';
import { ReadableStream } from 'stream/web';
import  path from 'path';

export const downloadPdfFile = async (url: string) => {
  let fileName = url.split('/').pop();
  const result = await fetch(url);
  console.log('response header',result.headers.get('Content-Type'));

  const baseDownloadDir = "downloads";
  if (!fs.existsSync(baseDownloadDir)) await mkdir(baseDownloadDir); 

  const destination = path.resolve(baseDownloadDir, fileName || '');
  const body = result.body;

  if (body){
    const fileStream = fs.createWriteStream(destination);
    await finished(Readable.fromWeb(body as ReadableStream<any>).pipe(fileStream));
  }
};