#!/bin/bash
for dir in ./output/*/ # list subdirectories
do
    for file in $dir*.md # only for markdown files
    do
        fileSegement=${file%*.md} # drop extension
        echo $dir
        echo $file # full path
        echo $fileSegement # path w/o extension
        pandoc $file -o $fileSegement.docx
        pandoc $file -o $fileSegement.pdf
    done
done
