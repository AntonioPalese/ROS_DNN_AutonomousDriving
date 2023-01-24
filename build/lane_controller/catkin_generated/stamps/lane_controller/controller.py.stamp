#!/usr/bin/python3
import sys, os
import rospy
import cv2
import os
from lane_msgs.msg import Lanes
from geometry_msgs.msg._Point import Point
from prius_msgs.msg import Control
from cv_bridge import CvBridge

class lane_control:
    def __init__(self):
        sub_topic_name = "/prius/front_camera/detected_lines"
        pub_topic_name = "prius"    
        self.path = "/home/ubuntu/image_frames"  
        self.seq = 1          

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

    def display(self,frame, lines):
        colors = [(255,0,0)]
    
        for i,lane in enumerate(lines):
            [cv2.circle(frame, center=(int(p.x), int(p.y)), radius=1, color=colors[0], thickness=2) for p in lane]

        return frame

    
    def lane_callback(self, msg : Lanes):
        data = msg.sensor_img
        line1 = msg.line1
        line2 = msg.line2
        line3 = msg.line3
        line4 = msg.line4
        print("####") 
        [print(f"{line} \n -----------") for line in [line1, line2, line3, line4]]
        frame = self.bridge.imgmsg_to_cv2(data)
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB) 
        frame = self.display(frame, [line1, line2, line3, line4])



        
        #print(f"sec seq :{msg.header.seq} is {msg.header.stamp.secs}")






        

        cv2.imshow("out", frame)
        cv2.waitKey(1)

        '''
        
        Control Logic

        '''






        # command = Control()
        # command.header = msg.header


    
        #self.last_published = msg
        # self.lane_publisher.publish(command)


        
        
        



if __name__ == "__main__":

    node_name = "lane_controller"

    rospy.init_node(node_name)
    lane_control()
    rospy.spin()