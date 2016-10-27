//
//  PSMInterstitialAd.h
//  OLAdKitSDK
//
//  Created by Alex Volovoy on 11/28/12.
//  Copyright (c) 2012 OneLouder Apps. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "PSMAdManager.h"
 
@class PSMInterstitialAd;

@protocol PSMInterstitialAdDelegate  <NSObject>


@optional
// Callbacks to let the app know that the full screen web view has been activated and closed.
// These callbacks are useful if your app needs to pause any onscreen activity while the web view is being viewed (i.e. for a game).  You might also want to get a new ad when the full screen closes.
- (void) psmInterstitialAdFullScreenWebViewActivated:(PSMInterstitialAd*)psmInterstitialAd;
- (void) psmInterstitialAdFullScreenWebViewClosed:(PSMInterstitialAd*)psmInterstitialAd;

// Callbacks to let the app know that an ad has just expanded or collapsed.  This means that an ad is taking up part of the screen but interaction with various elements of the app may still be possible.
// If it has expanded then the ad is currently currently displaying over some of the content.  The app should keep track of this and call collapseAd if the user interacts with the app instead of the ad.
- (void) psmInterstitialAdDidExpand:(PSMInterstitialAd*)psmInterstitialAd __attribute__((deprecated("psmInterstitialAdDidExpand deprecated in version 4.0.")));
- (void) psmInterstitialAdDidCollapse:(PSMInterstitialAd*)psmInterstitialAd __attribute__((deprecated("psmInterstitialAdDidCollapse deprecated in version 4.0.")));

// Callbacks to let the app know that a full screen interstitial has been activated and closed.
// These callbacks are useful if your app needs to pause any onscreen activity while the interstitial is being viewed and restart after it is closed.
// These are optional since psmInterstitialAdFullScreenWebViewActivated and psmInterstitialAdFullScreenWebViewClosed will be called as well in case only those are implemented.
- (void) psmInterstitialAdInterstitialActivated:(PSMInterstitialAd*)psmInterstitialAd;
- (void) psmInterstitialAdInterstitialClosed:(PSMInterstitialAd*)psmInterstitialAd;

// Callback to let app know that a special banner has been clicked.  This method is provided to help track if an ad click is respondible for sending the user out of the app.
// Either this method, psmInterstitialAdFullScreenWebViewActivated should be called on ad click where supported.
// Examples click actions that would trigger this are click to call, click to app, click to itunes, etc.
// If the app is going to exit or go to the background the the normal UIApplicationDelegate methods will still get called after this.
// NOTE: Some ad network SDKs don't provide a tracking option for ads that don't open a full screen view so our SDK can't provide this additional information in those cases.
- (void) psmInterstitialAdWasClicked:(PSMInterstitialAd*)psmInterstitialAd;

// Callbacks that let you know the status of a call to requestInterstitialAd.  These will be called once the ad has either been loaded successfully (succeeded) or is not available (failed).
// As a saftey precaution there is a timer setup that guarantees that these will be called within 10 seconds in case something went wrong and the application is waiting for a response.
- (void) psmInterstitialAdSucceeded:(PSMInterstitialAd*)psmInterstitialAd;
- (void) psmInterstitialAdFailed:(PSMInterstitialAd*)psmInterstitialAd;

// Space delimited keywords (ex: MOVIE CATS FUNNY)
@property (nonatomic, strong) NSString* adKeywords;
@property (nonatomic, readonly) NSDictionary *adTargetingParameters;

// Returns the view controller that will be responsible for displaying modal views.
// This is mostly used when the SDK needs to takeover full screen (such as when an ad is clicked).
// NOTE: As of iOS 6 the app now controls which orientations can be used by ads/in-app browser in either the Info.plist or in the AppDelegate application:supportedInterfaceOrientationsForWindow: method.
// We recommend for maximum compatibility with RichMedia ads that your app enables all orientations and then programatically restricts orientations where necessary using the UIViewController supportedInterfaceOrientations method.
@property (nonatomic, readonly) UIViewController *adTopViewController;

@end


@interface PSMInterstitialAd : NSObject  

@property (nonatomic, assign) id<PSMInterstitialAdDelegate> delegate;
// Helper method to display interstital ad at the point you enter specific view controller.
// requestAdWithPlacementName:@"screenchange" is going be called if ad is not ready
// displayAdWithPlacementName:@"screenchange" is going be called if ad is ready
-(void) displayScreenAd;

// Helper method to display interstital ad at the point you either start start the application or coming back from background state.
// requestAdWithPlacementName:@"launch" is going be called if ad is not ready
// displayAdWithPlacementName:@"launch" is going be called if ad is ready
-(void) displayLaunchAd;

// Checks if there is ad available for given placement name.
-(BOOL) isAdReadyForPlacementName:(NSString*)name;

// If isAdReadyForPlacementName check returns NO - call this methods to request the ad.
-(void) requestAdWithPlacementName:(NSString*)name;

// If isAdReadyForPlacementName check returns YES - call this methods to display the ad.
-(void) displayAdWithPlacementName:(NSString*)name;

@end
