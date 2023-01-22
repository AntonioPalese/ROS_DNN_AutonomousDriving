#!/usr/bin/python3
import sys, os
sys.path.append(os.path.dirname("/home/ubuntu/ros_ws/src/lane_detector/models"))
sys.path.append(os.path.dirname("/home/ubuntu/ros_ws/src/lane_detector/utils"))

import rospy
from sensor_msgs.msg import Image
import cv2
from cv_bridge import CvBridge
import os
from models.network import parsingNet
from utils.utilities import get_cfg
from geometry_msgs.msg._Point import Point
import torchvision.transforms as t
import torch
from lane_msgs.msg import Lanes


class camera_checking:
    def __init__(self):
        sub_topic_name = "/prius/front_camera/image_raw"
        pub_topic_name = "/prius/front_camera/detected_lines"
        self.path = "/home/ubuntu/image_frames"  
        self.seq = 1   
        self.cfg = get_cfg("/home/ubuntu/ros_ws/src/lane_detector/configurations/configuration.yaml")
        self.model = parsingNet(self.cfg).cuda(self.cfg.model.device)
        self.model.load_state_dict(torch.load("/home/ubuntu/ros_ws/src/lane_detector/state_dicts/ep333_best.pth", map_location='cpu')['model'])  
        self.model.eval()
        

        if not os.path.exists(self.path):
            os.makedirs(self.path)        

        self.queue = []
        self.number_subscriber = rospy.Subscriber(sub_topic_name, Image, callback=self.camera_cb)
        self.lane_publisher = rospy.Publisher(pub_topic_name, Lanes, queue_size=1)
        self.bridge = CvBridge()


    def generate_lines(self,out, shape, griding_num, localization_type='abs', flip_updown=False):
        import numpy as np
        from scipy import special

        col_sample = np.linspace(0, shape[1] - 1, griding_num)
        col_sample_w = col_sample[1] - col_sample[0]

        for j in range(out.shape[0]):
            out_j = out[j].data.cpu().numpy()
            if flip_updown:
                out_j = out_j[:, ::-1, :]
            if localization_type == 'abs':
                out_j = np.argmax(out_j, axis=0)
                out_j[out_j == griding_num] = -1
                out_j = out_j + 1
            elif localization_type == 'rel':
                prob = special.softmax(out_j[:-1, :, :], axis=0)
                idx = np.arange(griding_num) + 1
                idx = idx.reshape(-1, 1, 1)
                loc = np.sum(prob * idx, axis=0)
                out_j = np.argmax(out_j, axis=0)
                loc[out_j == griding_num] = 0
                out_j = loc
            else:
                raise NotImplementedError
        
            lines = []
            
            for i in range(out_j.shape[1]):
                lines.append([])
                if np.sum(out_j[:, i] != 0) > 2:
                    for k in range(out_j.shape[0]):                        
                        if out_j[k, i] > 0:                            
                                lines[-1].append(Point(x=int(out_j[k, i] * col_sample_w * 1640 / 800) - 1, y=int(590 - k * 20) - 1, z=0))

            return lines
                    
                
    def _detect(self, batch):
        with torch.no_grad():
            out = self.model(batch)

        lines = self.generate_lines(out,(288,800),200,localization_type = 'rel',flip_updown = True )

        #print(lines)

        return lines
            
           

        

    def _load(self, queue):

        img_transforms = t.Compose([
            t.ToPILImage(),
            t.Resize((288, 800)),
            t.ToTensor(),
            t.Normalize((0.485, 0.456, 0.406), (0.229, 0.224, 0.225)),
        ])

        seqence = torch.zeros(size=(1, 3, 288, 800))

        for img in queue:
            img = img_transforms(img)            
            img = torch.unsqueeze(img, dim=0)
            
            seqence = torch.cat(tensors=(seqence, img), dim=0)
        
        seqence = seqence[1:]
        batch = torch.unsqueeze(seqence, dim=0)
        batch = batch.cuda(0)
        


        return batch              



    def camera_cb(self, data):
        frame = self.bridge.imgmsg_to_cv2(data) 
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)     

        self.queue.append(frame)

        
       
        if (len(self.queue)) == 3:
            batch = self._load(self.queue)
            lines = self._detect(batch)
            #frame = self.display(frame, lines)
            del self.queue[0]
            command = Lanes()
            command.line1 = lines[0]
            command.line2 = lines[1]
            command.line3 = lines[2]
            command.line4 = lines[3]
            self.lane_publisher.publish(command)
            #cv2.imwrite(f"/home/apalese/image_frames/frame{self.seq}.jpg", frame)
            
            
          
        self.seq+=1

        


if __name__ == "__main__":

    node_name = "lane_detecor"

    rospy.init_node(node_name)
    camera_checking()
    rospy.spin()