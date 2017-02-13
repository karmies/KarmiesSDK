Pod::Spec.new do |spec|
  spec.name             = 'KarmiesSDK'
  spec.module_name      = 'KarmiesSDK'
  spec.version          = '2.4.3'
  spec.license          = { :text => 'Copyright 2016 Karmies, Inc.', :type => 'Commercial' }
  spec.homepage         = 'https://karmies.com'
  spec.authors          = { 'Karmies' => 'support@karmies.com' }
  spec.summary          = 'Karmies SDK in Swift for iOS and macOS'
  spec.source           = { :http => 'https://pods.karmies.com/KarmiesSDK-2.4.3.zip' }
  spec.requires_arc     = true

  spec.ios.deployment_target   = '8.0'
  spec.ios.vendored_frameworks = 'KarmiesSDK.framework'
  spec.ios.frameworks          = ['UIKit', 'CoreData', 'WebKit']

  spec.library                 = ['z', 'sqlite3']

  spec.dependency 'Alamofire',        '~> 4.0'
  spec.dependency 'AlamofireImage',   '~> 3.1'
  spec.dependency 'ObjectMapper',     '~> 2.1'
  spec.dependency 'GBDeviceInfo',     '~> 4.2'
  spec.dependency 'CKCircleMenuView', '~> 0.3'

  spec.ios.dependency 'AwesomeCache',       '~> 5.0'
  spec.ios.dependency 'FastImageCache',     '~> 1.5'
  spec.ios.dependency 'AWSMobileAnalytics', '~> 2.5'
end
