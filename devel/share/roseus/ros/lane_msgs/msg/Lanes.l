;; Auto-generated. Do not edit!


(when (boundp 'lane_msgs::Lanes)
  (if (not (find-package "LANE_MSGS"))
    (make-package "LANE_MSGS"))
  (shadow 'Lanes (find-package "LANE_MSGS")))
(unless (find-package "LANE_MSGS::LANES")
  (make-package "LANE_MSGS::LANES"))

(in-package "ROS")
;;//! \htmlinclude Lanes.msg.html
(if (not (find-package "GEOMETRY_MSGS"))
  (ros::roseus-add-msgs "geometry_msgs"))
(if (not (find-package "SENSOR_MSGS"))
  (ros::roseus-add-msgs "sensor_msgs"))
(if (not (find-package "STD_MSGS"))
  (ros::roseus-add-msgs "std_msgs"))


(defclass lane_msgs::Lanes
  :super ros::object
  :slots (_header _sensor_img _line1 _line2 _line3 _line4 ))

(defmethod lane_msgs::Lanes
  (:init
   (&key
    ((:header __header) (instance std_msgs::Header :init))
    ((:sensor_img __sensor_img) (instance sensor_msgs::Image :init))
    ((:line1 __line1) ())
    ((:line2 __line2) ())
    ((:line3 __line3) ())
    ((:line4 __line4) ())
    )
   (send-super :init)
   (setq _header __header)
   (setq _sensor_img __sensor_img)
   (setq _line1 __line1)
   (setq _line2 __line2)
   (setq _line3 __line3)
   (setq _line4 __line4)
   self)
  (:header
   (&rest __header)
   (if (keywordp (car __header))
       (send* _header __header)
     (progn
       (if __header (setq _header (car __header)))
       _header)))
  (:sensor_img
   (&rest __sensor_img)
   (if (keywordp (car __sensor_img))
       (send* _sensor_img __sensor_img)
     (progn
       (if __sensor_img (setq _sensor_img (car __sensor_img)))
       _sensor_img)))
  (:line1
   (&rest __line1)
   (if (keywordp (car __line1))
       (send* _line1 __line1)
     (progn
       (if __line1 (setq _line1 (car __line1)))
       _line1)))
  (:line2
   (&rest __line2)
   (if (keywordp (car __line2))
       (send* _line2 __line2)
     (progn
       (if __line2 (setq _line2 (car __line2)))
       _line2)))
  (:line3
   (&rest __line3)
   (if (keywordp (car __line3))
       (send* _line3 __line3)
     (progn
       (if __line3 (setq _line3 (car __line3)))
       _line3)))
  (:line4
   (&rest __line4)
   (if (keywordp (car __line4))
       (send* _line4 __line4)
     (progn
       (if __line4 (setq _line4 (car __line4)))
       _line4)))
  (:serialization-length
   ()
   (+
    ;; std_msgs/Header _header
    (send _header :serialization-length)
    ;; sensor_msgs/Image _sensor_img
    (send _sensor_img :serialization-length)
    ;; geometry_msgs/Point[] _line1
    (apply #'+ (send-all _line1 :serialization-length)) 4
    ;; geometry_msgs/Point[] _line2
    (apply #'+ (send-all _line2 :serialization-length)) 4
    ;; geometry_msgs/Point[] _line3
    (apply #'+ (send-all _line3 :serialization-length)) 4
    ;; geometry_msgs/Point[] _line4
    (apply #'+ (send-all _line4 :serialization-length)) 4
    ))
  (:serialize
   (&optional strm)
   (let ((s (if strm strm
              (make-string-output-stream (send self :serialization-length)))))
     ;; std_msgs/Header _header
       (send _header :serialize s)
     ;; sensor_msgs/Image _sensor_img
       (send _sensor_img :serialize s)
     ;; geometry_msgs/Point[] _line1
     (write-long (length _line1) s)
     (dolist (elem _line1)
       (send elem :serialize s)
       )
     ;; geometry_msgs/Point[] _line2
     (write-long (length _line2) s)
     (dolist (elem _line2)
       (send elem :serialize s)
       )
     ;; geometry_msgs/Point[] _line3
     (write-long (length _line3) s)
     (dolist (elem _line3)
       (send elem :serialize s)
       )
     ;; geometry_msgs/Point[] _line4
     (write-long (length _line4) s)
     (dolist (elem _line4)
       (send elem :serialize s)
       )
     ;;
     (if (null strm) (get-output-stream-string s))))
  (:deserialize
   (buf &optional (ptr- 0))
   ;; std_msgs/Header _header
     (send _header :deserialize buf ptr-) (incf ptr- (send _header :serialization-length))
   ;; sensor_msgs/Image _sensor_img
     (send _sensor_img :deserialize buf ptr-) (incf ptr- (send _sensor_img :serialization-length))
   ;; geometry_msgs/Point[] _line1
   (let (n)
     (setq n (sys::peek buf ptr- :integer)) (incf ptr- 4)
     (setq _line1 (let (r) (dotimes (i n) (push (instance geometry_msgs::Point :init) r)) r))
     (dolist (elem- _line1)
     (send elem- :deserialize buf ptr-) (incf ptr- (send elem- :serialization-length))
     ))
   ;; geometry_msgs/Point[] _line2
   (let (n)
     (setq n (sys::peek buf ptr- :integer)) (incf ptr- 4)
     (setq _line2 (let (r) (dotimes (i n) (push (instance geometry_msgs::Point :init) r)) r))
     (dolist (elem- _line2)
     (send elem- :deserialize buf ptr-) (incf ptr- (send elem- :serialization-length))
     ))
   ;; geometry_msgs/Point[] _line3
   (let (n)
     (setq n (sys::peek buf ptr- :integer)) (incf ptr- 4)
     (setq _line3 (let (r) (dotimes (i n) (push (instance geometry_msgs::Point :init) r)) r))
     (dolist (elem- _line3)
     (send elem- :deserialize buf ptr-) (incf ptr- (send elem- :serialization-length))
     ))
   ;; geometry_msgs/Point[] _line4
   (let (n)
     (setq n (sys::peek buf ptr- :integer)) (incf ptr- 4)
     (setq _line4 (let (r) (dotimes (i n) (push (instance geometry_msgs::Point :init) r)) r))
     (dolist (elem- _line4)
     (send elem- :deserialize buf ptr-) (incf ptr- (send elem- :serialization-length))
     ))
   ;;
   self)
  )

(setf (get lane_msgs::Lanes :md5sum-) "80d3f0a517344ee914e98962a53a5845")
(setf (get lane_msgs::Lanes :datatype-) "lane_msgs/Lanes")
(setf (get lane_msgs::Lanes :definition-)
      "Header header

sensor_msgs/Image sensor_img

geometry_msgs/Point[] line1
geometry_msgs/Point[] line2
geometry_msgs/Point[] line3
geometry_msgs/Point[] line4


================================================================================
MSG: std_msgs/Header
# Standard metadata for higher-level stamped data types.
# This is generally used to communicate timestamped data 
# in a particular coordinate frame.
# 
# sequence ID: consecutively increasing ID 
uint32 seq
#Two-integer timestamp that is expressed as:
# * stamp.sec: seconds (stamp_secs) since epoch (in Python the variable is called 'secs')
# * stamp.nsec: nanoseconds since stamp_secs (in Python the variable is called 'nsecs')
# time-handling sugar is provided by the client library
time stamp
#Frame this data is associated with
string frame_id

================================================================================
MSG: sensor_msgs/Image
# This message contains an uncompressed image
# (0, 0) is at top-left corner of image
#

Header header        # Header timestamp should be acquisition time of image
                     # Header frame_id should be optical frame of camera
                     # origin of frame should be optical center of camera
                     # +x should point to the right in the image
                     # +y should point down in the image
                     # +z should point into to plane of the image
                     # If the frame_id here and the frame_id of the CameraInfo
                     # message associated with the image conflict
                     # the behavior is undefined

uint32 height         # image height, that is, number of rows
uint32 width          # image width, that is, number of columns

# The legal values for encoding are in file src/image_encodings.cpp
# If you want to standardize a new string format, join
# ros-users@lists.sourceforge.net and send an email proposing a new encoding.

string encoding       # Encoding of pixels -- channel meaning, ordering, size
                      # taken from the list of strings in include/sensor_msgs/image_encodings.h

uint8 is_bigendian    # is this data bigendian?
uint32 step           # Full row length in bytes
uint8[] data          # actual matrix data, size is (step * rows)

================================================================================
MSG: geometry_msgs/Point
# This contains the position of a point in free space
float64 x
float64 y
float64 z

")



(provide :lane_msgs/Lanes "80d3f0a517344ee914e98962a53a5845")


