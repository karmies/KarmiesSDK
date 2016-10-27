//
//  TGKarmiesModernTextViewModel.h
//  KarmiesSDK
//
//  Created by Dustin Mallory on 10/26/16.
//  Copyright © 2016 Karmies. All rights reserved.
//

#import "TGModernTextViewModel.h"

@interface TGKarmiesModernTextViewModel : TGModernTextViewModel

- (instancetype)initWithText:(NSString *)text outgoing:(BOOL)outgoing font:(CTFontRef)font;

@end
