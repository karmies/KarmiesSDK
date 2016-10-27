//
//  KarmiesProxyDelegate.h
//  KarmiesSDK
//
//  Created by Dustin Mallory on 10/18/16.
//  Copyright © 2016 Karmies. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface KarmiesProxyDelegate: NSObject

@property (nonatomic, readonly, weak) id _Nullable karmiesDelegate;

- (instancetype _Nonnull)initWithDelegate:(id _Nullable)delegate;

@end
