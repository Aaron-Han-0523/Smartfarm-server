
from pdf2image import convert_from_path, convert_from_bytes
images = convert_from_path('./sampleDrawing.pdf')

images[0].save('page_1.jpg')