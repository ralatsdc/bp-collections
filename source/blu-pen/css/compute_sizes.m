
scales = [0.7935, 0.4838, 0.6774];

nScl = length(scales);
for iScl = 1:nScl

  lines{iScl} = fileread('compute_sizes.txt');

  [tokens, matches] = regexp(lines{iScl}, '<(\d*)>', 'tokens', 'match');

  sizes = unique(cat(1, tokens{:}));

  nSz = length(sizes);
  for iSz = 1:nSz

    size_str = sizes{iSz};
    size_num = round(str2num(size_str) * scales(iScl));

    lines{iScl} = regexprep(lines{iScl}, ['<', sizes{iSz}, '>'], sprintf('%d', size_num));

  end % for

end % for

for iScl = 1:nScl

  scales(iScl)
  
  lines{iScl}

  pause;

end % for
