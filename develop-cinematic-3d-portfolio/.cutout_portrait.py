from pathlib import Path
import cv2
import numpy as np

source = Path("public/images/Kimsang setengah badan background kosong.png")
target = Path("public/images/kimsang-about-cutout.png")
image = cv2.imread(str(source), cv2.IMREAD_COLOR)
rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
white_background = ((rgb.min(axis=2) > 215) & ((rgb.max(axis=2) - rgb.min(axis=2)) < 45)).astype(np.uint8)
component_count, labels, stats, _ = cv2.connectedComponentsWithStats(white_background, 8)
border_labels = np.unique(np.concatenate((labels[0], labels[-1], labels[:, 0], labels[:, -1])))
border_labels = border_labels[border_labels > 0]
background = np.isin(labels, border_labels)
foreground = (~background).astype(np.uint8) * 255
alpha = cv2.GaussianBlur(foreground, (0, 0), 1.1)
ys, xs = np.where(alpha > 8)
padding = 48
left = max(0, int(xs.min()) - padding)
top = max(0, int(ys.min()) - padding)
right = min(image.shape[1], int(xs.max()) + padding + 1)
bottom = min(image.shape[0], int(ys.max()) + padding + 1)
alpha = alpha[top:bottom, left:right]
color = image[top:bottom, left:right].astype(np.float32)
a = alpha.astype(np.float32) / 255.0
edge = (a > 0.02) & (a < 0.98)
for channel in range(3):
    value = color[:, :, channel]
    value[edge] = np.clip((value[edge] - 255.0 * (1.0 - a[edge])) / a[edge], 0, 255)
    color[:, :, channel] = value
cutout = np.dstack((color.clip(0, 255).astype(np.uint8), alpha))
cv2.imwrite(str(target), cutout)
print(f"Created {target}: {right-left}x{bottom-top}; alpha={int(alpha.min())}..{int(alpha.max())}")
