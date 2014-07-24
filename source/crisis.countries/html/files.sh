ls -1 *.html > files-ls.txt
grep 'load(' ../js/*.js | cut -d "'" -f 2 | sed s%html/%% | sort > files-js.txt
echo "diff files-js.txt files-ls.txt"
diff files-js.txt files-ls.txt
