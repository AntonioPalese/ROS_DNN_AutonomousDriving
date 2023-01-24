// Auto-generated. Do not edit!

// (in-package lane_msgs.msg)


"use strict";

const _serializer = _ros_msg_utils.Serialize;
const _arraySerializer = _serializer.Array;
const _deserializer = _ros_msg_utils.Deserialize;
const _arrayDeserializer = _deserializer.Array;
const _finder = _ros_msg_utils.Find;
const _getByteLength = _ros_msg_utils.getByteLength;
let std_msgs = _finder('std_msgs');
let sensor_msgs = _finder('sensor_msgs');
let geometry_msgs = _finder('geometry_msgs');

//-----------------------------------------------------------

class Lanes {
  constructor(initObj={}) {
    if (initObj === null) {
      // initObj === null is a special case for deserialization where we don't initialize fields
      this.header = null;
      this.sensor_img = null;
      this.line1 = null;
      this.line2 = null;
      this.line3 = null;
      this.line4 = null;
    }
    else {
      if (initObj.hasOwnProperty('header')) {
        this.header = initObj.header
      }
      else {
        this.header = new std_msgs.msg.Header();
      }
      if (initObj.hasOwnProperty('sensor_img')) {
        this.sensor_img = initObj.sensor_img
      }
      else {
        this.sensor_img = new sensor_msgs.msg.Image();
      }
      if (initObj.hasOwnProperty('line1')) {
        this.line1 = initObj.line1
      }
      else {
        this.line1 = [];
      }
      if (initObj.hasOwnProperty('line2')) {
        this.line2 = initObj.line2
      }
      else {
        this.line2 = [];
      }
      if (initObj.hasOwnProperty('line3')) {
        this.line3 = initObj.line3
      }
      else {
        this.line3 = [];
      }
      if (initObj.hasOwnProperty('line4')) {
        this.line4 = initObj.line4
      }
      else {
        this.line4 = [];
      }
    }
  }

  static serialize(obj, buffer, bufferOffset) {
    // Serializes a message object of type Lanes
    // Serialize message field [header]
    bufferOffset = std_msgs.msg.Header.serialize(obj.header, buffer, bufferOffset);
    // Serialize message field [sensor_img]
    bufferOffset = sensor_msgs.msg.Image.serialize(obj.sensor_img, buffer, bufferOffset);
    // Serialize message field [line1]
    // Serialize the length for message field [line1]
    bufferOffset = _serializer.uint32(obj.line1.length, buffer, bufferOffset);
    obj.line1.forEach((val) => {
      bufferOffset = geometry_msgs.msg.Point.serialize(val, buffer, bufferOffset);
    });
    // Serialize message field [line2]
    // Serialize the length for message field [line2]
    bufferOffset = _serializer.uint32(obj.line2.length, buffer, bufferOffset);
    obj.line2.forEach((val) => {
      bufferOffset = geometry_msgs.msg.Point.serialize(val, buffer, bufferOffset);
    });
    // Serialize message field [line3]
    // Serialize the length for message field [line3]
    bufferOffset = _serializer.uint32(obj.line3.length, buffer, bufferOffset);
    obj.line3.forEach((val) => {
      bufferOffset = geometry_msgs.msg.Point.serialize(val, buffer, bufferOffset);
    });
    // Serialize message field [line4]
    // Serialize the length for message field [line4]
    bufferOffset = _serializer.uint32(obj.line4.length, buffer, bufferOffset);
    obj.line4.forEach((val) => {
      bufferOffset = geometry_msgs.msg.Point.serialize(val, buffer, bufferOffset);
    });
    return bufferOffset;
  }

