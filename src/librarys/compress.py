from kecilin import Kecilin
import json,sys

datanode = json.loads(sys.argv[1])

kecil = Kecilin(output_path=datanode['directory'])

compress = kecil.start(filename=datanode['fileorigin'])

if compress :
    message = {"success": "true", "message": "Successfully", "filepath": compress.filepath, "filename": datanode['filename'], "filetype": datanode['filetypedata']}
    print(json.dumps(message))
else:
    message = {"success": "false", "filename": datanode['filename'], "message": "something wrong"}
    print(json.dumps(message))