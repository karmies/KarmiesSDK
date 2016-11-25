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

1. Add com.karmies:plugin module to your project as a Gradle dependency.

    First, add the Karmies Maven repository to your project's repositories section:

    ```
    allprojects {
        repositories {
            ...
            maven { url 'https://maven.karmies.com/releases' }
        }
    }
    ```

    Next, add the Karmies plugin (v2.1.1) to your project's dependencies section:

    ```
    dependencies {
        ...
        compile 'com.karmies:plugin:2.1.1'
    }
    ```

2. Configure Karmies in your main activity shortly after app launch. Replace "default" with the clientID obtained from Karmies.

    Import the necessary classes:
    ```
    import karmies.com.karmiesplugin.Karmies;
    import karmies.com.karmiesplugin.activity.KarmiesActivity;
    ```

    Extend your main activity with the `KarmiesActivity` class:
    ```
    public class LaunchActivity extends KarmiesActivity ...
    ```

    In the `onCreate` method, call `Karmies.initialize()` with your publisher ID and initiate data load of Karmies assets.
    (Note, in certain integration scenarios, it may make sense to delay the load of Karmies assets until
    they are needed. If you are not sure, speak to your Karmies account representative who can provide guidance.)
    ```
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        ...
        Karmies.initialize(this, "{your publisher ID here}");
        Karmies.data.load();
    }
    ```

3. Add additional calls to reload Karmies data where desired, such as when application returns to foreground.
    ```
    Karmies.data.load()
    ```

4. Extend the text entry field component with the `KarmiesEditText` class to register your input.

    ```
    // Import the necessary Karmies input classes:
    import karmies.com.karmiesplugin.customviews.KarmiesEditText;

    // Extend your main text input field with the Karmies `KarmiesEditText` class:
    private class MyAppEditText extends KarmiesEditText { ... }
    ```

5. Add Karmies functionality to the text entry view:

    To use the provided Karmies keyboard and Karmies keyboard toggle button,
    create a `SelectorImageButton` instance for managing the keyboard input view toggle button,
    and add the button instance into your view:
    ```
    // First, import the necessary classes:
    import karmies.com.karmiesplugin.customviews.selector.SelectorEmojiView;
    import karmies.com.karmiesplugin.customviews.selector.SelectorImageButton;

    // In the view constructor, create the necessary Karmies instances and customize if necessary:
    public MyAppTextEntryView() {
        // ...
        SelectorImageButton karmiesEmojiButton = new SelectorImageButton(context);
        frameLayout.addView(karmiesEmojiButton /* , Formatting options here if necessary */);

        // To customize the emoji keyboard view:
        SelectorEmojiView emojiView = karmiesEmojiButton.getSelectorEmojiView();
    }
    ```

    Or, if not using the provided keyboard, access category and emoji resources directly to obtain names and images,
    place them in your existing keyboard, and then call the provided callback when the input field should be updated.

    ```
    // Import the necessary classes:
    import karmies.com.karmiesplugin.Karmies;
    import karmies.com.karmiesplugin.analytics.KarmiesAnalytics;
    import karmies.com.karmiesplugin.customviews.selector.KarmiesEmojiImageView;
    import karmies.com.karmiesplugin.entity.KarmiesEmoji;
    import karmies.com.karmiesplugin.entity.KarmiesEmojiCategory;
    import karmies.com.karmiesplugin.entity.KarmiesEmojiCategoryCollection;
    import karmies.com.karmiesplugin.net.KarmiesData;

    // In your emoji selector view constructor:
    public MyAppEmojiView() {
        // Karmies data loads asynchronously. You will want to update your UI
        // when data is initialized or new data becomes available:
        Karmies.data.addUpdateListener(new KarmiesData.UpdateListener() {
            @Override
            public void onUpdate(KarmiesData karmiesData) {
                // Categories may be accessed like so:
                KarmiesEmojiCategoryCollection karmiesEmojiCategoryCollection =
                    Karmies.data.getEmojiCategoryCollection();
                List<KarmiesEmojiCategory> categories = karmiesEmojiCategoryCollection.getEntities();

                // To render an emoji or category icon, create a `KarmiesEmojiImageView`
                // instance and supply the emoji name:
                KarmiesEmojiImageView emojiView = new KarmiesEmojiImageView(context);
                emojiView.setEmoji(name);
                // ... or set the category image URL:
                emojiView.setImageEmojiUrlPath(category.getImage());

            }
        });
    }
    ```

    Add click handling for emojis, causing the emoji to be inserted into the registered input field:
    (Note, you will need to customize this to match your particular view class):
    ```
    @Override
    public void onItemClick(AdapterView<?> parent, View view, int position, long i) {
        if (view instanceof KarmiesEmojiImageView) {
            KarmiesEmojiImageView karmiesEmojiImageView = (KarmiesEmojiImageView) view;
            Karmies.insertEmoji(karmiesEmojiImageView.getKarmiesEmoji());
        }
    }
    ```

6. Use serialized message text when creating a new message.
  ```
  // Note, the message input field must be extended from `KarmiesEditText` as described in integration step 4.
  String serializedText = ((KarmiesEditText) messageEditText).getTextWithEmojis(messageEditText.getEditableText());
  ```

7. Use deserialized messages when displaying sent or received messages. Set outgoing to indicate sent.
    ```
    Spannable text = KarmiesTextView.toKarmiesText(messageText.toString(), context, new KarmiesTextView.onTextReadyListener() {
        @Override
        public void onTextReady(SpannableStringBuilder text) {
            // ...
        }
    });
    ```

8. Attach event handling for Karmies touch events, to show the customized action behind the Karmies emoji:
    ```
    // Inside your message touch event handler:
    if (KarmiesURLSpan.isKarmiesUri(text.toString(), Karmies.getInstance().getApplicationContext())) {
        KarmiesURLSpan.emojiPressed(Karmies.getInstance().getApplicationContext(), messageObject.messageText, url, view);
    }
    ```

9. Google Analytics
    Karmies uses Google Analytics for internal tracking. If using Google Analytics already in your app you should initialize your own Google Analytics tracker prior to initializing Karmies. This will make your tracker the default tracker and ensure that Karmies configuration doesn't affect your tracking.

10. Karmies Analytics

    Karmies captures detailed analytics to help understand how your users use Karmies.
    ```
    KarmiesAnalytics.send...
    ```

    At a minimum be sure to add impression tracking for sent and received messages.

    - `sendMessageImpressionEventsIdempotent` - whenever sent or received messages are displayed

    If implementing your own UI using Karmies data directly, work with Karmies to determine which of the following additional events should be captured and where best to capture them in your application.

    - `sendKeyboardOpenEvent` - whenever the keyboard containing Karmies is opened
    - `sendKeyboardCategoriesOpenEvent` - whenever a Karmies category is opened
    - `sendKeyboardEmojisInsertEvent` - whenever a Karmies emoji is inserted into a new message
    - `sendKeyboardEmojisClickEvent` - whenever a Karmies emoji is clicked in a sent or received message
    - `sendKeyboardEmojisImpressionEventIdempotent` - whenever a Karmies emoji is displayed in the keyboard
