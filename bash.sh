#!/bin/bash

#---------------------------------------------#
#
##VARIABLES
#
BGCOLOR="#f6f6f6" #Background color to use when flattening transparent areas of png
thumbnail='185'  #THUMBNAIL IMAGE WIDTH
medium='650' #MEDIUM IMAGE WIDTH
large='1000' #LARGE IMAGE WIDTH
#---------------------------------------------#

cd img/portfolio 	#change directory to exicute script in uncompressed folder
mkdir .tmp;     	#making temp derectory
mkdir compressed;   #making compressed derectory so new images have a place to go

#Thumbnails
thumb=`ls | grep '_thumb'` && cp $thumb .tmp/; #grabs file by special filename info and moves them over to temp file
mogrify -format jpg -filter Triangle -define filter:support=2 -thumbnail $thumbnail -quality 100 -unsharp 0.25x0.08+8.3+0.045 -dither None -define jpeg:fancy-upsampling=off -interlace plane -colorspace sRGB -background $BGCOLOR -flatten -path .tmp/ .tmp/*.png
mv .tmp/*.jpg .tmp/../compressed/;

#Thumbnails _2x
filelist=`ls .tmp/`;
for image_file in $filelist
do
inname=`convert $image_file -format "%[base]" info:`
convert $image_file -set filename:mysize 2x .tmp/${inname}_%[filename:mysize].jpg
done
mogrify -format jpg -filter Triangle -define filter:support=2 -thumbnail $(($thumbnail * 2)) -quality 100 -unsharp 0.25x0.08+8.3+0.045 -dither None -define jpeg:fancy-upsampling=off -interlace plane -colorspace sRGB -background $BGCOLOR -flatten -path .tmp/ .tmp/*_2x.jpg
mv .tmp/*.jpg .tmp/../compressed/; rm -R .tmp/*.png;

# #Medium
med=`ls | grep '_md'` && cp $med .tmp/;
mogrify -format jpg -filter Triangle -define filter:support=2 -thumbnail $medium -quality 100 -unsharp 0.25x0.08+8.3+0.045 -dither None -define jpeg:fancy-upsampling=off -interlace plane -colorspace sRGB -background $BGCOLOR -flatten -path .tmp/ .tmp/*.png
mv .tmp/*.jpg .tmp/../compressed/;

#Medium _2x
filelist=`ls .tmp/`;
for image_file in $filelist
do
inname=`convert $image_file -format "%[base]" info:`
convert $image_file -set filename:mysize 2x .tmp/${inname}_%[filename:mysize].jpg
done
mogrify -format jpg -filter Triangle -define filter:support=2 -thumbnail $(($medium * 2)) -quality 100 -unsharp 0.25x0.08+8.3+0.045 -dither None -define jpeg:fancy-upsampling=off -interlace plane -colorspace sRGB -background $BGCOLOR -flatten -path .tmp/ .tmp/*_2x.jpg
mv .tmp/*.jpg .tmp/../compressed/; rm -R .tmp/*.png;

# #Large
lg=`ls | grep '_lg'` && cp $lg .tmp/;
mogrify -format jpg -filter Triangle -define filter:support=2 -thumbnail $large -quality 100 -unsharp 0.25x0.08+8.3+0.045 -dither None -define jpeg:fancy-upsampling=off -interlace plane -colorspace sRGB -background $BGCOLOR -flatten -path .tmp/ .tmp/*.png
mv .tmp/*.jpg .tmp/../compressed/;

#Large _2x
filelist=`ls .tmp/`;
for image_file in $filelist
do
inname=`convert $image_file -format "%[base]" info:`
convert $image_file -set filename:mysize 2x .tmp/${inname}_%[filename:mysize].jpg
done
mogrify -format jpg -filter Triangle -define filter:support=2 -thumbnail $(($large * 2)) -quality 100 -unsharp 0.25x0.08+8.3+0.045 -dither None -define jpeg:fancy-upsampling=off -interlace plane -colorspace sRGB -background $BGCOLOR -flatten -path .tmp/ .tmp/*_2x.jpg
mv .tmp/*.jpg .tmp/../compressed/; rm -R .tmp/*.png;
echo 'Completed Successfully';
rm -R .tmp; #removes temp directory