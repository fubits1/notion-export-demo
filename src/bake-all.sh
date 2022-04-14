#!/bin/bash
for dir in output/*/ # list subdirectories
do
    echo $dir
    for file in $dir*.md # only for markdown files
    do
        fileSegement=${file%*.md} # drop extension
        echo $file # full path
        echo $fileSegement # path w/o extension
        pandoc $file -o $fileSegement.docx
        pandoc $file -o $fileSegement.pandoc.pdf
        pandoc $file -o $fileSegement.html # for pagedjs
        pagedjs-cli $fileSegement.html -o $fileSegement.pagedjs.pdf
    done
done
