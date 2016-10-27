//
//  PushMessaging.h
//  PushMessaging
//
//  Created by Alex Volovoy on 10/1/15.
//  Copyright © 2015 PinsightMedia+. All rights reserved.
//

@import UIKit;
@import Foundation;

//! Project version number for Push Messaging.
FOUNDATION_EXPORT double PushMessagingVersionNumber;

//! Project version string for Push Messaging.
FOUNDATION_EXPORT const unsigned char PushMessagingVersionString[];

// In this header, you should import all the public headers of your framework using statements like #import <PushMessaging/PSMPushMessaging.h>

@interface PSMPushMessaging : NSObject

+ (void) configureWithSubscriberId:(NSString *)subscriberId pushPinKey:(NSString*)key;
+ (void) registerApnsToken:(NSString*)token forUserId:(NSString*)userId completionHandler:(void(^)(BOOL success, NSError *error)) completionHandler;
+ (void) deleteApnsToken:(NSString*)token forUserId:(NSString*)userId completionHandler:(void(^)(BOOL success, NSError *error)) completionHandler;
+ (void) addFilterWithKey:(NSString*)key value:(NSString*)value;
+ (void) enableTestMode:(BOOL)test ;
+ (void) resetFilters ;

@end
