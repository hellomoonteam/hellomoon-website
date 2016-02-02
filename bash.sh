#!/bin/bash

#---------------------------------------------#
#
# VARIABLES
#
BGCOLOR="#f6f6f6" #Background color to use when flattening transparent areas of png
thumbnail='185'   #Thumbnail image width
medium='650' 	  #Medium image width
large='1000' 	  #Large image width
imageDirectoryPath='./img/portfolio' 					   #Path to image directory which will be compressed
moveToCompressedFolder='mv .tmp/*.jpg .tmp/../compressed/' #Move compressed images to compressed folder
clearTempFolder='rm -R .tmp/*.png' 						   #Clearout temp folder after each process is complete
#---------------------------------------------#

cd $imageDirectoryPath 	#change directory to exicute script in uncompressed folder
mkdir .tmp;     	#making temp derectory
mkdir compressed;   #making compressed derectory so new images have a place to go

#Thumbnails
thumb=`ls | grep '_thumb'` && cp $thumb .tmp/; #grabs file by special filename info and moves them over to temp file
mogrify -format jpg -filter Triangle -define filter:support=2 -thumbnail $thumbnail -quality 100 -unsharp 0.25x0.08+8.3+0.045 -dither None -define jpeg:fancy-upsampling=off -interlace plane -colorspace sRGB -background $BGCOLOR -flatten -path .tmp/ .tmp/*.png
$moveToCompressedFolder;

#Thumbnails _2x
filelist=`ls .tmp/`;
for image_file in $filelist
do
inname=`convert $image_file -format "%[base]" info:`
convert $image_file -set filename:mysize 2x .tmp/${inname}_%[filename:mysize].jpg
done
mogrify -format jpg -filter Triangle -define filter:support=2 -thumbnail $(($thumbnail * 2)) -quality 100 -unsharp 0.25x0.08+8.3+0.045 -dither None -define jpeg:fancy-upsampling=off -interlace plane -colorspace sRGB -background $BGCOLOR -flatten -path .tmp/ .tmp/*_2x.jpg
$moveToCompressedFolder; $clearTempFolder;

#Medium
med=`ls | grep '_md'` && cp $med .tmp/;
mogrify -format jpg -filter Triangle -define filter:support=2 -thumbnail $medium -quality 100 -unsharp 0.25x0.08+8.3+0.045 -dither None -define jpeg:fancy-upsampling=off -interlace plane -colorspace sRGB -background $BGCOLOR -flatten -path .tmp/ .tmp/*.png
$moveToCompressedFolder;

#Medium _2x
filelist=`ls .tmp/`;
for image_file in $filelist
do
inname=`convert $image_file -format "%[base]" info:`
convert $image_file -set filename:mysize 2x .tmp/${inname}_%[filename:mysize].jpg
done
mogrify -format jpg -filter Triangle -define filter:support=2 -thumbnail $(($medium * 2)) -quality 100 -unsharp 0.25x0.08+8.3+0.045 -dither None -define jpeg:fancy-upsampling=off -interlace plane -colorspace sRGB -background $BGCOLOR -flatten -path .tmp/ .tmp/*_2x.jpg
$moveToCompressedFolder; $clearTempFolder;

# #Large
lg=`ls | grep '_lg'` && cp $lg .tmp/;
mogrify -format jpg -filter Triangle -define filter:support=2 -thumbnail $large -quality 100 -unsharp 0.25x0.08+8.3+0.045 -dither None -define jpeg:fancy-upsampling=off -interlace plane -colorspace sRGB -background $BGCOLOR -flatten -path .tmp/ .tmp/*.png
$moveToCompressedFolder;

#Large _2x
filelist=`ls .tmp/`;
for image_file in $filelist
do
inname=`convert $image_file -format "%[base]" info:`
convert $image_file -set filename:mysize 2x .tmp/${inname}_%[filename:mysize].jpg
done
mogrify -format jpg -filter Triangle -define filter:support=2 -thumbnail $(($large * 2)) -quality 100 -unsharp 0.25x0.08+8.3+0.045 -dither None -define jpeg:fancy-upsampling=off -interlace plane -colorspace sRGB -background $BGCOLOR -flatten -path .tmp/ .tmp/*_2x.jpg
$moveToCompressedFolder; $clearTempFolder;

echo 'Completed Successfully';

rm -R .tmp; #removes temp directory