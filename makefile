bake-single-pandoc:
	pandoc output/seite-1/seite-1.md -o output/seite-1/seite-1.docx -o output/seite-1/seite-1.pdf
bake-all-pandoc:
	./src/bake-all-pandoc.sh
