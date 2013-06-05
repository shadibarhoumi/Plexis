if ($(window).width() < 640) {

(function(b){b.support.touch="ontouchend" in document;if(!b.support.touch){return;}var c=b.ui.mouse.prototype,e=c._mouseInit,a;function d(g,h){if(g.originalEvent.touches.length>1){return;}g.preventDefault();var i=g.originalEvent.changedTouches[0],f=document.createEvent("MouseEvents");f.initMouseEvent(h,true,true,window,1,i.screenX,i.screenY,i.clientX,i.clientY,false,false,false,false,0,null);g.target.dispatchEvent(f);}c._touchStart=function(g){var f=this;if(a||!f._mouseCapture(g.originalEvent.changedTouches[0])){return;}a=true;f._touchMoved=false;d(g,"mouseover");d(g,"mousemove");d(g,"mousedown");};c._touchMove=function(f){if(!a){return;}this._touchMoved=true;d(f,"mousemove");};c._touchEnd=function(f){if(!a){return;}d(f,"mouseup");d(f,"mouseout");if(!this._touchMoved){d(f,"click");}a=false;};c._mouseInit=function(){var f=this;f.element.bind("touchstart",b.proxy(f,"_touchStart")).bind("touchmove",b.proxy(f,"_touchMove")).bind("touchend",b.proxy(f,"_touchEnd"));e.call(f);};})(jQuery);


	$('#buckets li').click(function() {
		var $bucketID = $(this).attr("data-id");
		
		$('.bucket').fadeOut(200);
				
		$('#' + $bucketID + ', #' + $bucketID + ' .chat ').delay(200).fadeIn(200);
	
	});
	
	$('.chat.head').click(function() {
		var $chatBucketID = $(this).attr("data-type");
		
		var $selector = $(this).parent().children('.chat[data-type!=' + $chatBucketID +']');
		
		
		
		$selector.each(function() {
			var $height = $(this).outerHeight();
			$(this).css('height', $height);
		});
		
		$selector.css("opacity","0").delay(100).css("height","0").animate({marginBottom: 0, scrollTop: 0}, '200', function() {
        	$(this).css({"opacity":"1", "height":"auto", "marginBottom":"10px" }).hide();
		});
		
		$("html, body").delay(100).animate({ scrollTop: 0 }, 400);
		
		$('#' + $chatBucketID ).delay(200).fadeIn(200);
	
	});
	
	$('#input .input').click(function() {
		$("html, body").delay(100).animate({ scrollTop: 0 }, 200);
	});
	
	
	$(document).ready(function () {
	
	$("html, body").animate({ scrollTop: $(document).height() }, "fast");
	
		$('.bucket .chat.draggable').draggable({
			start: handleDragStart,
		    cursor: 'move',
		    revert: 'invalid',
		    stop: handleDragStop,
		  });
	
	
		$("#buckets li").droppable({
	        drop: function(event, ui) {
	            $transferBucket = $(this).attr("data-id");
	            ui.draggable.attr("data-type", $transferBucket);
	            ui.draggable.draggable('option','revert',true);
	        }
	        
	    });
	    
	    $('div').bind("dragstart", function(event, ui){
        event.stopPropagation();
        });
    
    
	});
	
	function handleDragStop( event, ui ) {
		$('#buckets').removeClass('open');
	}
	function handleDragStart( event, ui ) {
		$('#buckets').addClass('open');
	}

} else{

$('#buckets li').click(function() {
		var $bucketID = $(this).attr("data-id");
		var x = $('#' + $bucketID).offset().left;
		var $window = $(window);
		var $windowHalf = $window.width()/2-150;
		
		$('html, body').animate({scrollLeft: (x - $windowHalf)}, 800);
	
      //var currentElement = currentElement.next();
      //$('html, body').animate({scrollLeft: $(currentElement).offset().left}, 800);
      //return false;
   }); 
   
   $(document).ready(function () {
	   var numItems = $('.bucket').length;
	   var widthBox = numItems*400+400;
	   
	   $('#wrapper').css("width",widthbox);
	});
}