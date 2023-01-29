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
import matplotlib.pyplot as plt
from torch.utils.tensorboard import SummaryWriter
from gazebo_msgs.msg import LinkStates 

class lane_control:
    def __init__(self):
        sub_topic_name = "/prius/front_camera/detected_lines"
        pub_topic_name = "prius"    
        speed_topic_name = "/gazebo/link_states"
        self.path = "/home/ubuntu/image_frames"  
        self.seq = 1   
        self.num_val_y = (315, 378, 441)  
        self.y_weights = [1.0, 1.0, 1.0]
        self.ref_line = ([int(1640/2) for _ in range(int(590/2) + 20, 590, 5)], [y for y in range(int(590/2) + 20, 590, 5)])  
        self.pid = PID(Kp=1, Ki=0.001, Kd=0.05, setpoint=0, sample_time=0.001, output_limits=(-1, 1))
        self.avg_speed = 10.0 # m/s
        self.brake = 0
        self.step_brake = 0.1
        self.time = rospy.get_rostime().to_sec()
        self.last_angle = 0.0
        self.last_controller = 0
        self.last_value = 0
        self.last_throttle = 0
        self.last_brake = 0
        


        #self.writer = SummaryWriter(log_dir=f"ros_ws/runs/avg_speed={self.avg_speed}_kp={self.pid.Kp}_ki={self.pid.Ki}_kd={self.pid.Kd}")

        if not os.path.exists(self.path):
            os.makedirs(self.path) 


        self.bridge = CvBridge()
        
        self.lane_subscriber = rospy.Subscriber(sub_topic_name, Lanes, callback=self.lane_callback)
        self.lane_publisher = rospy.Publisher(pub_topic_name, Control, queue_size=1)
        self.speed_subscirber = rospy.Subscriber(speed_topic_name, LinkStates, callback=self.speed_modifier)
        # self.last_published_time = rospy.get_rostime()
        # self.last_published = None
        # self.timer = rospy.Timer(rospy.Duration(1./20.), self.timer_callback)

    # def timer_callback(self, event):
    #     if self.last_published and self.last_published_time < rospy.get_rostime() + rospy.Duration(1.0/20.):
    #         self.lane_callback(self.last_published)

    def speed_modifier(self, msg : LinkStates):
        i = msg.name.index("prius::base_link")
        speed_x = msg.twist[i].linear.x
        speed_y = msg.twist[i].linear.y

        self.speed = math.sqrt(speed_x*speed_x + speed_y*speed_y)

        if (self.speed > 5.0):
            self.brake += self.step_brake
        else:
            self.brake -= self.step_brake

        self.brake = max(0, min(self.brake, 1))

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
        D = [0.0, 0.0, 0.0, 0.0, 0.0]
        
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

    def undetected_control(self, dir):
        command = Control()
        command.throttle = self.last_throttle / 2
        command.brake = 2*self.last_brake
        command.steer = 2*dir*self.last_controller
        return command


    def control(self,A, B):
        command = Control()
        
        value = abs(A - B)
        L = 589.0
        angle = math.asin(value / L)
        print("angle : ", angle)
        ang_v = (angle - self.last_angle) / (rospy.get_rostime().to_sec() - self.time)
        print("ag_vel : ", ang_v)
        self.time = rospy.get_rostime().to_sec()

        controller = self.pid(angle)
        
        command.throttle = self.avg_speed / 100
        command.brake = self.brake

        self.last_controller = controller
        self.last_value = value
        self.last_throttle = command.throttle
        self.last_brake = command.brake
        self.last_angle = angle
        

        # if value <= 10*self.i:
        #     command.throttle = self.avg_speed
        #     command.brake = 0
        # elif value > 10*self.i and value < 20*self.i:
        #     command.throttle = self.avg_speed / 2
        #     command.brake = 0
        # elif value > 20*self.i and value < 30*self.i:
        #     command.throttle = self.avg_speed / 3
        #     command.brake = 0
        # elif value > 30*self.i and value < 40*self.i:
        #     command.throttle = self.avg_speed / 4
        #     command.brake = 0
        # elif value > 40*self.i and value < 50*self.i:
        #     command.throttle = 0
        #     command.brake = self.avg_brake / 6
        # elif value > 50*self.i and value < 60*self.i:
        #     command.throttle = 0
        #     command.brake = self.avg_brake / 5
        # elif value > 60*self.i and value < 70*self.i:
        #     command.throttle = 0 
        #     command.brake = self.avg_brake / 4
        # elif value > 70*self.i and value < 80*self.i:
        #     command.throttle = 0
        #     command.brake = self.avg_brake / 3
        # elif value > 80*self.i and value < 100*self.i:
        #     command.throttle = 0
        #     command.brake = self.avg_brake / 2
        # elif value > 100*self.i and value < 110*self.i:
        #     command.brake = self.avg_brake
        #     command.throttle = 0

        # self.writer.add_scalar("value", value, self.seq)
        # self.writer.add_scalar("controller", controller, self.seq)

        self.seq += 1

        if A - B > 0:          
            command.steer = -controller 
        elif A - B < 0:          
            command.steer = controller 

        print("value : ", value)
        print("steer : ",command.steer)
        print("throttle : ",command.throttle)
        print("brake : ", self.brake)
        print(f"speed :  {self.speed} m/s")
        print("-----------")
            
        

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

        #frame,_ = self.compute_points(line1, frame)
        frame,A = self.compute_points(line2, frame)
        frame,B = self.compute_points(line3, frame)
        #frame,_ = self.compute_points(line4, frame)
       
        
        
        if A:
            A = [a*w for a,w in zip(A, self.y_weights)]
            # print("A  :", A)
        if B:
            B = [b*w for b,w in zip(B, self.y_weights)]
            # print("B  :", B)

        
        if A and B:
            command = self.control(sum(A) / len(self.num_val_y),sum(B) / len(self.num_val_y))
            self.lane_publisher.publish(command)
        elif A:
            command = self.control(sum(A) / len(self.num_val_y), 0)
            self.lane_publisher.publish(command)
        elif B:
            command = self.control(0, sum(B) / len(self.num_val_y))
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