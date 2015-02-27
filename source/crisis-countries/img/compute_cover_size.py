#!/opt/local/bin/python
from xml.dom import minidom
import sys

if len(sys.argv) != 2:
    print 'svg file name required'
    sys.exit(1)
    
svg_file = sys.argv[1]

doc = minidom.parse(svg_file)

cx = [float(circle.getAttribute('cx')) for circle in doc.getElementsByTagName('circle')]
cy = [float(circle.getAttribute('cy')) for circle in doc.getElementsByTagName('circle')]
r = [float(circle.getAttribute('r')) for circle in doc.getElementsByTagName('circle')]
s = [float('0' if circle.getAttribute('stroke-width') == '' else circle.getAttribute('stroke-width')) for circle in doc.getElementsByTagName('circle')]

vx0 = float('Inf')
vx1 = -float('Inf')

vy0 = float('Inf')
vy1 = -float('Inf')

for i in range(len(cx)):

    cx0 = cx[i] - r[i] - s[i] / 2
    if cx0 < vx0:
        vx0 = cx0

    cx1 = cx[i] + r[i] + s[i] / 2
    if cx1 > vx1:
        vx1 = cx1

    cy0 = cy[i] - r[i] - s[i] / 2
    if cy0 < vy0:
        vy0 = cy0

    cy1 = cy[i] + r[i] + s[i] / 2
    if cy1 > vy1:
        vy1 = cy1

print 'viewBox="{0} {1} {2} {3}">'.format(vx0, vy0, vx1 - vx0, vy1 - vy0)

doc.unlink()
