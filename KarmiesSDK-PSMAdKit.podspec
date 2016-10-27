Pod::Spec.new do |spec|
  spec.name             = 'KarmiesSDK-PSMAdKit'
  spec.module_name      = 'KarmiesSDK'
  spec.version          = '2.0.0'
  spec.license          = { :text => 'Copyright 2016 Karmies, Inc.', :type => 'Commercial' }
  spec.homepage         = 'https://karmies.com'
  spec.authors          = { 'Karmies' => 'support@karmies.com' }
  spec.summary          = 'Karmies SDK in Swift for iOS and macOS'
  spec.source           = { :git => 'https://github.com/karmies/KarmiesSDK.git', :tag => spec.version }
  spec.requires_arc     = true

  spec.ios.deployment_target   = '8.0'
  spec.ios.vendored_frameworks = ['Cocoa/Karmies/KarmiesSDK_PSMAdKit.framework', 'Cocoa/External/PSMAdKitSDK/PSMAdKitSDK.framework']
  spec.ios.frameworks          = ['UIKit', 'CoreData', 'WebKit', 'SystemConfiguration', 'MobileCoreServices', 'EventKit', 'EventKitUI', 'CoreMotion', 'Accounts', 'StoreKit']

  spec.library                 = ['z', 'sqlite3', 'c++']
  spec.resource_bundle         = { 'PSMAdKitSDKBundle' => 'Cocoa/External/PSMAdKitSDK/PSMAdKitSDKBundle.bundle' }

  spec.dependency 'Alamofire',      '~> 4.0'
  spec.dependency 'AlamofireImage', '~> 3.1'
  spec.dependency 'ObjectMapper',   '~> 2.1'
  spec.dependency 'GBDeviceInfo',   '~> 4.2'

  spec.ios.dependency 'AwesomeCache',     '~> 4.0'
  spec.ios.dependency 'FastImageCache',   '~> 1.5'
end
