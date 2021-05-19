.PHONY: test clean build

lint:
	npm run lint

test: lint testdata/dummy_project
	npm run test

# Updates relevant files in `dist/`, used for
# integration testing & action release.
build: test
	npm run prepare

testdata/dummy_project:
	tar -xvf testdata/dummy_project.tar.gz

clean:
	rm -rf testdata/dummy_project

