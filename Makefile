JS=$(wildcard assets/scripts/*.js)
CSS=$(wildcard assets/styles/*.css)
OBJJ=$(SRC=.js=.js)
OBJC=$(SRC=.css=.css)

all: clean js css

js: $(OBJJ)
	mkdir dist/scripts
	terser $(JS) -o dist/scripts/concat.min.js --compress --mangle

css: $(OBJC)
	mkdir dist/styles
	cat $(CSS) > dist/styles/concat.css
	cleancss dist/styles/concat.css -o dist/styles/concat.min.css
	rm -rf dist/styles/concat.css

clean:
	rm -rfd dist/*