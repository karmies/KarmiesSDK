# KarmiesSDK

KarmiesSDK is a client implementation of the Karmies API to add custom interactive emoji to an application.

Integration instructions are below. If you are a new Karmies publisher you will also need to complete
the [Karmies Publisher On-boarding Process](https://github.com/karmies/KarmiesSDK/wiki/Publisher-On-boarding-Process)
before you can begin operating your Karmies-integrated app.

----

## iOS Integration ##

Check out the [iOS Example App](https://github.com/karmies/KarmiesExample-iOS) which illustrates the simplest path for each step below.

1. Make sure Swift support is enabled in your project.

  See the Apple Developer guide for more info if your project does not already use Swift.

2. Add `KarmiesSDK.framework` to your project.

  Karmies is easiest to add using CocoaPods. Because Karmies maintains a minimum iOS 8 target with Swift 3 while some libraries have increased to iOS 9 we also provide forked dependencies that maintain iOS 8 support.
    ```
    pod 'KarmiesSDK'
    pod 'Alamofire',      git: 'https://github.com/karmies/Alamofire',      branch: 'ios8'
    pod 'AlamofireImage', git: 'https://github.com/karmies/AlamofireImage', branch: 'ios8'
    ```
  Otherwise, manually add the KarmiesSDK framework and all required external and system framework dependencies to your project. You can still obtain a list of required frameworks and versions from the [Podspec](https://cocoapods.org/pods/KarmiesSDK).

  To use KarmiesSDK with built-in PSMAdKit support use an alternative version with PSMAdKitSDK linked.
    ```
    pod 'KarmiesSDK-PSMAdKit'
    pod 'Alamofire',      git: 'https://github.com/karmies/Alamofire',      branch: 'ios8'
    pod 'AlamofireImage', git: 'https://github.com/karmies/AlamofireImage', branch: 'ios8'
    ```
  For manual integration this version has additional dependencies which may also be found in its [Podspec](https://cocoapods.org/pods/KarmiesSDK-PSMAdKit).

3. Configure Karmies using the Karmies class shortly after app launch, usually in `AppDelegate.application:didFinishLaunchingWithOptions`. Replace "default" with the `clientID` obtained from Karmies. If `monitorLocation` is set Karmies will automatically request user location for features that require it. If `loadOnReachable` is set Karmies will automatically load new data when the network is available.
  ```
  Karmies.shared.configure(clientID: "default", monitorLocation: true)
  ```

4. Add additional calls to update Karmies data when desired, such as when the application returns to foreground.
  ```
  Karmies.shared.update(reload: false)
  ```
5. Create a `KarmiesController` for managing the keyboard input view, optional toggle button, hiding the system keyboard, and the auto suggest bar. Replace `inputTextView` with the input field used by users to enter messages where emoji should be accessible.

  To use the provided Karmies keyboard:
  ```
  karmiesController = KarmiesController(hostInputTextView: inputTextView, toggleEmbeddedKeyboard: true, autoSuggest: true)
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
  let categories = Karmies.shared.data.categories()

  func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
    return categories.count
  }

  func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
    ...
    let category = categories[indexPath.item]
    Karmies.shared.images.image(for: category) { (image) in
      cell.imageView.image = image
    }
    ...
  }
  ```

  For emojis in a category:
  ```
  let emojis = category.emojis()

  func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
    return emojis.count
  }

  func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
    ...
    let name = emojis[indexPath.item]
    images.image(for: name) { (image) in
      cell.imageView.image = image
    }
    ...
  }

  func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
    ...
    Karmies.shared.insertEmoji(named: name, in: category.name, index: index)
    ...
  }
  ```

6. Use serialized message text when creating a new message.
  ```
  let serializedText = Karmies.shared.messages.serializeMessage(from: attributedText)
  ```

7. Use deserialized messages when displaying sent or received messages. Set outgoing to indicate sent.
  ```
  Karmies.shared.messages.deserializeMessage(serializedText, outgoing: true) { (attributedText) in
    cell.textView?.attributedText = attributedText
  }
  ```

8. Karmies Analytics

  Karmies captures detailed analytics to help understand how your users use Karmies.
  ```
  Karmies.shared.analytics.send...
  ```
  At a minimum be sure to add impression tracking for sent and received messages.

  - `sendMessageImpressionEvents` - whenever sent or received messages are displayed

  If implementing your own UI using Karmies data directly, work with Karmies to determine which of the following additional events should be captured and where best to capture them in your application.

  - `sendKeyboardOpenEvent` - whenever the keyboard containing Karmies is opened
  - `sendKeyboardCloseEvent` - whenever the keyboard containing Karmies is closed
  - `sendKeyboardCategoriesOpenEvent` - whenever a Karmies keyboard category is opened
  - `sendKeyboardEmojisInsertEvent` - whenever a Karmies keyboard emoji is inserted into a new message
  - `sendKeyboardEmojisClickEvent` - whenever a Karmies keyboard emoji is clicked in a sent or received message
  - `sendKeyboardEmojisImpressionEvent` - whenever a Karmies emoji is displayed in the keyboard
  - `sendAutosuggestOpenEvent` - whenever a suggest bar containing Karmies is opened
  - `sendAutosuggestCloseEvent` - whenever a suggest bar containing Karmies is closed
  - `sendAutosuggestEmojisInsertEvent` - whenever a suggested Karmies emoji is inserted into a new message
  - `sendAutosuggestEmojisClickEvent` - whenever a suggested Karmies emoji is clicked in a sent or received message
  - `sendAutosuggestEmojisImpressionEvent` - whenever a Karmies emoji is displayed in a suggest bar

----

## iOS Messages Extension ##

Check out the [iOS Example App](https://github.com/karmies/KarmiesExample-iOS) which also includes a Messages Extension example.

1. Make sure Swift support is enabled in your project.

  See the Apple Developer guide for more info if your project does not already use Swift.

2. Add `KarmiesSDK.framework` to your project.

  Karmies is easiest to add using CocoaPods. Because Karmies uses analytics inside an extension we also provide forked dependencies that add app extension support.
  ```
  pod 'KarmiesSDK'
  pod 'AWSMobileAnalytics', git: 'https://github.com/karmies/aws-sdk-ios', branch: 'app-extension'
  ```
  Otherwise, manually add the KarmiesSDK framework and all required external and system framework dependencies to your project. You can still obtain a list of required frameworks and versions from the [Podspec](https://cocoapods.org/pods/KarmiesSDK).

3. Create a new iOS iMessage Extension target according to the Apple Developer guide and ensure that it is correctly embedded in the main app and runs without Karmies.

4. Change the main `MessagesViewController` to extend `KarmiesMessagesAppViewController` and override vars to provide configuration. Replace "default" with the `clientID` obtained from Karmies. If `monitorLocation` is set Karmies will automatically request user location for features that require it.

  ```
  class MessagesViewController: KarmiesMessagesAppViewController {

    override var clientID: String {
      return "default"
    }

    override var monitorLocation: Bool {
      return true
    }
  }
  ```

----

## Android Integration ##

Check out the [Android Example App](https://github.com/karmies/KarmiesExample-Android) which illustrates the simplest path for each step below.

1. Add the `com.karmies:karmiessdk` module to your project as a Gradle dependency.

    First add the Karmies releases Maven repository:
    ```
    allprojects {
        repositories {
            ...
            maven { url 'https://maven.karmies.com/releases' }
        }
    }
    ```

    Next add the Karmies SDK dependency:
    ```
    dependencies {
        ...
        compile 'com.karmies:karmiessdk'
    }
    ```

    Note that unlike iOS using KarmiesSDK with built-in PSMAdKit support does not require a different dependency for Android.

2. Create Karmies in the main app activity shortly after app launch. Replace "default" with the `clientID` obtained from Karmies. If the main app activity can extend `KarmiesActivity` then only `Karmies.create()` is needed and other lifecycle events will be handled automatically. If not using `KarmiesActivity` then also call `start()`, `resume()`, `pause()`, `stop()` as appropriate from the activity.

    If possible extend `KarmiesActivity` for the main activity class:
    ```
    public class MainActivity extends KarmiesActivity ...
    ```

    In the `onCreate` method call `Karmies.create()`. If `monitorLocation` is set Karmies will automatically request user location for features that require it. If `loadOnStart` is set Karmies will automatically load new data when the activity is started. Repeat for other lifecycle methods if not extending `KarmiesActivity`.
    ```
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        Karmies.create(this, "default", true, true);
        super.onCreate()
        ...
    }
    ```

3. Add additional calls to reload Karmies data when desired, such as on demand if not using loadOnStart.
    ```
    Karmies.update();
    ```

4. Extend the text entry field component with the `KarmiesEditText` class to register your input.
    ```
    private class MyAppEditText extends KarmiesEditText { ... }
    ```

5. Add Karmies functionality to the text entry view:

    To use the provided Karmies keyboard and Karmies keyboard toggle button create a `SelectorImageButton` instance for managing the keyboard input view toggle button and then add the button instance into your view:
    ```
    public MyAppTextEntryView() {
        ...
        SelectorImageButton karmiesEmojiButton = new SelectorImageButton(context);
        frameLayout.addView(karmiesEmojiButton /* , Formatting options here if necessary */);

        // To customize the emoji keyboard view:
        SelectorEmojiView emojiView = karmiesEmojiButton.getSelectorEmojiView();
    }
    ```

    Or if not using the provided keyboard, access category and emoji resources directly to obtain names and images,
    place them in your existing keyboard, and then call the provided callback when the input field should be updated.
    ```
    public MyAppEmojiView() {
        Karmies.data.addUpdateListener(new KarmiesData.UpdateListener() {
            @Override
            public void onUpdate() {

                // Get categories
                List<KarmiesCategory> categories = Karmies.getData().getCategories();

                // To render an emoji or category icon create a `KarmiesEmojiImageView`
                // instance and supply the emoji name:
                KarmiesEmojiImageView emojiView = new KarmiesEmojiImageView(context);
                emojiView.setEmoji(name);

                // ... or set the category image URL:
                emojiView.setImageEmojiUrlPath(category.getImage());

            }
        });
    }
    ```

    Add click handling for emojis causing the emoji to be inserted into the registered input field:
    (Note, you will need to customize this to match your particular view class):
    ```
    @Override
    public void onItemClick(AdapterView<?> parent, View view, int position, long i) {
        if (view instanceof KarmiesEmojiImageView) {
            KarmiesEmojiImageView karmiesEmojiImageView = (KarmiesEmojiImageView) view;
            Karmies.insertEmoji(karmiesEmojiImageView.getKarmiesEmoji(), null);
        }
    }
    ```

6. Use serialized message text when creating a new message. Note that the message input field must be extended from `KarmiesEditText`.
  ```
  String serializedText = ((KarmiesEditText) messageEditText).getTextWithEmojis(messageEditText.getEditableText());
  ```

7. Use deserialized messages when displaying sent or received messages. Set outgoing to indicate sent.
    ```
    Spannable text = KarmiesTextView.toKarmiesText(messageText.toString(), context, new KarmiesTextView.onTextReadyListener() {
        @Override
        public void onTextReady(SpannableStringBuilder text) {
            ...
        }
    });
    ```

8. Attach event handling for Karmies touch events to show the customized action behind the Karmies emoji:
    ```
    // Inside message touch event handler:
    if (KarmiesURLSpan.isKarmiesUri(text.toString(), Karmies.getInstance().getApplicationContext())) {
        KarmiesURLSpan.emojiPressed(Karmies.getInstance().getApplicationContext(), messageObject.messageText, url, view);
    }
    ```

9. Karmies Analytics

    Karmies captures detailed analytics to help understand how your users use Karmies.
    ```
    Karmies.getAnalytics().send...
    ```

    At a minimum be sure to add impression tracking for sent and received messages.

    - `sendMessageImpressionEventsIdempotent` - whenever sent or received messages are displayed

    If implementing your own UI using Karmies data directly, work with Karmies to determine which of the following additional events should be captured and where best to capture them in your application.

    - `sendKeyboardOpenEvent` - whenever the keyboard containing Karmies is opened
    - `sendKeyboardCloseEvent` - whenever the keyboard containing Karmies is closed
    - `sendKeyboardCategoriesOpenEvent` - whenever a Karmies keyboard category is opened
    - `sendKeyboardEmojisInsertEvent` - whenever a Karmies keyboard emoji is inserted into a new message
    - `sendKeyboardEmojisClickEvent` - whenever a Karmies keyboard emoji is clicked in a sent or received message
    - `sendKeyboardEmojisImpressionEventIdempotent` - whenever a Karmies emoji is displayed in the keyboard
    - `sendAutosuggestOpenEvent` - whenever a suggest bar containing Karmies is opened
    - `sendAutosuggestCloseEvent` - whenever a suggest bar containing Karmies is closed
    - `sendAutosuggestEmojisInsertEvent` - whenever a suggested Karmies emoji is inserted into a new message
    - `sendAutosuggestEmojisClickEvent` - whenever a suggested Karmies emoji is clicked in a sent or received message
    - `sendAutosuggestEmojisImpressionEventIdempotent` - whenever a Karmies emoji is displayed in a suggest bar
