import socket
from flask import Flask, request, send_file
from PIL import Image
import io
import os
from flask_cors import CORS
from processImage import convertToBlack
from main import remove_object
# from stitched import image_stitched
import matplotlib.pyplot as plt
import numpy as np
import cv2



app = Flask(__name__)
CORS(app)

@app.route('/upload', methods=['POST'])
def image_stitching():

    files = request.files.getlist('image')
    stitched_images = []
    for file in files:
        # Open the image file using PIL
        image = Image.open(file)
        img_np = np.array(image)
        stitched_images.append(img_np)
    stitcher = cv2.Stitcher.create()
    (res, output) = stitcher.stitch(stitched_images)
    
    if res == cv2.STITCHER_OK:
        plt.imsave("D:/react/server/image/result.jpg", output)
    else:
        # Xử lý trường hợp khi quá trình ghép ảnh không thành công
        print("Error while stitching images")
        return "None"
    
    pil_image = Image.fromarray(output)
    
    # pil_image = Image.fromarray(result_image_path)
    imagePath = io.BytesIO()
    pil_image.save(imagePath,'jpeg')
    imagePath.seek(0)

    return send_file(imagePath, mimetype='image/png')
    
   

@app.route('/remove', methods=['POST'])
def remove_object_route():
    # stitched_image_path = 'server/results/mergeImage.jpg' #Thay đổi đường dẫn đến tệp
    stitched_image_path = 'server/image/result.jpg'
    

    # Process the image
    result_image = remove_object(stitched_image_path)
    
    pil_image = Image.fromarray(result_image)

   # Create a BytesIO object to store the image data
    img_io = io.BytesIO()

    # Save the PIL Image to the BytesIO object as PNG
    pil_image.save(img_io, format='PNG')

    # Set the file position of the BytesIO object to the beginning
    img_io.seek(0)

    # Return the BytesIO object as a file response
    return send_file(img_io, mimetype='image/png')

# if __name__ == '__main__':
#     hostname = socket.gethostname()
#     ip = socket.gethostbyname(hostname)
#     app.run(port=5000, debug=True, host=ip)

if __name__ == '__main__':
    app.run(port=5000, debug=True, host='localhost')