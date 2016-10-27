(function () {
    var mraid = window.mraid = {};
    var psmVersion = "1.0.3";
    
    /* constant definitions*/
    var STATES = mraid.STATES = {
        LOADING : 'loading',
        DEFAULT : 'default',
        EXPANDED : 'expanded',
        RESIZED : 'resized',
        HIDDEN : 'hidden',
    };
    
    var EVENTS = mraid.EVENTS = {
        ERROR : 'error',
        READY : 'ready',
        STATECHANGE : 'stateChange',
        VIEWABLECHANGE : 'viewableChange',
        SIZECHANGE : 'sizeChange',
    };
    
    var CLOSE_POSITION = mraid.CLOSE_POSITION = {
    	TOPLEFT : 'top-left',
    	TOPRIGHT : 'top-right',
    	TOPCENTER : 'top-center',
    	CENTER : 'center',
    	BOTTOMLEFT : 'bottom-left',
    	BOTTOMRIGHT : 'bottom-right',
    	BOTTOMCENTER : 'bottom-center',
    };
    
    var FORCE_ORIENTATION = mraid.FORCE_ORIENTATION = {
    	PORTRAIT : 'portrait',
    	LANDSCAPE : 'landscape',
    	NONE : 'none',
    };
     
	var FEATURES = mraid.FEATURES = {
        SMS : 'sms',
        TEL : 'tel',
        CALENDAR : 'calendar',
        STOREPICTURE : 'storePicture',
        INLINEVIDEO : 'inlineVideo',
    };
 	/** The set of listeners for Events */
 	var listeners = { };
 	
 	/** holds the ads current viewable state controlled by the SDK **/
 	var viewable = true;
 	
 	/** holds the current placement type controlled by the SDK **/
 	var placementType = 'undefined';
 
 	/** holds the current state of the mraid ad. controlled by the SDK **/
    var state = STATES.LOADING;
    
    /* local variables for the default position */
    var default_pos = mraid.default_pos = {
        offsetX:0,
        offsetY:0,
        height: 0,
        width : 0,
    };

    /* local variables for the current position */
    var current_pos = mraid.current_pos = {
        offsetX:0,
        offsetY:0,
        height: 0,
        width : 0,
    };

    /* local variables for the screen size (includes system reserved area) */
    var screen_size = mraid.screen_size = {
        width:0,
        height:0,
    };

    /* local variables for the max size (max displayable size, excluding system reserved areas) */
    var max_size = mraid.max_size = {
        width:0,
        height:0,
    };

    /* local variables for the current orientation properties */
	var orientation_props = mraid.orientation_props = {
  		allowOrientationChange : true,
		forceOrientation : FORCE_ORIENTATION.NONE,
	};

    /* local variables for the current expandable properties */
    var expandable_props = mraid.expandable_props = {
        width:0,
        height:0,
        useCustomClose:false,
        isModal:false,
    };
    
    /* local variables for the current resize properties */
    var resize_props = mraid.resize_props = {
        width:0,
        height:0,
        customClosePosition: CLOSE_POSITION.TOPRIGHT,
        offsetX:0,
        offsetY:0,
        allowOffscreen:true,
    };
    
	var resize_props_set = false;
    
    var supported_features = {
        'sms':false,
        'tel':false,
        'calendar':false,
        'storePicture':false,
        'inlineVideo':false,
    };
    //
    var expandPropertyValidators = {
        useCustomClose:function(value) { return (value === true || value === false); },
        width:function(value) { return (!isNaN(value) && value >= 0); },
        height:function(value) { return (!isNaN(value) && value >= 0); },
    };

    //need to check
    var resizePropertyValidators = {
        width:function(value) { return (!isNaN(value) && value >= 0 && value<=max_size.width); },
        height:function(value) { return (!isNaN(value) && value >= 0 && value<=max_size.height); },
        customClosePosition:function(value) { return existsInObj(value, CLOSE_POSITION); },
        offsetX:function(value) { return (!isNaN(value)); },
        offsetY:function(value) { return (!isNaN(value)); },
        allowOffscreen:function(value) { return (value === true || value === false); },
	};
	
	var orientationPropertyValidators = {
        allowOrientationChange:function(value) { return (value === true || value === false); },
		forceOrientation:function(value) { return existsInObj(value,FORCE_ORIENTATION); },
	};
	
	/* MRAID 1.0 methods. */
    
    /* expand properties */
    mraid.getExpandProperties = function () {
        var properties = {
            width: expandable_props.width,
            height: expandable_props.height,
            useCustomClose: expandable_props.useCustomClose,
            isModal: expandable_props.isModal
            };
        return properties;
    };
    
    mraid.setExpandProperties = function (properties){
    	if (properties['isModal'] != undefined) {
       		mraid.fireErrorEvent('tried to set isModal property. This is read only.','setExpandProperties');
    	}
        if (valid(properties, expandPropertyValidators, 'setExpandProperties')) {
            var changedValues = [];
            for (var i in properties) {
                changedValues.push(i + ': ' + expandable_props[i] + ' to '+ properties[i]);
                expandable_props[i] = properties[i];
            }
 
            mraid.log('changing expand properties: ' + changedValues.join(' | '), 'setExpandProperties');
        }
    };
    
    mraid.useCustomClose = function (value) {
		if (value === true || value === false) {
            mraid.log('changing expand property useCustomClose from '+expandable_props.useCustomClose+' to '+value,'useCustomClose');
        	expandable_props.useCustomClose = value;
            /* always push the current state of the custom close flag to the SDK code */
        	psm_mraid_bridge.updateExpandProps(expandable_props.useCustomClose);  
        }
        else {
       		mraid.fireErrorEvent('useCustomClose called with invalid value: '+custom,'useCustomClose');
        }
    };

    /* getters */
    mraid.getState = function () {
        return state;
    };
    
    mraid.getVersion = function () {
        return "2.0";
    };
 
    mraid.getPsmVersion = function () {
        return psmVersion;
    }
 
    mraid.isViewable = function () {
        return viewable;
    };
    
    mraid.getPlacementType = function () {
        return placementType;
    }
    
    /* event listeners */

 	mraid.addEventListener = function( event, listener ) {
   		var handlers = listeners[event];
		if ( handlers == null ) {
        	/* no handlers defined yet, set it up */
        	listeners[event] = [];
        	handlers = listeners[event];
    	}
 
    	/* see if the listener is already present */
    	for ( var handler in handlers ) {
       		if ( listener == handler ) {
            	/* listener already present, nothing to do */
            	return;
        	}
    	}
 
        mraid.log('added new '+event+' listener','addEventListener');
    	/* not present yet, go ahead and add it */
    	handlers.push( listener );
 	};
 
	mraid.removeEventListener = function( event, listener ) {
    	var handlers = listeners[event];
    	if ( handlers != null ) {
    		/* if listener is null, all listeners are removed. */
    		if (listener == null) {
    		    mraid.log('removing all listeners for event '+event,'removeEventListener');
    			listeners[event]=null;
    		}
    		else {
				var i = handlers.indexOf(listener);
				if(i != -1) 
				{
    		    	mraid.log('removing listener for '+event,'removeEventListener');
					handlers.splice(i, 1);    
				}
				else
				{
    		    	mraid.fireErrorEvent('attempted to remove listener for '+event+' but did not find it registered.','removeEventListener');
				}
			}
		}
	};
 
    /* window management */
    mraid.close = function () {
		if (state == STATES.EXPANDED ||
			state == STATES.RESIZED) {
    		mraid.log('executing bridge CLOSE','close');
			/* expanded ads will return to normal size. */
			psm_mraid_bridge.close();

		}
		else if (state == STATES.DEFAULT) {
    		mraid.log('executing bridge HIDE','close');
			/* default ads change to hidden. */
			psm_mraid_bridge.hide();
		}
		else if (state == STATES.LOADING || 
				state == STATES.HIDDEN) {
			mraid.fireErrorEvent('close failed because current state prevents closing.','close');
		}
    };
    
    mraid.expand = function (url) {
    	if (placementType != 'inline') {
			mraid.fireErrorEvent('expand not allowed because placement type is not inline.','expand');
    		return;
    	}
		if (state == STATES.DEFAULT ||
			state == STATES.RESIZED) {
    		mraid.log('executing bridge EXPAND','expand');
			/* default ads change to hidden. */
			psm_mraid_bridge.expand(url, mraid.expandable_props);
		}
		else if (state == STATES.LOADING || 
				state == STATES.HIDDEN ||
				state == STATES.EXPANDED)
		{
			mraid.fireErrorEvent('expand failed because current state prevents expanding.','expand');
		}	
    };

	mraid.open = function (url) {
		if(!url){
			mraid.fireErrorEvent( 'URL is required.', 'open');
		}else{
			mraid.log('opening '+url,'open');
			psm_mraid_bridge.open(url)
		}
	};

 	/*  MRAID 2.0 methods */
    mraid.setOrientationProperties = function (properties) {
        if (valid(properties, orientationPropertyValidators, 'setOrientationProperties')) {
            for (var i in properties) {
            	mraid.log('changing orientation property '+i+' from '+orientation_props[i]+' to '+properties[i],'setOrientationProperties');
                orientation_props[i] = properties[i];
            }
            /* push the latest orientation settings to the container */
			psm_mraid_bridge.updateOrientationProperties(orientation_props.allowOrientationChange,orientation_props.forceOrientation);
        }
    };
    
    mraid.getOrientationProperties = function () {
        return {
            allowOrientationChange: orientation_props.allowOrientationChange,
            forceOrientation: orientation_props.forceOrientation
        };
    };
    
    mraid.setResizeProperties = function (properties) {
        // Invalidate previously set properties cases 5,6 on the bad resize example from MRAID
        resize_props_set = false;
 
        if (valid(properties, resizePropertyValidators, 'setResizeProperties')) {

            var maxSize = mraid.getMaxSize();
            var defaultPosition = mraid.getDefaultPosition()
            if (properties.width < 50 || properties.height < 50) {
                mraid.fireErrorEvent('invalid properties for setResizeProperties: width or height is too small','setResizeProperties');
                return;
            }
            if (!properties.allowOffscreen) {
                if (properties.width > max_size.width || properties.height > max_size.height) {
                    mraid.fireErrorEvent('invalid properties for setResizeProperties: width or height is too big','setResizeProperties');
                    return;
                } else {
                    /* if offset+width would be larger than screen, reduce offset */
                    var posX = Math.max(0, Math.min(maxSize.width - properties.width, defaultPosition.offsetX + properties.offsetX)),
                        posY = Math.max(0, Math.min(maxSize.height - properties.height, defaultPosition.offsetY + properties.offsetY));
                    properties.offsetX = posX - defaultPosition.offsetX;
                    properties.offsetY = posY - defaultPosition.offsetY;
                }
            } else {
 
                mraid.log('================================  allowOffscreen = TRUE ================================', 'setResizeProperties');

                var pos = properties.customClosePosition,
                    closeOffsetX = 0,
                    closeOffsetY = 0,
                    closeTotalPositionX = 0,
                    closeTotalPositionY = 0;
                                         
                    if (properties.customClosePosition == CLOSE_POSITION.TOPLEFT ||
                        properties.customClosePosition == CLOSE_POSITION.TOPRIGHT ||
                        properties.customClosePosition == CLOSE_POSITION.TOPCENTER) {
                            closeOffsetY = 0;
                    } else if (properties.customClosePosition == CLOSE_POSITION.BOTTOMLEFT ||
                            properties.customClosePosition == CLOSE_POSITION.BOTTOMRIGHT ||
                            properties.customClosePosition == CLOSE_POSITION.BOTTOMCENTER) {
                            closeOffsetY = properties.height-50;
                    } else {
                        closeOffsetY = properties.height/2-25;
                    }
 
                    if (properties.customClosePosition == CLOSE_POSITION.TOPLEFT ||
                        properties.customClosePosition == CLOSE_POSITION.BOTTOMLEFT) {
                        closeOffsetX = 0;
                    } else if (properties.customClosePosition == CLOSE_POSITION.TOPRIGHT ||
                               properties.customClosePosition == CLOSE_POSITION.BOTTOMRIGHT) {
                        closeOffsetX = properties.width-50;
                    } else {
                        closeOffsetX = properties.width/2-25;
                    }
                                         
                    closeTotalPositionX = defaultPosition.offsetX + properties.offsetX + closeOffsetX;
                    closeTotalPositionY = defaultPosition.offsetY + properties.offsetY + closeOffsetY;
                    mraid.log('defaultPosition.offsetY:'+defaultPosition.offsetY+' properties.offsetY:'+properties.offsetY+' closeOffsetY:'+closeOffsetY,'setResizeProperties');
                    mraid.log('defaultPosition.offsetX:'+defaultPosition.offsetX+' properties.offsetX:'+properties.offsetX+' closeOffsetX:'+closeOffsetX,'setResizeProperties');
                    mraid.log('================================  allowOffscreen = TRUE ================================', 'setResizeProperties');

                    if (closeTotalPositionX < 0 ||
                        closeTotalPositionX > maxSize.width - 50 ||
                        closeTotalPositionY < 0 ||
                        closeTotalPositionY > maxSize.height - 50) {
                        mraid.fireErrorEvent('invalid properties for setResizeProperties','setResizeProperties');
                        return;
                    }

 
            }
            for (var i in properties) {
            	mraid.log('changing resize property '+i+' from '+resize_props[i]+' to '+properties[i],'setResizeProperties');
                resize_props[i] = properties[i];
            }
            resize_props_set = true;
        }
    };
 
    mraid.getResizeProperties = function() {
        var properties = {
            width: resize_props.width,
            height: resize_props.height,
            offsetX: resize_props.offsetX,
            offsetY: resize_props.offsetY,
            customClosePosition: resize_props.customClosePosition,
            allowOffscreen: resize_props.allowOffscreen
        };
        return properties;
    };

    mraid.resize = function () {
    	if (placementType != 'inline') {
			mraid.fireErrorEvent('resize not allowed because placement type is not inline.','resize');
    		return;
    	}
		if (state == STATES.DEFAULT ||
			state == STATES.RESIZED) {
						
			/* making sure that resize props have been set. */
			if (resize_props_set == false) {
				mraid.fireErrorEvent('resize not allowed because Resize Properties have not been set.','resize');
				return;
			}
			mraid.log('executing bridge RESIZE','resize');
			psm_mraid_bridge.resize(resize_props.width, resize_props.height, resize_props.offsetX,
									resize_props.offsetY,resize_props.customClosePosition,resize_props.allowOffscreen);
			/* reset the resize props */
			resize_props_set = false;
		} else if (state == STATES.LOADING ||
				state == STATES.HIDDEN ||
				state == STATES.EXPANDED) {
			mraid.fireErrorEvent('resize failed because current state prevents resizing.','resize');
		}	
	};
	
	mraid.getCurrentPosition = function () {
		return current_pos;
	};

	mraid.getDefaultPosition = function () {
    var position ={
            offsetX:default_pos.offsetX,
            offsetY:default_pos.offsetY,
            height: default_pos.height,
            width : default_pos.width,
        }
		return position;
	};

	mraid.getMaxSize = function() {
		return max_size;
	};

	mraid.getScreenSize = function() {
		return screen_size;
	};
	
	mraid.supports = function(feature) {
		return supported_features[feature];
	};
	
	mraid.storePicture = function(url) {
		if (!supported_features['storePicture']){
        	mraid.fireErrorEvent('Not supported','storePicture');
        	return;
        }
		mraid.log('executing storePicture','storePicture');
		psm_mraid_bridge.storePicture(url);
	};

	mraid.createCalendarEvent = function(parameters) {
		if (!supported_features['calendar']){
		    mraid.fireErrorEvent('Not supported','createCalendarEvent');
		    return;
		}
		mraid.log('executing createCalendarEvent','createCalendarEvent');
		psm_mraid_bridge.createCalendarEvent(JSON.stringify(parameters));
	};

	mraid.playVideo = function(url) {
		mraid.log("PLAYVIDEO LOG " + url);
		if (!supported_features['inlineVideo']){
		    mraid.fireErrorEvent('Not supported','playVideo');
		    return;
		}
		mraid.log('executing bridge PLAYVIDEO','playVideo');
		psm_mraid_bridge.playVideo(url);
	};

	mraid.playNativeVideo = function(url) {
		mraid.log("PLAY NATIVE VIDEO LOG " + url);
		mraid.log('executing bridge PLAY NATIVE VIDEO','playNativeVideo');
		psm_mraid_bridge.playNativeVideo(url);
	};
	

    /*
    // private helper methods.
	*/
	
	var valid = function(obj, validators, action, full) {
        if (full) {
            if (obj === undefined) {
                mraid.fireErrorEvent('Required object missing.', action);
                return false;
            } else {
                for (var i in validators) {
                    if (obj[i] === undefined) {
                        mraid.fireErrorEvent('Object missing required property ' + i, action);
                        return false;
                    }
                }
            }
        }
        for (var i in obj) {
            if (!validators[i]) {
                mraid.fireErrorEvent('Invalid property specified - ' + i + '.', action);
                return false;
            } else if (!validators[i](obj[i])) {
                mraid.fireErrorEvent('Value of property ' + i + ' is invalid.', action);
                return false;
            }
        }
        return true;
    };

	var existsInObj = function (value, obj)
	{
	    for (var i in obj) {
            if (value == obj[i]) {
                return true;
            } 
        }
		return false;
	}

    /*
     public helper methods.
	*/

	mraid.setCurrentPosition = function (position) {
        var changedValues = [];
 
        for (var i in position) {
            changedValues.push(i + ': ' + default_pos[i] + ' to '+ position[i]);
            current_pos[i] = position[i];
        }
 
        mraid.log('changing current position: ' + changedValues.join(' | '), 'setCurrentPosition');
        mraid.fireSizeChangeEvent();
	};

	mraid.setDefaultPosition = function (position) {
        var changedValues = [];
 
        for (var i in position) {
            changedValues.push(i + ': ' + default_pos[i] + ' to '+ position[i]);
            default_pos[i] = position[i];
        }
 
        mraid.log('changing default position: ' + changedValues.join(' | '), 'setDefaultPosition');
	};
	
	mraid.setMaxSize = function(size) {
        var changedValues = [];
 
        for (var i in size) {
            changedValues.push(i + ': ' + max_size[i] + ' to '+ size[i]);
            max_size[i] = size[i];
        }
 
        mraid.log('changing max size: ' + changedValues.join(' | '), 'setMaxSize');
	};

	mraid.setScreenSize = function(size) {
        var changedValues = [];
 
        for (var i in size) {
            changedValues.push(i + ': ' + screen_size[i] + ' to '+ size[i]);
            screen_size[i] = size[i];
        }
 
        mraid.log('changing screen size: ' + changedValues.join(' | '), 'setScreenSize');
	};
	
	mraid.setViewable = function (shown)
	{
		if (shown != viewable)
		{
			/* there is a change in the viewable state. */
			viewable = shown;
			mraid.fireViewableChangeEvent();
		} else {
	    	mraid.log('setViewable called with no change to view state','setViewable');
		}
	};

	mraid.setState = function(newState) {
        var oldState = state;
        state = newState;
        if (oldState == STATES.LOADING &&
            (newState == STATES.DEFAULT || newState == STATES.EXPANDED))
        {
            mraid.fireReadyEvent();
        }
        mraid.fireStateChangeEvent();
	};

	mraid.setPlacementType = function(newPlacement) {
    	mraid.log('changing placement type to:'+newPlacement,'setPlacementType');
		placementType=newPlacement;
	};

	mraid.setSupports = function(feature, value) {
		supported_features[feature] = value;
	};

	mraid.fireReadyEvent = function() {
		var handlers = listeners["ready"];
		if ( handlers != null ) {
			for ( var i = 0; i < handlers.length; i++ ) {
	    		mraid.log('executing ready event handler','fireReadyEvent');
				handlers[i]();
			}
		}
 
        mraid.log('MRAID version ' + mraid.getVersion() + ' (PSM version ' + mraid.getPsmVersion() + ')', "fireReadyEvent");
	
		return "OK";
	};
	
	mraid.fireErrorEvent = function( message, action ) {
		var handlers = listeners["error"];
		if ( handlers != null ) {
			for ( var i = 0; i < handlers.length; i++ ) {
				handlers[i]( message, action );
			}
		}
	
		return "OK";
	};
	
	/* triggers the viewableChange event with the current viewable value */
	mraid.fireViewableChangeEvent = function() {
		var handlers = listeners["viewableChange"];
		if ( handlers != null ) {
			for ( var i = 0; i < handlers.length; i++ ) {
	    		mraid.log('executing viewChange event handler','fireViewableChangeEvent');
				handlers[i]( viewable );
			}
		}
	
		return "OK";
	};
	
	/* triggers the sizeChange event with the current size value */
	mraid.fireSizeChangeEvent = function() {
		var handlers = listeners["sizeChange"];
		if ( handlers != null ) {
			for ( var i = 0; i < handlers.length; i++ ) {
	    		mraid.log('executing sizeChange event handler','fireSizeChangeEvent');
				handlers[i]( current_pos.width,current_pos.height );
			}
		}
	
		return "OK";
	};
	/* triggers the stateChange event with the current state value. */
	mraid.fireStateChangeEvent = function() {
		var handlers = listeners["stateChange"];
		if ( handlers != null ) {
			for ( var i = 0; i < handlers.length; i++ ) {
	    		mraid.log('executing stateChange event handler','fireStateChangeEvent');
				handlers[i]( state );
			}
		}
	
		return "OK";
	};

	mraid.log = function(logtext,method) {
        psm_mraid_bridge.log('DEBUG',logtext,method);
	}

	/* initialization
	// add an event listener to the error event so we can log errors
	// to the device console. */
	mraid.addEventListener('error', function(error, method) {
        psm_mraid_bridge.error('DEBUG',error,method);
    });

	mraid.addEventListener('stateChange', function(state) {
        psm_mraid_bridge.log('DEBUG','State changed to '+state,'State change');
    });
    
    mraid.addEventListener('viewableChange', function(viewable) {
        psm_mraid_bridge.log('DEBUG','Viewable changed to '+viewable,'Viewable change');
    });
   
    mraid.addEventListener('sizeChange', function(width, height) {
        psm_mraid_bridge.log('DEBUG','Size changed to '+width+":"+height,'Size change');
    });
 
    psm_mraid_bridge.log('DEBUG','initialized', 'init');
    
})();