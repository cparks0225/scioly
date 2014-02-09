from flask import Flask
from flask import render_template
from flask import jsonify
import os
import json
from datetime import datetime
from flask.ext.restful import reqparse
from pprint import pprint

app = Flask(__name__)

parser = reqparse.RequestParser()
parser.add_argument('robot_zone', type=int)

parser.add_argument('lego_zone_d', type=int)
parser.add_argument('ping_zone_d', type=int)
parser.add_argument('battery_zone_d', type=int)
parser.add_argument('tennis_zone_d', type=int)

parser.add_argument('lego_zone_c', type=int)
parser.add_argument('ping_zone_c', type=int)
parser.add_argument('battery_zone_c', type=int)
parser.add_argument('tennis_zone_c', type=int)

parser.add_argument('jug_zone', type=str)
parser.add_argument('jug_orientation', type=int)

parser.add_argument('lego_jug', type=int)
parser.add_argument('ping_jug', type=int)
parser.add_argument('battery_jug', type=int)
parser.add_argument('tennis_jug', type=int)

parser.add_argument('operator_1', type=str)
parser.add_argument('operator_2', type=str)
parser.add_argument('time', type=str)

parser.add_argument('total', type=int)

RESULTS_LOCATION = '/Users/cparks/Dropbox/Robocross/scoring/results/'

def DumpResult(data):
    file_name = "{}.json".format(datetime.now().strftime('%Y.%m.%d_%H.%M.%S'))
    with open("{0}{1}".format(RESULTS_LOCATION, file_name), 'w') as outfile:
        json.dump(data, outfile)

def LoadResult(file_name):
    json_loaded = json.load(open(os.path.join(RESULTS_LOCATION, file_name)))
    json_converted = {
        u"run_date":file_name[0:10].replace('.', '/'),
        u"run_start":file_name[11:19].replace('.', ':')
    }
    for k, v in json_loaded.items():
        json_converted[k] = 0 if v == None else v
    return json_converted

def LoadResults():
    results = []
    for dirName, subdirList, fileList in os.walk(RESULTS_LOCATION):
        for f in fileList:
            if f.find('.json') > -1:
                results.append(LoadResult(f))
    sorted_results = sorted(results, key=lambda k: k['total'], reverse=True)
    return sorted_results

@app.route('/')
def main_page():
    return render_template('index.html')

@app.route('/results', methods=['POST'])
def result():
    request_data = parser.parse_args()
    DumpResult(request_data)
    return jsonify(success=True)

@app.route('/results', methods=['GET'])
def result_set():
    results = LoadResults()
    return render_template('results.html', results=results)

if __name__ == '__main__':
    app.run()
