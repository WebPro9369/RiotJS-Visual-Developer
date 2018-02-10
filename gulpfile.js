
var gulp = require('gulp');
var gutil = require('gulp-util');
var jade = require('gulp-jade');
var stylus = require('gulp-stylus');
var riot = require('gulp-riot');
var ext_replace = require('gulp-ext-replace');
var concat = require('gulp-concat'); 
var clean = require('gulp-clean');
var replace = require('gulp-replace');
var coffeelint = require('gulp-coffeelint');
var fs = require('fs');
var glob = require("glob");
var plumber = require('gulp-plumber');
var karmaServer = require('karma').Server;
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync');
var coffee = require('gulp-coffee');

//task to delete public/temp directory(before creating single js)
gulp.task('initialClean', function(){
  return gulp.src('./public/temp',{read:false})
  .pipe(clean());
});

//task to delete public/temp directory(after creating single js)
gulp.task('finalClean', ['concateJS'], function(){
  return gulp.src('./public/temp',{read:false})
  .pipe(clean());
});

//task to delete temp .js from public/temp directory(after creating single js)
gulp.task('deleteTempJS', ['concateJS','concateLibJs'], function(){
  return gulp.src(['./public/temp/*.js'],{read:false})
  .pipe(clean());
});

//task to compile jade files in /src/spec to HTML
gulp.task('jadeSpecTemplates', function() {
  var YOUR_LOCALS = {}; 
  return gulp.src('./src/spec/**/*.jade')
  .pipe(jade({
    locals: YOUR_LOCALS
  }))
  .pipe(gulp.dest('./public/spec/'))
});

//task to compile index.jade file in /src to index.html in /public directory
gulp.task('jadeIndexTemplate', function() {
 var YOUR_LOCALS = {}; 
 return gulp.src('./src/index.jade')
 .pipe(jade({
   locals: YOUR_LOCALS
 }))
 .pipe(gulp.dest('./public/'))
});

//protoTypeGulp
gulp.task('protoTypeGulp', function() {
 var YOUR_LOCALS = {}; 
 return gulp.src('./src/prototype/index.jade')
 .pipe(jade({
   locals: YOUR_LOCALS
 }))
 .pipe(gulp.dest('./public/prototype/'));
});

//todo temp folder should not be public. this applies to all uses of the temp folder

//task to compile .tag files in /src/components/ to .js
gulp.task('jadeRiotComponents', function() {
  return gulp.src('./src/components/**/*.tag')
  .pipe(plumber({}))
  .pipe(riot({    
    template:'jade',
    compact: true,
    autoUpdate: false
  }))
  .pipe(gulp.dest('./public/temp'));
});

// gulp.watch(['./src/lib/*.coffee'],['coffeeToJs']);

gulp.task('coffeeToJs' , function(){
  return gulp.src('./src/lib/*.coffee')
    .pipe(coffee({bare: true}))
    .pipe(gulp.dest('./public/temp/lib/'));
})

gulp.task('concateLibJs' , ['coffeeToJs'] , function(){
  return gulp.src(['./src/lib/*.js','./public/temp/lib/*.js'])
  //.pipe(clean({force: true}))
  .pipe(concat('lib.js'))
  .pipe(gulp.dest('./public/lib/'));
})


// task to merge all js files in single js file
gulp.task('concateJS',['jadeRiotComponents'], function() {
  return gulp.src('./public/temp/**/*.js')
  .pipe(concat('components.js'))
  .pipe(gulp.dest('./public/components/'));
});

//task to lint coffeescripts files in src/spec and coffee portions from .jade and .tag files
gulp.task('coffeelint', ['coffeeFromJadeFile', 'coffeeFromTagFile'], function () {
  gulp.src(['./src/spec/**/*.coffee', './public/temp/*.coffee' , './src/lib/helpers.coffee'])
  .pipe(coffeelint())
  .pipe(coffeelint.reporter())
});


//task to extract coffee from tag files and cretae coffee file in public/temp directory 
gulp.task('coffeeFromTagFile', function(){
  extractCoffee('src/components/**/*.tag', './public/temp');
});

//task to extract coffee from jade files in src and cretae coffee file in public/temp directory 
gulp.task('coffeeFromJadeFile', function(){
  extractCoffee('src/**/*.jade', './public/temp');
});


//task to watch for changes in .tag files and .coffee files created form .tag files
//gulp.task('tag_changes',['coffeeFromTagFile', 'coffeelint', 'jadeRiotComponents', 'concateJS', 'finalClean']);
gulp.task('tag_changes',['coffeeFromTagFile', 'coffeelint', 'jadeRiotComponents', 'concateJS', 'deleteTempJS']);

//task to watch for changes in .coffee files created form .jade files
//gulp.task('jade_changes',['coffeeFromJadeFile', 'coffeelint', 'finalClean']);
gulp.task('jade_changes',['coffeeFromJadeFile', 'coffeelint']);

