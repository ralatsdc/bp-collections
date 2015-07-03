#!/bin/bash

# Print usage.
usage() {
    cat << EOF

NAME
     update_host_value -- update host value in initialization object

SYNOPSIS
     update_host_value [-v value]

DESCRIPTION
     Update the host value in the object passed to the single page web
     application shell initialization function.
 
OPTIONS
     -v     host value, default is "bp-static"

EOF
}

# Parse command line options.
VALUE="bp-static"
while getopts ":hv:" opt; do
    case $opt in
	h)
	    usage
	    exit 0
	    ;;
        v)
            VALUE=$OPTARG
            ;;
	\?)
	    echo "Invalid option: -$OPTARG" >&2
	    usage
	    exit 1
	    ;;
	\:)
	    echo "Option -$OPTARG requires an argument." >&2
	    usage
	    exit 1
	    ;;
    esac
done

# Parse command line arguments.
shift `expr $OPTIND - 1`
if [ "$#" -gt 0 ]; then
    echo "Ignoring unused command line arguments"
fi

# Exit immediately if a simple command exits with a non-zero status
set -e

# Update host value in initialization object
files=`ls *.html`
for file in $files; do
    cp $file .html
    sed s/localhost:8080/$VALUE/ .html > $file
done
rm .html
