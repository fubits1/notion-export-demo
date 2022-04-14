bake-single:
	pandoc output/page-1/page-1.md -o output/page-1/page-1.docx -o output/page-1/page-1.pdf
bake-all:
	./src/bake-all.sh
