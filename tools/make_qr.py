"""발표 자료에 넣는 QR 그림을 만든다.

    python tools/make_qr.py https://github.com/hwlee-dh/aleph qr-aleph
    python tools/make_qr.py https://github.com/hwlee-dh/aleph-demo qr-demo

OpenCV 가 있어야 한다. 만든 그림을 다시 읽어 같은 주소가 나오는지 확인한 뒤 assets/이름.png 에 쓴다.
"""
import pathlib
import sys

import cv2

url = sys.argv[1]
name = sys.argv[2]
code = cv2.QRCodeEncoder.create().encode(url)
big = cv2.resize(code, None, fx=16, fy=16, interpolation=cv2.INTER_NEAREST)
big = cv2.copyMakeBorder(big, 32, 32, 32, 32, cv2.BORDER_CONSTANT, value=255)
read, _, _ = cv2.QRCodeDetector().detectAndDecode(big)
if read != url:
    sys.exit('다시 읽은 주소가 다릅니다: ' + repr(read))
out = pathlib.Path(__file__).resolve().parent.parent / 'assets' / (name + '.png')
ok, data = cv2.imencode('.png', big)
out.write_bytes(data.tobytes())
print(out.name, big.shape[1], 'x', big.shape[0], '→', read)
