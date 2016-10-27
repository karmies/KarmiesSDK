//
//  PSMAdView.h
//
//  Created by Alex Volovoy.
//  Copyright (c) 2012 OneLouder Apps. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "PSMAdManager.h"

// Optional Targeting Parameter Constants
#define TARGETING_PARAM_APP_VERSION	@"APP_VERSION"	// Incrementing version of app useful for targeting campaigns (ex: 1.4.2)
#define TARGETING_PARAM_MSISDN		@"MSISDN"		// Phone number with country code (ex: 16501234567)
#define TARGETING_PARAM_CARRIER		@"CARRIER"		// ID of the carrier
#define TARGETING_PARAM_AGE			@"AGE"			// Age (ex: 27)
#define TARGETING_PARAM_DOB			@"DOB"			// Date of birth in format yyyy-mm-dd (ex: 2008-05-25)
#define TARGETING_PARAM_AREA_CODE	@"AREA_CODE"	// Area code (ex: 650)
#define TARGETING_PARAM_POSTAL_CODE	@"POSTAL_CODE"	// Postal code (ex: 94123)
#define TARGETING_PARAM_GENDER		@"GENDER"		// Gender: "m" or "male"", "f" or "female"
#define TARGETING_PARAM_GEOLOCATION	@"GEOLOCATION"	// Latitude and longitude (ex: 32.9014,-117.2079)
#define TARGETING_PARAM_DMA			@"DMA"			// Designated Marketing Area code (ex: 807)
#define TARGETING_PARAM_ETHNICITY	@"ETHNICITY"	// Ethnicity:0-African American,1-Asian,2-Hispanic,3-White,4-Other
#define TARGETING_PARAM_SEEKING		@"SEEKING"		// Gender interested in: "m" or "male"", "f" or "female", "both"
#define TARGETING_PARAM_INCOME		@"INCOME"		// Income (ex: 50000)
#define TARGETING_PARAM_MARITAL		@"MARITAL"		// Marital status: "single" or "married"
#define TARGETING_PARAM_EDUCATION	@"EDUCATION"	// Education level:0-No College,1-College Degree,2-Graduate School
#define TARGETING_PARAM_KEYWORDS	@"KEYWORDS"		// Space delimited keywords (ex: MOVIE CATS FUNNY)
#define TARGETING_PARAM_SEARCH		@"SEARCH"		// User search, can really affect fill rates so recommended to use keywords instead
#define TARGETING_PARAM_INT_TYPE	@"INT_TYPE"		// Interstitial type: "AppOpen", "PreRoll", "PostRoll", "AppClose", "ScreenChange", "Other" or custom value.
#define TARGETING_PARAM_UNIQUE_ID   @"UNIQUE_ID"    // This is the unique ID AdMarvel will use for frequency capping.  This will automatically be generated but the app can overwrite it if they want (please see README for more details).
#define TARGETING_PARAM_UDID        @"UDID"         // If you have access to the UDID and need it for advertising then send it in this targeting parameter. The raw UDID is preferred as it is more flexible.

//Ad Sizes
#define BANNER_RECT CGRectMake(0, 0, 320, 50)
#define SQUARE_RECT CGRectMake(0, 0, 300, 250)
#define BANNER_LONG_RECT CGRectMake(0, 0, 768, 90)

@protocol PSMAdViewDelegate;

// View for displaying the ads.  Add this to your main view.
@interface PSMAdView : UIView

@property (nonatomic, assign) id<PSMAdViewDelegate> delegate;
@property (nonatomic, retain, readonly ) UIButton *btnClose;
@property (nonatomic, readonly) BOOL adReady;
@property (nonatomic, readonly) BOOL adRequested;


@property (nonatomic, strong) UIColor* textAdBackgroundColor;

-(instancetype) initWithFrame:(CGRect)frame adPlacement:(NSString*)placement withAdType:(PSMAdType)adType;
-(void) setPlacement:(NSString*)placement withAdType:(PSMAdType)adType;
-(void) startAndRequestAd;
-(void) requestAd;
-(void) start;
-(void) stop;
-(void) reset;

// These methods let the app indicate whether it considers the AdView to be visible or not.  This is useful when AdViews are embedded in a scrolling view and need to be loaded in advance.
// Calling these methods will let the AdView notify the creative of the status change. For most ads this is a no op but if an ad supports this feature it can take the appropriate action.
// These methods are required when you are using custom offline campaigns for recording the appropriate impression data.  These methods are not needed for interstitial ads however.

- (void) adViewDisplayed;
- (void) adViewHidden;



@end


@protocol PSMAdViewDelegate <NSObject> 
// Returns the view controller that will be responsible for displaying modal views.
// This is mostly used when the SDK needs to takeover full screen (such as when an ad is clicked).
// NOTE: As of iOS 6 the app now controls which orientations can be used by ads/in-app browser in either the Info.plist or in the AppDelegate application:supportedInterfaceOrientationsForWindow: method.
// We recommend for maximum compatibility with RichMedia ads that your app enables all orientations and then programatically restricts orientations where necessary using the UIViewController supportedInterfaceOrientations method.
@property (nonatomic,readonly) UIViewController *adTopViewController;

@optional
@property (nonatomic, readonly) NSDictionary *adTargetingParameters;

// Callbacks to let the app know that the full screen web view has been activated and closed.
// These callbacks are useful if your app needs to pause any onscreen activity while the web view is being viewed (i.e. for a game).  You might also want to get a new ad when the full screen closes.
- (void) psmAdViewfullScreenWebViewActivated:(PSMAdView *)psmAdView;
- (void) psmAdViewfullScreenWebViewClosed:(PSMAdView *)psmAdView;

// Callbacks to let the app know that an ad has just expanded or collapsed.  This means that an ad is taking up part of the screen but interaction with various elements of the app may still be possible.
// If it has expanded then the ad is currently currently displaying over some of the content.  The app should keep track of this and call collapseAd if the user interacts with the app instead of the ad.
- (void) psmAdViewAdDidExpand:(PSMAdView *)psmAdView;
- (void) psmAdViewAdDidCollapse:(PSMAdView *)psmAdView;

// Callback to let app know that a special banner has been clicked.  This method is provided to help track if an ad click is respondible for sending the user out of the app.
// Either this method, fullScreenWebViewActivated, adDidExpand  should be called on ad click where supported.
// Examples click actions that would trigger this are click to call, click to app, click to itunes, etc.
// If the app is going to exit or go to the background the the normal UIApplicationDelegate methods will still get called after this.
// NOTE: Some ad network SDKs don't provide a tracking option for ads that don't open a full screen view so our SDK can't provide this additional information in those cases.
- (void) psmAdViewWasClicked:(PSMAdView *)psmAdView;

// Callback to track success / fail of the add
- (void) psmAdViewAdSucceeded:(PSMAdView *)psmAdView;
- (void) psmAdViewAdFailed:(PSMAdView *)psmAdView;
- (void) psmAdViewAdClosed:(PSMAdView *)psmAdView;
- (void) psmAdViewAdRequested:(PSMAdView *)psmAdView;

// Space delimited keywords (ex: MOVIE CATS FUNNY)
- (NSString*) adKeywords;


@end