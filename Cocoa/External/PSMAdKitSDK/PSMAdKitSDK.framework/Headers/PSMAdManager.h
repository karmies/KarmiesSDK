#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <CoreLocation/CoreLocation.h>

#define kGlobal @"global"
#define kBanner @"banner"
#define kSquare @"square"
#define kPlacements @"placements"


@class PSMAdView;

typedef enum {
	PSMAdTypeBanner,
    PSMAdTypeLongBanner,
	PSMAdTypeSquare
} PSMAdType;

@interface PSMAdManager : NSObject

// This method should be called from the appDelegate
+ (PSMAdManager *)startWithApplicationId:(NSString*)OneLouderAppID;
+ (PSMAdManager *)sharedInstance;

// These properties are set in configuration file

@property (nonatomic, readonly) BOOL btnCloseEnabled;
@property (nonatomic, unsafe_unretained) BOOL adsEnabled;
@property (nonatomic, readonly) NSString *advertisingIdentifierString;
@property (nonatomic, readonly) NSDictionary* targetingParameters;


// Optional settings you can use to tune up ads 
@property (nonatomic, strong) CLLocation *location;
@property (nonatomic, strong) NSString *twitterId;
@property (nonatomic, strong) NSString *phone;
@property (nonatomic, strong) NSString *email;

// Returns a dictionary that represent placement with given name and type for the current device.

- (NSDictionary*)placementWithName:(NSString*)name adTypeKey:(NSString*)adTypeKey;

// Output version of SDK
- (NSString*)sdkVersion;

-(void)reportEventWithName:(NSString*)eventName forPlacement:(NSDictionary*)placement withTargetParams:(NSDictionary*)targetParams;

@end

