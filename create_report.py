import os
import shutil
import random
import inspect
from datetime import datetime

from pyPdf import PdfFileWriter, PdfFileReader

from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.lib.units import inch, cm

from tempfile import NamedTemporaryFile

score_xy = {
    'team_number': (120, 755),
    'team_name': (211, 755),
    'student_names': (120, 730),
    'final_score': (525, 730),

    '6.g.iv': (534.5, 702),
    '6.g.v': (534.5, 672),
    '2.a.b': (535.5, 644),
    '2.c': (535.5, 616),
    '2.d': (535.5, 597),
    '2.e': (535.5, 580),
    '2.f': (535.5, 562),
    '2.g': (535.5, 534),
    'checkin': (532, 483),
    '5.g': (534, 450),
    '6.a.i': (534, 423),
    '6.a.ii': (534, 405),
    '6.a.iii': (534, 388),
    '6.a.iv': (534, 371),

    'lego_c': (228, 310),
    'ping_c': (228, 291),
    'battery_c': (228, 272),
    'tennis_c': (228, 253),
    'lego_d': (228, 234),
    'ping_d': (228, 215),
    'battery_d': (228, 196),
    'tennis_d': (228, 177),

    'jug_c': (338, 310),
    'jug_d': (497, 310),

    '6.c': (543, 160),
    '6.d': (537, 140),
    '6.f.1': (543, 115),
    '6.f.2': (543, 98),
    'other': (537, 68),
}

def get_file_template():
    return os.path.join('/Users/cparks/Dropbox/Robocross/scoring' , 'report_template.png')

def circle_yes(pdf, key):
    pdf.circle(score_xy[key][0], score_xy[key][1], 8, stroke=1, fill=0)

def circle_no(pdf, key):
    pdf.circle(score_xy[key][0] + 27, score_xy[key][1], 8, stroke=1, fill=0)

def test():
    report_name = NamedTemporaryFile(mode='w+t', suffix='.pdf', delete=False)
    pdf = canvas.Canvas(report_name.name)
    pdf.setFont("Helvetica", 34)
    pdf.drawImage(get_file_template(), 0, 0, 600, 850)

    #pdf.drawString( 50, 50, "TEST" )
    for k, v in score_xy.items():
        circle_yes(pdf, k)
        circle_no(pdf, k)
    pdf.save()
    return report_name.name

if __name__ == '__main__':
    shutil.move( test(), "/Users/cparks/Dropbox/Robocross/scoring/test.pdf" )
