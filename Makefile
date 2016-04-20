ci:
	npm run coverage
	npm run docs
	npm run prepublish

coverage:
	npm run coverage

test: lint
	npm test

lint: node_modules
	npm run lint

clean:
	rm -rf node_modules coverage docs

node_modules: package.json
	npm install

.PHONY: node_modules