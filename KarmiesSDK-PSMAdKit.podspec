Pod::Spec.new do |spec|
  spec.name             = 'KarmiesSDK-PSMAdKit'
  spec.module_name      = 'KarmiesSDK'
  spec.version          = '2.4.3'
  spec.license          = { :text => 'Copyright 2016 Karmies, Inc.', :type => 'Commercial' }
  spec.homepage         = 'https://karmies.com'
  spec.authors          = { 'Karmies' => 'support@karmies.com' }
  spec.summary          = 'Karmies SDK in Swift for iOS and macOS with PSMAdKit support'
  spec.source           = { :http => 'https://pods.karmies.com/KarmiesSDK_PSMAdKit-2.4.3.zip' }
  spec.requires_arc     = true

  spec.ios.deployment_target   = '8.0'
  spec.ios.vendored_frameworks = ['KarmiesSDK_PSMAdKit.framework', 'PSMAdKitSDK.framework']
  spec.ios.frameworks          = ['CoreData', 'AdSupport', 'Accounts', 'Social', 'StoreKit', 'SafariServices', 'AssetsLibrary', 'AudioToolbox', 'AVFoundation', 'CFNetwork', 'CoreBluetooth', 'CoreLocation', 'CoreGraphics', 'CoreTelephony', 'CoreMedia', 'EventKit', 'EventKitUI', 'Foundation', 'GLKit', 'iAd', 'MediaPlayer', 'MessageUI', 'MobileCoreServices', 'QuartzCore', 'SystemConfiguration', 'Security', 'UIKit', 'CoreMotion', 'WebKit']

  spec.library                 = ['sqlite3', 'c++', 'z', 'xml2']
  spec.resource_bundle         = { 'PSMAdKitSDKBundle' => 'PSMAdKitSDKBundle.bundle' }

  spec.dependency 'Alamofire',        '~> 4.0'
  spec.dependency 'AlamofireImage',   '~> 3.1'
  spec.dependency 'ObjectMapper',     '~> 2.1'
  spec.dependency 'GBDeviceInfo',     '~> 4.2'
  spec.dependency 'CKCircleMenuView', '~> 0.3'

  spec.ios.dependency 'AwesomeCache',       '~> 5.0'
  spec.ios.dependency 'FastImageCache',     '~> 1.5'
  spec.ios.dependency 'AWSMobileAnalytics', '~> 2.5'
end
