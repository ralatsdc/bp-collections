#!/bin/bash

# Print usage.
usage() {
    cat << EOF

NAME
     deploy_collections -- deploy collections to server content directory

SYNOPSIS
     deploy_collections [-s server] [-d directory]

DESCRIPTION
     Deploy blu-pen and crisis-countries single page web applications,
     and crisis-countries collection and source documents to an Nginx
     server content directory.
 
OPTIONS
     -s     Nginx server, default is "bp-static"

     -d     Nginx content directory, default is "nginx_content"

EOF
}

# Parse command line options.
NGINX_SERVER="bp-static"
NGINX_CONTENT="nginx_content"
while getopts ":hs:d:" opt; do
    case $opt in
	h)
	    usage
	    exit 0
	    ;;
        s)
            NGINX_SERVER=$OPTARG
            ;;
        d)
            NGINX_CONTENT=$OPTARG
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

# Copy blu-pen and crisis-countries single page web applications to
# Nginx host content directory, and update host value in
# initialization object
BP_APPLICATION_SRC="blu-pen crisis-countries"
BP_APPLICATION_DST="$NGINX_SERVER:$NGINX_CONTENT"
for SRC in $BP_APPLICATION_SRC; do
    rsync -rpt $SRC \
          --exclude=blu-pen/json --links --safe-links \
          $BP_APPLICATION_DST
    rsync -rpt update_host_value.sh \
          $BP_APPLICATION_DST/$SRC
    ssh $NGINX_SERVER "cd $NGINX_CONTENT/$SRC; ./update_host_value.sh"
done

# Copy crisis-countries collection documents
BP_CRISIS_COLLECTION_SRC="../../bp-content/content/collection/crisis"
BP_CRISIS_COLLECTION_DST="bp-static:nginx_content/crisis-countries/json/collection"
find $BP_CRISIS_COLLECTION_SRC -name "*.json" \
    | sed s%$BP_CRISIS_COLLECTION_SRC/%% > .src
rsync -rpt --files-from=.src $BP_CRISIS_COLLECTION_SRC $BP_CRISIS_COLLECTION_DST
rm .src

# Copy crisis-countries source documents
BP_CRISIS_SOURCE_SRC="../../bp-content/content/author"
BP_CRISIS_SOURCE_DST="bp-static:nginx_content/crisis-countries/json/source"
find $BP_CRISIS_SOURCE_SRC -name "*.json" \
    | sed s%$BP_CRISIS_SOURCE_SRC/%% > .src
rsync -rpt --files-from=.src $BP_CRISIS_SOURCE_SRC $BP_CRISIS_SOURCE_DST
rm .src
