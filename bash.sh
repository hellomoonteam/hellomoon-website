#!/bin/bash

BGCOLOR="#f6f6f6" #Background color to use when flattening transparent areas of png

cd img/portfolio/uncompressed  #change directory to exicute script in uncompressed folder
mkdir .tmp     #making temp derectory

#Thumbnails
thumb=`ls | grep '_thumb[^_]'` && cp $thumb .tmp/ #grabs file by special filename info and moves them over to temp file
mogrify -format jpg -filter Triangle -define filter:support=2 -thumbnail 185 -quality 100 -unsharp 0.25x0.08+8.3+0.045 -dither None -define jpeg:fancy-upsampling=off -interlace plane -colorspace sRGB -background $BGCOLOR -flatten -path .tmp/ .tmp/*.*
mv .tmp/*.jpg .tmp/../../compressed/; rm -R .tmp/*; #moves converted files and then deletes the origingal

thumb2x=`ls | grep '_thumb_2x'` && cp $thumb2x .tmp/
mogrify -format jpg -filter Triangle -define filter:support=2 -thumbnail 370 -quality 100 -unsharp 0.25x0.08+8.3+0.045 -dither None -define jpeg:fancy-upsampling=off -interlace plane -colorspace sRGB -background $BGCOLOR -flatten -path .tmp/ .tmp/*.*
mv .tmp/*.jpg .tmp/../../compressed/; rm -R .tmp/*;

#Medium
med=`ls | grep '_md[^_]'` && cp $med .tmp/
mogrify -format jpg -filter Triangle -define filter:support=2 -thumbnail 650 -quality 95 -unsharp 0.25x0.08+8.3+0.045 -dither None -define jpeg:fancy-upsampling=off -interlace plane -colorspace sRGB -background $BGCOLOR -flatten -path .tmp/ .tmp/*.*
mv .tmp/*.jpg .tmp/../../compressed/; rm -R .tmp/*;

med2x=`ls | grep '_md_2x'` && cp $med2x .tmp/
mogrify -format jpg -filter Triangle -define filter:support=2 -thumbnail 1300 -quality 95 -unsharp 0.25x0.08+8.3+0.045 -dither None -define jpeg:fancy-upsampling=off -interlace plane -colorspace sRGB -background $BGCOLOR -flatten -path .tmp/ .tmp/*.*
mv .tmp/*.jpg .tmp/../../compressed/; rm -R .tmp/*;

#Large
lg=`ls | grep '_lg[^_]'` && cp $lg .tmp/
mogrify -format jpg -filter Triangle -define filter:support=2 -thumbnail 1000 -quality 95 -unsharp 0.25x0.08+8.3+0.045 -dither None -define jpeg:fancy-upsampling=off -interlace plane -colorspace sRGB -background $BGCOLOR -flatten -path .tmp/ .tmp/*.*
mv .tmp/*.jpg .tmp/../../compressed/; rm -R .tmp/*;

lg2x=`ls | grep '_lg_2x'` && cp $lg2x .tmp/
mogrify -format jpg -filter Triangle -define filter:support=2 -thumbnail 2000 -quality 95 -unsharp 0.25x0.08+8.3+0.045 -dither None -define jpeg:fancy-upsampling=off -interlace plane -colorspace sRGB -background $BGCOLOR -flatten -path .tmp/ .tmp/*.*
mv .tmp/*.jpg .tmp/../../compressed/; rm -R .tmp/*;

rm -R .tmp #removes temp directory