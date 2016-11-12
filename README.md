# KarmiesSDK

KarmiesSDK is a client implementation of the Karmies API to add custom interactive emoji to an application. At a high level, the necessary steps to integrate Karmies into your existing app are:

1. Sign publisher contract with Karmies
2. Work with account manager to set up Karmies account and obtain a client ID
3. Download and install the Karmies SDK artifacts into the app project
4. Configure the Karmies SDK in app startup routines
5. Insert emoji selector trigger button into application
6. Extend editable text components with Karmies functionality
7. Extend read-only text components with Karmies functionality
8. Implement any necessary Karmies analytics events
9. Remove existing emoji functionality (optional)
10. Test

----

## iOS Integration ##

Check out the [iOS Example App](https://github.com/karmies/KarmiesExample-iOS) which illustrates the simplest path for each step below.

1. Make sure Swift support is enabled in your project.

  See the Apple Developer guide for more info if your project does not already use Swift.

2. Add KarmiesSDK.framework to your project.

  Karmies is easiest to add using CocoaPods. Because Karmies maintains a minimum iOS 8 target with Swift 3 while some libraries have increased to iOS 9 we also provide forked dependencies that maintain iOS 8 support.
    ```
    pod 'KarmiesSDK', git: 'https://github.com/karmies/KarmiesSDK', branch: 'master'
    pod 'Alamofire', git: 'https://github.com/karmies/Alamofire', branch: 'ios8'
    pod 'AlamofireImage', git: 'https://github.com/karmies/AlamofireImage', branch: 'ios8'
    pod 'AwesomeCache', git: 'https://github.com/karmies/AwesomeCache', branch: 'master'
    ```
  Otherwise, manually add the KarmiesSDK framework and all required external and system framework dependencies to your project. You can still obtain a list of required frameworks and versions from the [Podspec](https://github.com/karmies/KarmiesSDK/blob/master/KarmiesSDK.podspec).

  To use KarmiesSDK with built-in PSMAdKit support use an alternative version with PSMAdKitSDK linked.
     ```
    pod 'KarmiesSDK-PSMAdKit', git: 'https://github.com/karmies/KarmiesSDK', branch: 'master'
    pod 'Alamofire', git: 'https://github.com/karmies/Alamofire', branch: 'ios8'
    pod 'AlamofireImage', git: 'https://github.com/karmies/AlamofireImage', branch: 'ios8'
    pod 'AwesomeCache', git: 'https://github.com/karmies/AwesomeCache', branch: 'master'
    ```
  For manual integration this version has additional dependencies which may also be found in its [Podspec](https://github.com/karmies/KarmiesSDK/blob/master/KarmiesSDK-PSMAdKit.podspec).

3. Configure Karmies using KarmiesContext shortly after app launch, usually in AppDelegate.application:didFinishLaunchingWithOptions. Replace "default" with the clientID obtained from Karmies. If requestLocation is set Karmies will automatically request user location for features that require it.
  ```
  KarmiesContext.shared.configure(clientID: "default", requestLocation: true)
  ```

4. Add additional calls to reload Karmies data where desired, such as when application returns to foreground.
  ```
  KarmiesContext.shared.load(reload: false)
  ```
5. Create a KarmiesController for managing the keyboard input view, optional toggle button, and provided keyboard. Replace inputTextView with the input field used by users to enter messages where emoji should be accessible.

  To use the provided Karmies keyboard:
  ```
  karmiesController = KarmiesController(hostInputTextView: inputTextView, toggleEmbeddedKeyboard: true)
  karmiesController.messageWasChangedHandler = { [unowned self] (forced) in
     ... (reload data)
  }
  ```
  To use the provided Karmies keyboard toggle button:
  ```
  KarmiesUtils.placeButton(karmiesController.keyboardToggleButton, onLeftOf: inputTextView, withPlaceholder: nil, in: inputTextView.superview)
  ```
  Or if not using the provided keyboard, access category category and emoji resources directly to obtain names and images, place them in your existing keyboard, and then call the provided callback when the input field should be updated.

  For categories:
  ```
  func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
    return KarmiesContext.shared.data.categories?.count ?? 0
  }

  func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
    ...
    if let category = data.categories?[indexPath.item] {
      KarmiesContext.shared.images.image(for: category) { (image) in
        cell.imageView.image = image
      }
    }
    ...
  }
  ```

  For emojis in a category:
  ```
  func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
    return category?.emojiNames.count ?? 0
  }

  func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
    ...
    if let category = category {
      let name = category.emojiNames[indexPath.item]
      images.image(for: name, in: category.name) { (image) in
        cell.imageView.image = image
      }
    }
    ...
  }

  func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
    ...
    KarmiesContext.shared.addToInputViewEmoji(for: name, in: categoryName, index: index)
    ...
  }
  ```

6. Use serialized message text when creating a new message.
  ```
  let serializedText = KarmiesContext.shared.messages.serializeMessage(from: attributedText)
  ```

7. Use deserialized messages when displaying sent or received messages. Set outgoing to indicate sent.
  ```
  KarmiesContext.shared.messages.deserializeMessage(serializedText, outgoing: true) { (attributedText) in
    cell.textView?.attributedText = attributedText
  }
  ```

8. Google Analytics

  Karmies uses Google Analytics for internal tracking. If using Google Analytics already in your app you should initialize your own Google Analytics tracker prior to initializing Karmies. This will make your tracker the default tracker and ensure that Karmies configuration doesn't affect your tracking.

9. Karmies Analytics

  Karmies captures detailed analytics to help understand how your users use Karmies.
  ```
  KarmiesContext.shared.analytics.send...
  ```
  At a minimum be sure to add impression tracking for sent and received messages.

  - sendMessageImpressionEvents - whenever sent or received messages are displayed

  If implementing your own UI using Karmies data directly, work with Karmies to determine which of the following additional events should be captured and where best to capture them in your application.

  - sendKeyboardOpenEvent - whenever the keyboard containing Karmies is opened
  - sendKeyboardCategoriesOpenEvent - whenever a Karmies category is opened
  - sendKeyboardEmojisInsertEvent - whenever a Karmies emoji is inserted into a new message
  - sendKeyboardEmojisClickEvent - whenever a Karmies emoji is clicked in a sent or received message
  - sendKeyboardEmojisImpressionEvent - whenever a Karmies emoji is displayed in the keyboard

----

## Android Integration ##
