.PHONY: test clean

lint:
	npm run lint

test: lint testdata/dummy_project
	npm run test

testdata/dummy_project:
	tar -xvf testdata/dummy_project.tar.gz

clean:
	rm -rf testdata/dummy_project

