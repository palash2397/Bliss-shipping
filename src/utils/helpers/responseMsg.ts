export const Msg = {
  // General
  SERVER_ERROR: `Internal server error`,
  SUCCESS: `Success`,
  VALIDATION_ERROR: `Validation failed`,
  BAD_REQUEST: `Bad request`,

  // User
  USER_REGISTER: `User registered successfully`,
  USER_LOGIN: `User logged in successfully`,
  USER_EXISTS: `User already exists`,
  USER_ALREADY_VERIFIED: `User Already verified`,
  USER_NOT_VERIFIED: `User not verified`,
  USER_NOT_FOUND: `User not found`,
  ACCOUNT_DEACTIVATED: `Account has been temporarily deactivated`,
  ACCOUNT_VERIFIED: `User account verified successfully.`,
  USER_FETCHED: `User fetched successfully`,
  USERS_FETCHED: `Users fetched successfully`,
  USER_DELETED: `User deleted successfully`,
  USER_UPDATED: `User updated successfully`,
  USER_ADDED: `User added successfully`,
  USER_INACTIVE: `User account is temporarily inactive`,

  // Authentication
  INVALID_CREDENTIALS: `Invalid Credentials`,
  LOGIN_SUCCESS: `Login successful`,
  LOGOUT_SUCCESS: `Logout successful`,
  UNAUTHORIZED: `Unauthorized access`,
  FORBIDDEN: `Access forbidden`,
  TOKEN_EXPIRED: `Token has expired`,
  TOKEN_INVALID: `Invalid token`,
  PASSWORD_CHANGED: `Password changed successfully`,
  PASSWORD_INCORRECT: `Incorrect password`,
  PASSWORD_OLD_INCORRECT: `Incorrect old password`,
  ENTERED_OLD_PASSWORD: `You have entered your old password. Please enter a new password`,

  // Data
  DATA_FETCHED: `Data fetched successfully`,
  DATA_GENERATED: `Data generated successfully`,
  DATA_NOT_FOUND: `No data found`,
  DATA_UPDATED: `Data updated successfully`,
  DATA_DELETED: `Data deleted successfully`,
  DATA_ADDED: `Data added successfully`,
  DATA_REQUIRED: `Data is required`,
  DATA_ALREADY_EXISTS: `Data  already exists`,
  DATA_IS_CLOSED: `Data is closed`,
  INVALID_DATA: `Invalid data`,

  // Id
  ID_REQUIRED: `Id is required`,

  // Profile
  USERNAME_EXISTS: `Username already exists`,

  // OTP
  OTP_SENT: `The OTP has been successfully sent to your registered number. Please check your inbox.`,
  OTP_VERIFIED: `OTP verified successfully`,
  OTP_NOT_VERIFIED: `OTP not verified. Please verify OTP.`,
  OTP_EXPIRED: `OTP has expired`,
  OTP_INVALID: `Invalid or expired OTP`,
  OTP_RESENT: `OTP resent successfully`,
  OTP_LIMIT_EXCEEDED: `OTP request limit exceeded, please try again later`,
  OTP_NOT_FOUND: `OTP not found. Please request a new OTP.`,

  // Verification
  EMAIL_VERIFICATION_SENT: `The verification link has been successfully sent to your registered email. Please check your inbox.`,
  EMAIL_VERIFIED: `Email verified successfully`,
  EMAIL_SENT: `Email sent successfully`,
  EMAIL_RESET_PASSWORD_LINK_SENT: `Password reset link has been sent to your email.`,
  EMAIL_ALREADY_VERIFIED: `Email already verified`,
  PHONE_VERIFIED: `Phone number verified successfully`,
  PHONE_ALREADY_VERIFIED: `Phone number already verified`,

  // Merchant
  MERCHANT_ALREADY_EXISTS: `Merchant already exists`,
  MERCHANT_CREATED: `Merchant created successfully`,
  MERCHANT_NOT_FOUND: `Merchant not found`,
  MERCHANT_UPDATED: `Merchant updated successfully`,
  MERCHANT_DELETED: `Merchant deleted successfully`,
  MERCHANT_FETCHED: `Merchant fetched successfully`,
  MERCHANTS_FETCHED: `Merchants fetched successfully`,
  MERCHANT_PROFILE_CREATED: `Merchant profile created successfully`,
  MERCHANT_PROFILE_UPDATED: `Merchant profile updated successfully`,
  MERCHANT_PROFILE_DELETED: `Merchant profile deleted successfully`,
  MERCHANT_PROFILE_FETCHED: `Merchant profile fetched successfully`,
  MERCHANT_PROFILES_FETCHED: `Merchant profiles fetched successfully`,
  MERCHANT_SUMMARY_FETCHED: `Merchant summary fetched successfully`,

  // Orders
  ORDER_CREATED: `Order created successfully`,
  ORDER_NOT_FOUND: `Order not found`,
  ORDER_UPDATED: `Order updated successfully`,
  ORDER_DELETED: `Order deleted successfully`,
  ORDER_FETCHED: `Order fetched successfully`,
  ORDERS_FETCHED: `Orders fetched successfully`,
  ORDERS_IMPORTED: `Orders imported successfully`,
  ORDER_CANCELLED: `Order cancelled successfully`,
  ORDER_FAILED_SUCCESSFULLY: `Order failed successfully`,
  ORDER_CANNOT_BE_CANCELLED: `Order cannot be cancelled after dispatch`,
  ORDER_ALREADY_CANCELLED: `Order is already cancelled`,
  ORDER_CANNOT_BE_ACCEPTED: `Order cannot be accepted`,
  ORDER_CANNOT_BE_DECLINED: `Order cannot be declined`,
  ORDER_ACCEPTED: `Order accepted successfully`,
  ORDER_DECLINED: `Order declined successfully`,
  ORDER_ALREADY_MARKED_AS_ARRIVED: `Order already marked as arrived`,
  ORDER_CAN_ONLY_BE_MARKED_AS_ARRIVED_AFTER_ACCEPTING: `You can only mark arrived after accepting the order`,
  ORDER_MUST_BE_ACCEPTED_BEFORE_STARTING_DELIVERY: `Order must be accepted before starting delivery`,
  ORDER_DELIVERED_SUCCESSFULLY: `Order delivered successfully`,
  ORDER_IS_NOT_IN_DELIVERY_STATE: `Order is not in delivery state`,
  ORDER_NOT_DELIVERED: `Order is not delivered Yet`,
  PROOF_OF_DELIVERY_REQUIRED: `Proof of delivery is required`,
  ORDER_STATS_FETCHED: `Order stats fetched successfully`,
  ORDER_PICKED_UP_SUCCESSFULLY: `Order picked up successfully`,
  ORDER_IS_NOT_IN_ARRIVED_STATE: `Order is not in arrived state`,

  // Import History
  IMPORT_HISTORY_FETCHED: `Import history fetched successfully`,
  IMPORT_HISTORY_NOT_FOUND: `Import history not found`,

  // Drivers
  DRIVERS_FETCHED: `Drivers fetched successfully`,
  DRIVER_FETCHED: `Driver fetched successfully`,
  DRIVER_NOT_FOUND: `Driver not found`,
  DRIVER_ACTIVE: `Driver is active`,
  DRIVER_ASSIGNED_SUCCESSFULLY: `Driver assigned successfully`,

  ASSIGNED_ORDERS_FETCHED: `Assigned orders fetched successfully`,
  ASSIGNED_ORDERS_NOT_FOUND: `No assigned orders found`,
  ASSIGNED_VEHICLES_FETCHED: `Assigned vehicles fetched successfully`,
  ASSIGNED_VEHICLES_NOT_FOUND: `No assigned vehicles found`,

  // Driver
  ARRIVAL_CONFIRMED: `Arrival confirmed successfully`,
  DELIVERY_STARTED_SUCCESSFULLY: `Delivery started successfully`,

  // Vehicle
  VEHICLE_CREATED: `Vehicle created successfully`,
  VEHICLE_NOT_FOUND: `Vehicle not found`,
  VEHICLE_TYPE_NOT_FOUND: `Vehicle type not found`,
  VEHICLE_UPDATED: `Vehicle updated successfully`,
  VEHICLE_DELETED: `Vehicle deleted successfully`,
  VEHICLE_FETCHED: `Vehicle fetched successfully`,
  VEHICLES_FETCHED: `Vehicles fetched successfully`,
  VEHICLES_NOT_FOUND: `Vehicles not found`,
  VEHICLE_ASSIGNED: `Vehicle assigned successfully`,

  DRIVER_ASSIGNED_VEHICLE_NOT_FOUND: `Driver assigned vehicle not found`,

  // Images
  IMAGE_UPLOADED: `Image uploaded successfully`,
  IMAGE_DELETED: `Image deleted successfully`,

  // file
  FILE_UPLOADED: `File uploaded successfully`,
  FILE_DELETED: `File deleted successfully`,
  FILE_NOT_FOUND: `File not found`,
  FILE_REQUIRED: `File is required`,

  // INVALID
  INVALID_TAB: `Invalid tab value`,

  // Rating
  RATING_CREATED: `Rating created successfully`,
  RATING_UPDATED: `Rating updated successfully`,
  RATING_DELETED: `Rating deleted successfully`,
  RATING_FETCHED: `Rating fetched successfully`,
  RATING_NOT_FOUND: `Rating not found`,
  RATING_ALREADY_EXISTS: `Rating already exists`,
  RATING_ALREADY_EXISTS_FOR_ORDER: `Rating already exists for this order`,
  RATING_ALREADY_NOT_EXIST_FOR_ORDER: `Rating does not exist for this order`,

  // Driver
  DRIVER_NOT_ASSIGNED_TO_ORDER: `Driver is not assigned to this order`,

  // Service Type
  SERVICE_TYPE_CREATED: `Service type created successfully`,
  SERVICE_TYPE_NOT_FOUND: `Service type not found`,
  SERVICE_TYPE_UPDATED: `Service type updated successfully`,
  SERVICE_TYPE_DELETED: `Service type deleted successfully`,
  SERVICE_TYPE_FETCHED: `Service type fetched successfully`,
  SERVICE_TYPES_FETCHED: `Service types fetched successfully`,
  SERVICE_TYPES_NOT_FOUND: `Service types not found`,

  // Item Category
  ITEM_CATEGORY_CREATED: `Item category created successfully`,
  ITEM_CATEGORY_NOT_FOUND: `Item category not found`,
  ITEM_CATEGORY_UPDATED: `Item category updated successfully`,
  ITEM_CATEGORY_DELETED: `Item category deleted successfully`,
  ITEM_CATEGORY_FETCHED: `Item category fetched successfully`,
  ITEM_CATEGORIES_FETCHED: `Item categories fetched successfully`,
  ITEM_CATEGORIES_NOT_FOUND: `Item categories not found`,

  // Parcel Type
  PARCEL_TYPE_CREATED: `Parcel type created successfully`,
  PARCEL_TYPE_NOT_FOUND: `Parcel type not found`,
  PARCEL_TYPE_UPDATED: `Parcel type updated successfully`,
  PARCEL_TYPE_DELETED: `Parcel type deleted successfully`,
  PARCEL_TYPE_FETCHED: `Parcel type fetched successfully`,
  PARCEL_TYPES_FETCHED: `Parcel types fetched successfully`,
  PARCEL_TYPES_NOT_FOUND: `Parcel types not found`,

  // Dispatcher
  DISPATCHER_ORDERS_FETCHED: `Dispatcher orders fetched successfully`,
  DISPATCHER_ORDERS_NOT_FOUND: `No assigned orders found`,
  DISPATCHER_DASHBOARD_DATA_FETCHED: `Dispatcher dashboard data fetched successfully`,
  DISPATCHER_DRIVERS_FETCHED: `Dispatcher drivers fetched successfully`,
  INVALID_DISPATCHER_ACTION: `Invalid dispatcher action`,
  INVALID_DELIVERY_STATUS: `Invalid delivery status`,

  // Dashboard
  DASHBOARD_DATA_FETCHED: `Dashboard data fetched successfully`,

  // notification
  NOTIFICATION_SENT: `Notification sent successfully`,
  NOTIFICATION_NOT_FOUND: `Notification not found`,
  NOTIFICATIONS_NOT_FOUND: `Notifications not found`,
  NOTIFICATION_FETCHED: `Notification fetched successfully`,
  NOTIFICATIONS_FETCHED: `Notifications fetched successfully`,
  NOTIFICATION_DELETED: `Notification deleted successfully`,
  NOTIFICATION_UPDATED: `Notification updated successfully`,
  NOTIFICATION_READ: `Notification read successfully`,
  NOTIFICATION_ALREADY_READ: `Notification already read`,
  NOTIFICATION_ALREADY_UNREAD: `Notification already unread`,
};
