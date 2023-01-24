#!/usr/bin/python3
import sys, os
import rospy
import cv2
import os
from lane_msgs.msg import Lanes
from geometry_msgs.msg._Point import Point
from prius_msgs.msg import Control
from cv_bridge import CvBridge
import numpy as np
import math

class lane_control:
    def __init__(self):
        sub_topic_name = "/prius/front_camera/detected_lines"
        pub_topic_name = "prius"    
        self.path = "/home/ubuntu/image_frames"  
        self.seq = 1   
        self.num_val_y = (315, 420, 525)  
        self.ref_line = ([int(1640/2) for _ in range(int(590/2) + 20, 590, 5)], [y for y in range(int(590/2) + 20, 590, 5)])  


        if not os.path.exists(self.path):
            os.makedirs(self.path) 


        self.bridge = CvBridge()
        
        self.lane_subscriber = rospy.Subscriber(sub_topic_name, Lanes, callback=self.lane_callback)
        self.lane_publisher = rospy.Publisher(pub_topic_name, Control, queue_size=1)
        # self.last_published_time = rospy.get_rostime()
        # self.last_published = None
        # self.timer = rospy.Timer(rospy.Duration(1./20.), self.timer_callback)

    def timer_callback(self, event):
        if self.last_published and self.last_published_time < rospy.get_rostime() + rospy.Duration(1.0/20.):
            self.lane_callback(self.last_published)

    def display(self,frame, lines, color=((255,0,0))):
    
        for i,lane in enumerate(lines):
            [cv2.circle(frame, center=(int(p.x), int(p.y)), radius=1, color=color, thickness=2) for p in lane]

        return frame

    def distance(self,p1, p2):
        return math.sqrt((p2.x - p1.x)**2 + (p2.y - p1.y)**2)

    def find_nearest(self,target_y, ys):
        min = 2000
        min_index = None
        for i,y in enumerate(ys):
            if abs(y - target_y) <= min:
                min = abs(y - target_y)
                min_index = i

        return min_index


    def compute_points(self,line, frame):

        xs = [point.x for point in line]
        ys = [point.y for point in line]
        D = [0, 0, 0]
        
        for i,y_ref in enumerate(self.num_val_y):            

            y_index = self.find_nearest(y_ref, ys)
            if y_index is None:
                return frame, None
            

            x1 = self.ref_line[0][0]        
            x2 = xs[y_index]
            y1 = y_ref
            y2 = ys[y_index]

            frame = self.display(frame, [[Point(x=x1, y=y1,z=0)], [Point(x=x2, y=y2,z=0)]], color=(0,0,0))

            D[i] = self.distance(Point(x=x1, y=y1,z=0), Point(x=x2, y=y2,z=0))

        return frame, D

    def control(self,A, B):
        command = Control()
        value = abs(A - B)
        if value <= 40:
            command.throttle = 0.01
            command.brake = 0
        elif A - B > 0:
            print("steering left")
            command.throttle = 0.001
            command.steer = (0.001 * value)
        elif A - B < 0:
            print("steering right")
            command.throttle = 0.001
            command.steer = (-0.001 * value)
            

        return command



    
    def lane_callback(self, msg : Lanes):
        data = msg.sensor_img
        line1 = msg.line1
        line2 = msg.line2
        line3 = msg.line3
        line4 = msg.line4
        # print("####") 
        # [print(f"{line} \n -----------") for line in [line1, line2, line3, line4]]
        frame = self.bridge.imgmsg_to_cv2(data)
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB) 
        frame = self.display(frame, [line1, line2, line3, line4])

        frame,_ = self.compute_points(line1, frame)
        frame,A = self.compute_points(line2, frame)
        frame,B = self.compute_points(line3, frame)
        frame,_ = self.compute_points(line4, frame)
        if A:
            print("A  :", sum(A) // 3)
        if B:
            print("B  :", sum(B) // 3)

        
        if A and B:
            command = self.control(sum(A) // 3,sum(B) // 3)
            self.lane_publisher.publish(command)

        
            




                
        #print(f"sec seq :{msg.header.seq} is {msg.header.stamp.secs}")






        

        cv2.imshow("out", frame)
        cv2.waitKey(1)

        '''
        
        Control Logic

        '''






        # command = Control()
        # command.header = msg.header


    
        #self.last_published = msg
        


        
        
        



if __name__ == "__main__":

    node_name = "lane_controller"

    rospy.init_node(node_name)
    lane_control()
    rospy.spin()