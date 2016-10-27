//
//  KarmiesAnimatedTransition.h
//  KarmiesSDK
//
//  Created by Dustin Mallory on 10/18/16.
//  Copyright © 2016 Karmies. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface KarmiesAnimatedTransition : NSObject <UIViewControllerAnimatedTransitioning>

@property (nonatomic, assign) BOOL isPresenting;

@end
