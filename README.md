# CRAWLER-RPA
This is a cli tool build for crawling through a given web page and download all avaialable **.pdf** file in the page.\
It comes with handy feature likes options that allow you to select which kind of commad to be executed at any given time.\
In order to improve permformance, all retieved pdf files are cached in the system disk using the file system and are invalidated after 24 hours. \ 
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

Runs the app in the development mode by generating the build files in watch mode\

This is helpful in generating the javascript files for each code change or edits.\


#### `npm test or pnpm test`

Runs unit test for the majority of utility functions\

#### `npm run build or pnpm build`

Builds the tool the `build` folder.\


#### `npm run link:cli or pnpm link` this script requires the pnpm package manager to be installed first on your system but you can change it to use npm or yarn instead
This register and link the crawler-rpa tool to your path environment variable globally. so that you can easily use the tool by typying `crawler-rpa <url> [search] [-options]` \

#### `npm run unlink:cli or pnpm unlink:cli`
this unregister and unlink the tool making it unavailable for you to use

#### `npm run clear:cache or pnpm clear:cache` 
This invalidate the cache by removing it from the system disc

#### `npm run drop:dowloads or pnpm drop:dowloads`

This delete all the dowloaded pdf files from the system

## How to use the tool

In order to use tool after you might clone and install all the dependencies for the project for need to first build the tool and link it to your path environment variable by running the commands above! \

After then you can now run: \

`crawler-rpa -h` to see get the help menu of the tool and see all the available commands and options

### for Example

`crawler-rpa -u https://www.google.com/search?q=cardiovascular+risk+factors+pdf&rlz=1C5CHFA_enNG1080NG1081&oq=cardiovascular+risk+factors+pdf&gs_lcrp=EgZjaHJvbWUqBggAEEUYOzIGCAAQRRg7MgYIARBFGDwyBggCEEUYPDIGCAMQRRg80gEIMzA0NWowajeoAgCwAgA&sourceid -conc`

Will go through the google page for this search link and dowload all the available pdf files.

#### the options:
1. `-u` for short or `--url` is for the url to search and it optional so you can remove it and just run `crawler-rpa <url link>`
2. `-conc` for short or `--concurrent` will ensure that for each found pdf file, the download will be handle by a thread will the seach for the next one continue with asynchronous. it is optional if provide it improve performance but if not provieded the download of pdf files will only occur after we might have seen all the pdf files in the page.
3. `-s` for short or `--search` is used to provide a search key word which will be will allow us to get get pdf file[s] for that given parent node the search key work is found.