  static deserialize(buffer, bufferOffset=[0]) {
    //deserializes a message object of type Lanes
    let len;
    let data = new Lanes(null);
    // Deserialize message field [header]
    data.header = std_msgs.msg.Header.deserialize(buffer, bufferOffset);
    // Deserialize message field [sensor_img]
    data.sensor_img = sensor_msgs.msg.Image.deserialize(buffer, bufferOffset);
    // Deserialize message field [line1]
    // Deserialize array length for message field [line1]
    len = _deserializer.uint32(buffer, bufferOffset);
    data.line1 = new Array(len);
    for (let i = 0; i < len; ++i) {
      data.line1[i] = geometry_msgs.msg.Point.deserialize(buffer, bufferOffset)
    }
    // Deserialize message field [line2]
    // Deserialize array length for message field [line2]
    len = _deserializer.uint32(buffer, bufferOffset);
    data.line2 = new Array(len);
    for (let i = 0; i < len; ++i) {
      data.line2[i] = geometry_msgs.msg.Point.deserialize(buffer, bufferOffset)
    }
    // Deserialize message field [line3]
    // Deserialize array length for message field [line3]
    len = _deserializer.uint32(buffer, bufferOffset);
    data.line3 = new Array(len);
    for (let i = 0; i < len; ++i) {
      data.line3[i] = geometry_msgs.msg.Point.deserialize(buffer, bufferOffset)
    }
    // Deserialize message field [line4]
    // Deserialize array length for message field [line4]
    len = _deserializer.uint32(buffer, bufferOffset);
    data.line4 = new Array(len);
    for (let i = 0; i < len; ++i) {
      data.line4[i] = geometry_msgs.msg.Point.deserialize(buffer, bufferOffset)
    }
    return data;
  }

  static getMessageSize(object) {
    let length = 0;
    length += std_msgs.msg.Header.getMessageSize(object.header);
    length += sensor_msgs.msg.Image.getMessageSize(object.sensor_img);
    length += 24 * object.line1.length;
    length += 24 * object.line2.length;
    length += 24 * object.line3.length;
    length += 24 * object.line4.length;
    return length + 16;
  }

  static datatype() {
    // Returns string type for a message object
    return 'lane_msgs/Lanes';
  }

  static md5sum() {
    //Returns md5sum for a message object
    return '80d3f0a517344ee914e98962a53a5845';
  }

  static messageDefinition() {
    // Returns full string definition for message
    return `
    Header header
    
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
    
    `;
  }

  static Resolve(msg) {
    // deep-construct a valid message object instance of whatever was passed in
    if (typeof msg !== 'object' || msg === null) {
      msg = {};
    }
    const resolved = new Lanes(null);
    if (msg.header !== undefined) {
      resolved.header = std_msgs.msg.Header.Resolve(msg.header)
    }
    else {
      resolved.header = new std_msgs.msg.Header()
    }

    if (msg.sensor_img !== undefined) {
      resolved.sensor_img = sensor_msgs.msg.Image.Resolve(msg.sensor_img)
    }
    else {
      resolved.sensor_img = new sensor_msgs.msg.Image()
    }

    if (msg.line1 !== undefined) {
      resolved.line1 = new Array(msg.line1.length);
      for (let i = 0; i < resolved.line1.length; ++i) {
        resolved.line1[i] = geometry_msgs.msg.Point.Resolve(msg.line1[i]);
      }
    }
    else {
      resolved.line1 = []
    }

    if (msg.line2 !== undefined) {
      resolved.line2 = new Array(msg.line2.length);
      for (let i = 0; i < resolved.line2.length; ++i) {
        resolved.line2[i] = geometry_msgs.msg.Point.Resolve(msg.line2[i]);
      }
    }
    else {
      resolved.line2 = []
    }

    if (msg.line3 !== undefined) {
      resolved.line3 = new Array(msg.line3.length);
      for (let i = 0; i < resolved.line3.length; ++i) {
        resolved.line3[i] = geometry_msgs.msg.Point.Resolve(msg.line3[i]);
      }
    }
    else {
      resolved.line3 = []
    }

    if (msg.line4 !== undefined) {
      resolved.line4 = new Array(msg.line4.length);
      for (let i = 0; i < resolved.line4.length; ++i) {
        resolved.line4[i] = geometry_msgs.msg.Point.Resolve(msg.line4[i]);
      }
    }
    else {
      resolved.line4 = []
    }

    return resolved;
    }
};

module.exports = Lanes;