gulp.task('lib_changes',['coffeeToJs','concateLibJs','deleteTempJS'])
//gulp.task('watch', ['finalClean'], function(){
gulp.task('watch', function(){
  gulp.watch(['./src/*.jade'],['jadeIndexTemplate']);
  gulp.watch(['./src/spec/**/*.jade'],['jadeSpecTemplates']);
  gulp.watch(['./src/prototype/*.jade'] ,['protoTypeGulp']);
  gulp.watch(['./src/components/**/*.tag'],['tag_changes']);
  // gulp.watch(['./src/spec/*.coffee'],['coffeelint', 'finalClean']);
  // gulp.watch(['./src/**/*.jade'],['jade_changes', 'finalClean']); //for coffeelint
  gulp.watch(['./src/spec/**/*.coffee','./src/lib/*.coffee'],['coffeelint']);
  gulp.watch(['./src/**/*.jade'],['jade_changes']); //for coffeelint
  gulp.watch(['./src/lib/*.js','./src/lib/*.coffee'] ,['lib_changes']);
  gulp.watch(['./src/prototype/*.styl'] ,['stylusCompile']);
});

//Run Test
gulp.task('test', function (done) {
  new karmaServer({
    configFile: __dirname + '/karma.conf.js',
    //singleRun: true
  }, done).start();
});

gulp.task('browserSync', ['start'], function() {
  browserSync.init(null, {
    proxy: "http://localhost:3000",
        files: ["public/**/*.*"],
        browser: "google chrome",
        port: 7000,
  });
});

//Start Server
gulp.task('start', function (cb) {
  nodemon({
      script: 'bin/www',
      watch : ['app.js','bin/www','routes/*.js']
  });
})

//Stylus Compliation
gulp.task('stylusCompile', function () {
  return gulp.src('./src/prototype/*.styl')
    .pipe(stylus({}))
    .pipe(gulp.dest('./public/prototype/'));
});


//gulp.task('default',['jadeSpecTemplates', 'jadeIndexTemplate', 'jadeRiotComponents', 'coffeelint', 'concateJS', 'finalClean', 'watch']);
var gulpTaskList = [ 'jadeSpecTemplates'
                    ,'jadeIndexTemplate'
                    ,'jadeRiotComponents'
                    ,'coffeelint'
                    ,'concateLibJs'
                    ,'concateJS'
                    ,'deleteTempJS'
                    ,'watch'
                    //,'test'
                    ,'start'
                    ,'protoTypeGulp'
                    ,'stylusCompile'
                    //,'browserSync'
                  ];
gulp.task('default',gulpTaskList);


function extractCoffee(directoryPath, destDirectoryPath){
  var files = glob.sync(directoryPath);
  var promiseArr=[];
  files.forEach(function(file){
    promiseArr.push(createCoffeeFile(file, destDirectoryPath));
  });

  return Promise.all(promiseArr).then(function(result){
  });  
};

function createCoffeeFile(filePath, destDirectoryPath){
  return new Promise(function(resolve, reject){
    fs.readFile(filePath, function(err, data){
      if(!err){
        var fileName = filePath.substring(filePath.lastIndexOf('/')+1);
        fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase(),
        searchString = null,       
        stringData = data.toString();

        switch(fileExtension){
          case '.tag':
          searchString = 'script(type="text/coffeescript").';
          break;
          case '.jade':
          searchString = ':coffee-script';
          break;
          default:
          searchString = null;
          break;
        }  
        var index = stringData.indexOf(searchString);
        if(index>-1){
        //take all data after this searchString index
        var coffeeScriptCode = stringData.substring(index);
        coffeeScriptCode = coffeeScriptCode.replace(searchString, '');
        // inserts line breaks in coffeeScriptCode
        var subStringsArray = stringData.split(searchString);
        var numberOfLineBreaks= subStringsArray[0].split(/\r\n|\r|\n/).length;
        for (i=0; i < numberOfLineBreaks-1; ++i){
          coffeeScriptCode = '\n'+coffeeScriptCode;
        }
          // removes leading indent from starting of each coffeeScriptCode line
          coffeeScriptCode = coffeeScriptCode.replace(/\n    |\r    /g,'\n');
          var coffeeFileName = fileName.replace(fileExtension,'-coffee.coffee');
          if (!fs.existsSync(destDirectoryPath)){
            fs.mkdirSync(destDirectoryPath);
          }
          fs.writeFile(destDirectoryPath +'/'+ coffeeFileName, coffeeScriptCode, function(err){
            if(err){
              console.log(err);
              reject(err);
            } 
            resolve('success');         
          });
        }
      }else{
        console.log(err);
        reject(err);
      }
    })
  })
};

