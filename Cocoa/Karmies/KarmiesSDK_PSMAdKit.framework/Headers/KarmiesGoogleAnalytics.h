//
//  KarmiesGoogleAnalytics.h
//  KarmiesSDK
//
//  Created by Dustin Mallory on 10/17/16.
//  Copyright © 2016 Karmies. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef NSDictionary<NSNumber *, NSString *> KarmiesDimensionDictionary;
typedef NSDictionary<NSNumber *, NSNumber *> KarmiesMetricsDictionary;

@interface KarmiesGoogleAnalytics : NSObject

@property (readonly) NSString *_Nonnull clientID;

- (instancetype _Nonnull)initWithTrackingID:(NSString *_Nonnull)trackerID defaultDimensions:(KarmiesDimensionDictionary *_Nullable)dimensions;

- (void)sendEventWithCategory:(NSString *_Nonnull)category action:(NSString *_Nonnull)action dimensions:(KarmiesDimensionDictionary *_Nullable)dimensions metrics:(KarmiesMetricsDictionary *_Nullable)metrics label:(NSString *_Nullable)label;

@end
