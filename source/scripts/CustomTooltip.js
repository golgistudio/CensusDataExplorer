
/** @module Widgets */

/**
 *
 * @param tooltipId
 * @param width
 * @returns {{showTooltip: showTooltip, hideTooltip: hideTooltip, updatePosition: updatePosition}}
 * @constructor
 */
function CustomTooltip(tooltipId, width){
    "use strict";

    /**
     *
     * @param content
     * @param event
     */
	function showTooltip(content, event){

        toolTipSelector.html(content);
        toolTipSelector.show();
		
		updatePosition(event);
	}

    /**
     *
     */
	function hideTooltip(){
		$("#"+tooltipId).hide();
	}

    /**
     *
     * @param event
     */
	function updatePosition(event){
		var xOffset = 20;
		var yOffset = 10;
		
		 var ttw = toolTipSelector.width();
		 var tth = toolTipSelector.height();
		 var wscrY = $(window).scrollTop();
		 var wscrX = $(window).scrollLeft();
		 var curX = (document.all) ? event.clientX + wscrX : event.pageX;
		 var curY = (document.all) ? event.clientY + wscrY : event.pageY;
		 var ttleft = ((curX - wscrX + xOffset*2 + ttw) > $(window).width()) ? curX - ttw - xOffset*2 : curX + xOffset;
		 if (ttleft < wscrX + xOffset){
		 	ttleft = wscrX + xOffset;
		 } 
		 var tttop = ((curY - wscrY + yOffset*2 + tth) > $(window).height()) ? curY - tth - yOffset*2 : curY + yOffset;
		 if (tttop < wscrY + yOffset){
		 	tttop = curY + yOffset;
		 }
         toolTipSelector.css('top', tttop + 'px').css('left', ttleft + 'px');
	}

    /**
     *
     * @type {*|jQuery|HTMLElement}
     */
    var toolTipSelector = $("#"+tooltipId);


    if (toolTipSelector.length === 0){
        $("body").append("<div class='tooltip' id='"+tooltipId+"'></div>");
    }

    if(width){
        toolTipSelector.css("width", width);
    }

    hideTooltip();
	
	return {
		showTooltip: showTooltip,
		hideTooltip: hideTooltip,
		updatePosition: updatePosition
	};
}
