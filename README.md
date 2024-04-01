# CRAWLER-RPA
This is a cli tool build for crawling through a given web page and download all avaialable **.pdf** file in the page.
It comes with handy feature likes options that allow you to select which kind of commad to be executed at any given time.
In order to improve permformance, all retieved pdf files are cached in the system disk using the file system and are invalidated after 24 hours.
Scecondly the tool also utilised the node thread pools by executing majority of I/O tasks asynchronously with allowing blocking. In addition to this the tool also spwan up node clusters based on the number of core of the under running system, this is also a means to improve concurrency and parrallel processing. ** Note** this is for demo purposes only and have not fully cover all the edge cases for a production ready tool.

## what this tool intended to do
1.generate a list of all available pdf files in a web page and save them as a json object for the gievn url
2. Download all the retrieved pdf files from the page and save them in a downloads directory at the root of the tool folder **this can be either in a concurrent option or by synchronous option<default>**
3. Retrieved a pdf file based on a search string and download it present on the web page "<working but need improvement to covered some edge cases>"
4. Merge the pdf files into a single file 
5. Translate the pdf file to a target locale<in progress> 


## Available Scripts

This project is build using `pnpm` so you need to install it global for some of the script like link. In the project directory, you can run:

#### `npm run dev or pnpm dev`

Runs the app in the development mode by generating the build files in watch mode

This is helpful in generating the javascript files for each code change or edits.


#### `npm test or pnpm test`

Runs unit test for the majority of utility functions

#### `npm run build or pnpm build`

Builds the tool the `build` folder.


#### `npm run link:cli or pnpm link` this script requires the pnpm package manager to be installed first on your system but you can change it to use npm or yarn instead
This register and link the crawler-rpa tool to your path environment variable globally. so that you can easily use the tool by typying `crawler-rpa <url> [search] [-options]`

#### `npm run unlink:cli or pnpm unlink:cli`
this unregister and unlink the tool making it unavailable for you to use

#### `npm run clear:cache or pnpm clear:cache` 
This invalidate the cache by removing it from the system disc

#### `npm run drop:dowloads or pnpm drop:dowloads`

This delete all the dowloaded pdf files from the system

## How to use the tool

1. clone the repository
`git clone https://github.com/Onesco/crawler-rpa.git`

2. install the dependencies
`npm install or pnpm install`

In order to use tool after you might clone and install all the dependencies for the project for need to ensure you have pnpm installed globally so you can just run `npm install -g pnpm` this is necessary in the linking stage of the project which will enable you to run the tool on your machine.

3. Register and link the cli tool
`npm run link:cli or pnpm link:cli` this stage makes use if pnpm so you need to have pnpm installed globally or better still modify the script to either use npm or yarn instead

After then you can now run:

`crawler-rpa -h` to see get the help menu of the tool and see all the available commands and options

### for Example

`crawler-rpa -u https://www.google.com/search?q=cardiovascular+risk+factors+pdf&rlz=1C5CHFA_enNG1080NG1081&oq=cardiovascular+risk+factors+pdf&gs_lcrp=EgZjaHJvbWUqBggAEEUYOzIGCAAQRRg7MgYIARBFGDwyBggCEEUYPDIGCAMQRRg80gEIMzA0NWowajeoAgCwAgA&sourceid -conc`

Will go through the google page for this search link and dowload all the available pdf files.

#### the options:
1. `-u` for short or `--url` is for the url to search and it optional so you can remove it and just run `crawler-rpa <url link>`
2. `-conc` for short or `--concurrent` will ensure that for each found pdf file, the download will be handle by a thread will the seach for the next one continue with asynchronous. it is optional if provide it improve performance but if not provieded the download of pdf files will only occur after we might have seen all the pdf files in the page.
3. `-s` for short or `--search` is used to provide a search key word which will be will allow us to get get pdf file[s] for that given parent node the search key work is found.


```
 %
 crawler-rpa -h
Usage: crawler-rpa [options] [command] <url> [search]

this crawler require url argument for a website in order to process it and retrieve all available pdf files in the page
and also download them either after all pdf files have been retrieved or currently available pdf files for each pdf file
seen. It also has an internal caching mechanism that save all retrieved filed to the disk with a ttl of 24 hours upon
which a further query to the provided website will return invalidated the cache and make a free query for the given url.
It also has option to that allows you to merge list of pdf files into one by providing the file path to the pdf files

Options:
  -u --url                  the url to site to process
  -s --search <string>      the string to search for pdf files on the site
  -conc --concurrent        the boolean value that is provided in order to execute both the get of pdf files and download
                            of the pdf files concurrently
  -t --ttl <number>         the time to live (in seconds) of retrieved pdf files links from a given web page (default:
                            86_400 seconds that is 24 hours)
  -sa --save-as <string>    json file name to save the cached retrieved pdf file cached-crawled-pdf-links directory, if
                            absent default to pdf-links
  -h, --help                display help for command

Commands:
  merge <files> [marge-as]

```


### merging pdf file
`crawler-rpa merge [options]`
this command is used for merging pdf files

run `crawler-rpa merge -h ` to see the help menu at the merge command level
#### merge command example:
`crawler-rpa merge "first-pdf-file-path.pdf, second-pdf-file-path.pdf, third-pdf-file-path.pdf"  "merge-output-name"`

``` 
% crawler-rpa merge -h
Usage: crawler-rpa merge [options] <files> [marge-as]

Arguments:
  files       string of file paths to the pdf files to be merge separate by comma delimiter[","] example-  to
              "myfirstpdffile.pdf,mysecondpdffile.pdf"
  marge-as    the name you want want to merge the files to. if not provide it is default to merged.pdf

Options:
  -h, --help  display help for command
mac@MACs-MBP crawler-rpa % 
```