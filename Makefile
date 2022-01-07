SHELL=/bin/bash
JS=$(wildcard assets/scripts/*.js)
CSS=$(wildcard assets/styles/*.css)
OBJJ=$(SRC=.js=.js)
OBJC=$(SRC=.css=.css)

all: clean js css

js: $(OBJJ)
	@if [ ! -d "./dist" ]; then mkdir dist; fi;
	@if [ ! -d "./dist/scripts" ]; then mkdir ./dist/scripts; fi;
	terser $(JS) -o dist/scripts/concat.min.js --compress --mangle

css: $(OBJC)
	@if [ ! -d "./dist" ]; then mkdir dist; fi;
	@if [ ! -d "./dist/styles" ]; then mkdir ./dist/styles; fi;
	cat $(CSS) > dist/styles/concat.css
	cleancss dist/styles/concat.css -o dist/styles/concat.min.css

clean:
	@if [ -d "./dist" ]; then rm -rfd dist; fi;