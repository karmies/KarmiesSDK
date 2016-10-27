//
//  TGKarmiesModernTextViewModel.m
//  KarmiesSDK
//
//  Created by Dustin Mallory on 10/26/16.
//  Copyright © 2016 Karmies. All rights reserved.
//

#import "TGKarmiesModernTextViewModel.h"
#import "KarmiesSDK-Swift.h"

#define DATE_TEXT_WIDTH 75

@interface TGKarmiesModernTextViewModel () {
    BOOL karmiesOutgoing;
}
    
@property (readonly) UIFont *fontAsUI;
    
@end

@implementation TGKarmiesModernTextViewModel
    
- (instancetype)initWithText:(NSString *)text outgoing:(BOOL)outgoing font:(CTFontRef)font {
    if (self = [super initWithText:text font:font ]) {
        karmiesOutgoing = outgoing;
    }
    return self;
}
    
- (void)drawInContext:(CGContextRef)context {
    [[KarmiesContext sharedContext] drawSerializedMessage:self.text outgoing:karmiesOutgoing insideFrame:self.bounds withFont:self.fontAsUI];
}
    
- (void)layoutForContainerSize:(CGSize)containerSize {
    CGSize size = [[KarmiesContext sharedContext] measureSerializedMessage:self.text outgoing:karmiesOutgoing font:[self fontAsUI] maxWidth:(float)containerSize.width - DATE_TEXT_WIDTH];
    size.width = size.width + DATE_TEXT_WIDTH;
    CGRect frame = self.frame;
    frame.size = size;
    self.frame = frame;
}
    
- (NSString *)linkAtPoint:(CGPoint)point regionData:(__autoreleasing NSArray **)regionData {
    NSString *link = [[KarmiesContext sharedInstance] linkAtPoint:point insideFrame:self.frame withSerializedMessage:self.text outgoing:karmiesOutgoing font:[self fontAsUI]];
    if (link != nil) {
        if (regionData != NULL) {
            *regionData = @[[NSValue valueWithCGRect:CGRectZero]];
        }
        return link;
    }
    
    return nil;
}
    
- (UIFont *)fontAsUI {
    return [KarmiesUtils UIFontFromCTFont:self.font];
}
    
@end
