
import argparse
import matplotlib.pyplot as plt
import cv2
import os
from ObjectRemove import ObjectRemove
from models.deepFill import Generator
from torchvision.models.detection import maskrcnn_resnet50_fpn, MaskRCNN_ResNet50_FPN_Weights

def remove_object(image):
    ######################################
    # creating Mask-RCNN model and load pretrained weights #
    ######################################
    for f in os.listdir('D:\\react\\server\\models'):
        if f.endswith('.pth'):
            deepfill_weights_path = os.path.join('D:\\react\\server\\models', f)

    print("Creating rcnn model")
    weights = MaskRCNN_ResNet50_FPN_Weights.DEFAULT
    transforms = weights.transforms()
    rcnn = maskrcnn_resnet50_fpn(weights=weights, progress=False)
    rcnn = rcnn.eval()

    #########################
    # create inpainting model #
    #########################
    print('Creating deepfill model')
    deepfill = Generator(checkpoint=deepfill_weights_path, return_flow=True)

    ######################
    # create ObjectRemove #
    ######################
    model = ObjectRemove(segmentModel=rcnn,
                         rcnn_transforms=transforms,
                         inpaintModel=deepfill,
                         image_path=image)

    #####
    # run #
    #####
    output = model.run()

    #################
    # display results #
    #################
    img = cv2.cvtColor(model.image_orig[0].permute(1, 2, 0).numpy(), cv2.COLOR_RGB2BGR)
    boxed = cv2.rectangle(img, (model.box[0], model.box[1]), (model.box[2], model.box[3]), (0, 255, 0), 2)
    boxed = cv2.cvtColor(boxed, cv2.COLOR_BGR2RGB)

    # fig, axs = plt.subplots(1, 3, layout='constrained')
    # axs[0].imshow(boxed)
    # axs[0].set_title('Original Image Bounding Box')
    # axs[1].imshow(model.image_masked.permute(1, 2, 0).detach().numpy())
    # axs[1].set_title('Masked Image')
    # axs[2].imshow(output)
    # axs[2].set_title('Inpainted Image')
    # plt.show()
    
    filename = 'output_image.png'

    cv2.imwrite(filename, output)
    
    return cv2.imread(filename)

# Example usage:
# image_path = "D:\\react\\server\\image\\bikes.jpg"
# result = remove_object(image_path)
# output_image = cv2.imread(result)
# fig, axs = plt.subplots(1, 1, layout='constrained')
# axs.imshow(output_image)
# axs.set_title('Inpainted Image')
# plt.show()
