# Configurathering
This tool is designed to manage onaple plugins configuration files,
 translating JSON(HOCON) in a user friendly interface. 
 ## Development
 to install the development package, you need to run `npm install` to download modules and then
 run ```browserify -o bundle.js -p parcelify```  
 this will pack whole css and js into _bundle_ files used by web pages.  
 To add more library to bundle add them to `module.js`. For the css, set the path of the `.css` file
 in the style section of the `package.json` 