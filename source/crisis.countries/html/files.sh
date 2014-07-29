ls -1 *.html > files-ls.txt
grep 'load(' ../js/*.js | cut -d "'" -f 2 | grep html | sed s%html/%% | sort | uniq > files-js.txt
echo "diff files-js.txt files-ls.txt"
diff files-js.txt files-ls.txt
