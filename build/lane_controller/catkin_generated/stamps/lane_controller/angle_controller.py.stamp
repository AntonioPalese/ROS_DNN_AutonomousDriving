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
from simple_pid.PID import PID
from itertools import zip_longest
from operator import mul
class lane_control:
    def __init__(self):
        sub_topic_name = "/prius/front_camera/detected_lines"
        pub_topic_name = "prius"    
        self.path = "/home/ubuntu/image_frames"  
        self.seq = 1   
        self.fixed_x = int(1640/2)
        self.pid = PID(Kp=100.0, Ki=0.01, Kd=10.0)



        if not os.path.exists(self.path):
            os.makedirs(self.path) 


        self.bridge = CvBridge()
        
        self.lane_subscriber = rospy.Subscriber(sub_topic_name, Lanes, callback=self.lane_callback)
        self.lane_publisher = rospy.Publisher(pub_topic_name, Control, queue_size=1)
        # self.last_published_time = rospy.get_rostime()
        # self.last_published = None
        # self.timer = rospy.Timer(rospy.Duration(1./20.), self.timer_callback)

    # def timer_callback(self, event):
    #     if self.last_published and self.last_published_time < rospy.get_rostime() + rospy.Duration(1.0/20.):
    #         self.lane_callback(self.last_published)

    def display(self,frame, lines, color=((255,0,0))):
    
        for i,lane in enumerate(lines):
            [cv2.circle(frame, center=(int(p.x), int(p.y)), radius=1, color=color, thickness=2) for p in lane]

        return frame

    def compute_points(self,line1, line2, frame):

        # line1.reverse()
        # line2.reverse()

        zipped = zip_longest(line1, line2, fillvalue=Point(x=0,y=0, z=0))

        reference_line = []
        for (point1, point2) in zipped:
            if point1.x != 0 and point1.y != 0:
                reference_line.append(Point(x=self.fixed_x, y=point1.y, z=0))
            elif point2.x != 0 and point2.y != 0:
                reference_line.append(Point(x=self.fixed_x, y=point2.y, z=0))

        zipped = zip_longest(line1, line2, fillvalue=Point(x=0,y=0, z=0))

        detected_middle_line = []
        for (point1, point2) in zipped:
            if point1.x != 0 and point2.x != 0 and point1.y != 0 and point2.y != 0:
                detected_middle_line.append(Point(x=(point1.x + point2.x) / 2 , y=(point1.y + point2.y) / 2, z=0))

        


        xs = [p.x for p in detected_middle_line]
        ys = [p.y for p in detected_middle_line]

        import warnings
        warnings.simplefilter('ignore', np.RankWarning)

        p = np.polyfit(xs, ys, deg=1)        
        detected_middle_line = [Point(x=x, y=p[0] * x + p[1], z=0)for x in xs]

        
        frame = self.display(frame, [reference_line], color=(0,0,0))
        frame = self.display(frame, [detected_middle_line], color=(255, 255, 255))

        return frame, reference_line, detected_middle_line

    
    def slope(self,line):
        xs = [p.x for p in line]
        ys = [p.y for p in line]
        import warnings
        warnings.simplefilter('ignore', np.RankWarning)
        m = np.polyfit(xs, ys, deg=1)

        return m     


    def ang(self,lineA, lineB):
        # Get nicer vector form
       

        mA = self.slope(lineA)[0]
        mB = self.slope(lineB)[0]

        print("mA : ", mA)
        print("mB : ", mB)

        ret = math.atan2((mB - mA),(1 + mA * mB))

        # if ret > (math.pi / 2):
        #     ret -= math.pi

        
        
        return ret

    def control(self,update):
        command = Control()
        avg_speed = 0.01
        kp = 0.01
        command.throttle = avg_speed
        command.steer = kp * update    

        print(kp*update)       

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

        frame = self.display(frame, [line2, line3])
        frame,reference_line, detected_middle_line = self.compute_points(line2, line3,frame)   

        if len(line2) != 0 and len(line3) != 0:
            angle = self.ang(reference_line, detected_middle_line)

            


            command = self.control(angle)

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