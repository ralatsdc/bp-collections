
import codecs

from authors.BluPenAuthor import BluPenAuthor
from authors.FeedAuthor import FeedAuthor
from authors.TumblrAuthor import TumblrAuthor

config_file = "/Users/raymondleclair/Projects/Blue-Peninsula/bp-content/blu-pen/authors/BluPenAuthor.cfg"

bpa = BluPenAuthor(config_file)

source_url = "http://www.hrc.co.nz/feed/"
content_dir = "/Users/raymondleclair/Projects/Blue-Peninsula/bp-content/content/authors/feed"

fa = FeedAuthor(bpa, source_url, content_dir)
fa.load()

subdomain = "actism.tumblr.com"
content_dir = "/Users/raymondleclair/Projects/Blue-Peninsula/bp-content/content/authors/tumblr"

ta = TumblrAuthor(bpa, subdomain, content_dir)
ta.load()

def get_html(html_file_name):
    html_file = codecs.open(html_file_name, encoding='utf-8', mode='r')
    html = html_file.readlines()
    html_file.close()
    return html

beg_html_html = get_html("beg-html.html")
beg_head_html = get_html("beg-head.html")
end_head_html = get_html("end-head.html")
beg_body_html = get_html("beg-body.html")
end_body_html = get_html("end-body.html")
end_html_html = get_html("end-html.html")

html_file = codecs.open("../index-2.html", encoding='utf-8', mode='w')

html_file.writelines(beg_html_html)

html_file.writelines(beg_head_html)
html_file.writelines(end_head_html)

html_file.writelines(beg_body_html)

for i_con in range(10):
    html_file.write('      <div class="row">\n')
    html_file.write('        <div class="one-third column">\n')
    html_file.write('          ' + fa.entries[i_con]['content'][0]['value'] + '\n')
    html_file.write('        </div>\n')
    html_file.write('        <div class="one-third column">\n')
    url = ta.posts[i_con]['photos'][0]['alt_sizes'][1]['url']
    html_file.write('          <img alt="" class="" src="{0}" title="" height="" width="" />'.format(url))
    html_file.write('        </div>\n')
    html_file.write('        <div class="one-third column">\n')
    url = ta.posts[10 + i_con]['photos'][0]['alt_sizes'][1]['url']
    html_file.write('          <img alt="" class="" src="{0}" title="" height="" width="" />'.format(url))
    html_file.write('        </div>\n')
    html_file.write('      </div>\n')

html_file.writelines(end_body_html)
html_file.writelines(end_html_html)

html_file.close()
