
(cl:in-package :asdf)

(defsystem "lane_msgs-msg"
  :depends-on (:roslisp-msg-protocol :roslisp-utils :geometry_msgs-msg
               :std_msgs-msg
)
  :components ((:file "_package")
    (:file "Lanes" :depends-on ("_package_Lanes"))
    (:file "_package_Lanes" :depends-on ("_package"))
  ))