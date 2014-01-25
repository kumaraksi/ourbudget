/* Table initialisation */
$(document).ready(function() {
    var responsiveHelper = undefined;
    var oTable;
    var index = 1;
    var breakpointDefinition = {
        tablet: 1024,
        phone : 480
    };    
	var tableElement = $('#example');
    
    var tableOptions = {
		"sDom": "<'row'<'col-md-6'l T><'col-md-6'f>r>t<'row'<'col-md-12'p i>>",
			"oTableTools": {
			"aButtons": [
				{
					"sExtends":    "collection",
					"sButtonText": "<i class='icon-cloud-download'></i>",
					"aButtons":    [ "csv", "xls", "pdf", "copy"]
				}
			]
		},
		"sPaginationType": "bootstrap",
		 "aoColumnDefs": [
          { 'bSortable': false, 'aTargets': [ 0 ] }
		],
		"aaSorting": [[ 1, "asc" ]],
		"oLanguage": {
			"sLengthMenu": "_MENU_ ",
			"sInfo": "Showing <b>_START_ to _END_</b> of _TOTAL_ entries"
		},
		 bAutoWidth     : false,
        fnPreDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper) {
                responsiveHelper = new ResponsiveDatatablesHelper(tableElement, breakpointDefinition);
            }
        },
        fnRowCallback  : function (nRow) {
            responsiveHelper.createExpandIcon(nRow);
            var checkboxIndex = ++index;
            nRow.childNodes[0].innerHTML = "<div class='checkbox check-default'>" + 
                          "<input type='checkbox' value='3' id='checkbox" + checkboxIndex + "'>" + 
                          "<label for='checkbox" + checkboxIndex + "'></label>"
                        "</div>";
        },
        fnDrawCallback : function (oSettings) {
            responsiveHelper.respond();
             $('#example input').click( function() {
            $(this).parent().parent().parent().toggleClass('row_selected');
        });
        },
        "bDeferRender": true,
         "aaData": [
        ],
         "aoColumns": [
            { "mData": null },
            null,
            null,
            null,
            null,
            null
        ]
	};

    oTable = tableElement.dataTable(tableOptions);
    
     // Start of the Flot Chart Javascript
    
   
    $(".dropdown-value").click(function(){
        $("#url").attr('value', $(this).text());
    });
    
    // Write the Earnings Tab Initialization code.
    
    // Hide the Tiles
    $('#todayDataTile').hide();
    $('#yesterdayDataTile').hide();
    $('#curMonthDataTile').hide();
    $('#lastMonthDataTile').hide();
    
    // Get the Data from the Server for the tiles.
    refreshData("todayDataLabel");
    refreshData("yesterdayDataLabel");
    refreshData("monthDataLabel");
    refreshData("lastmonDataLabel");
    
    getRegisteredURLS();
    
     //Date Pickers
	  $('.input-append.date').datepicker({
                format: 'yyyy-mm-dd',
				autoclose: true,
				todayHighlight: true
	   }); 
    
    // Validations for Date Ranges
    $("#startDate").datepicker()
    .on('changeDate', function(e){
         
        var end = new Date( $('#endDate').datepicker('getDate'));
        
        if (e.date > end)
        {
            alert("Please choose the From Date to be before the To Date");
                  $("#startDate").datepicker('setDate', end);
        }
        else{
                  
        }
       
    });
    
     $("#endDate").datepicker()
    .on('changeDate', function(e){
        
        var start = new Date( $('#startDate').datepicker('getDate'));
        
         if (e.date < start)
          {
            alert("Please choose the To Date to be after the From Date");
            $("#endDate").datepicker('setDate', start);
          }
          else{
                  
          }
       
    });
    
    //Date Pickers
    var endDate = Date.today();
    var startDate = Date.today();
    startDate = startDate.addDays(-7);
    
    $("#startDate").datepicker('setDate', startDate);
    $("#endDate").datepicker('setDate', endDate);
    
	var plot = $.plot($("#placeholder"), seriesData, options);
    
    $("#placeholder").bind("plothover", function (event, pos, item) {

				if (item) {
					var x = item.datapoint[0].toFixed(2),
						y = item.datapoint[1].toFixed(2);
                     
                    var date = new Date(Math.floor(parseFloat(x).toFixed(0)));
					$("#tooltip").html(item.series.label + " of " + date.toString() + " = " + y)
						.css({top: item.pageY+5, left: item.pageX+5})
						.fadeIn(200);
				} else {
					$("#tooltip").hide();
				}
	
		}); 

    
    $("#placeholder").bind("plotselected", function (event, ranges) {

			// do the zooming

			plot = $.plot("#placeholder", seriesData, $.extend(true, {}, options, {
				xaxis: {
					min: ranges.xaxis.from,
					max: ranges.xaxis.to
				}
			}));
		});
    
     //Date Pickers
	  $('.input-append.date').datepicker({
                format: 'yyyy-mm-dd',
				autoclose: true,
				todayHighlight: true
	   });
    
    
     // End of the Flot Chart Javascript
  
 
    	
	$('#example input').click( function() {
        $(this).parent().parent().parent().toggleClass('row_selected');
    });
    
    $('#tableController').click(getReportData);
    $('#flotRestore').click(function() {
        plot = $.plot($("#placeholder"), seriesData, options);
        
    });
    
    $("#toggelSeriesDiv").find("input").click(toggleSeriesData);
   
    $("a.collapse").click(function(){$(this).removeClass('collapse').addClass('expand');});
    $("a.expand").click(function() {$(this).removeClass('expand').addClass('collapse');});
    
    $('#example_wrapper .dataTables_filter input').addClass("input-medium "); // modify table search input
    $('#example_wrapper .dataTables_length select').addClass("select2-wrapper span12"); // modify table per page dropdown	
});



/* Set the defaults for DataTables initialisation */
$.extend( true, $.fn.dataTable.defaults, {
	"sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span12'p i>>",
	"sPaginationType": "bootstrap",
	"oLanguage": {
		"sLengthMenu": "_MENU_"
	}
} );


/* Default class modification */
$.extend( $.fn.dataTableExt.oStdClasses, {
	"sWrapper": "dataTables_wrapper form-inline"
} );


/* API method to get paging information */
$.fn.dataTableExt.oApi.fnPagingInfo = function ( oSettings )
{
	return {
		"iStart":         oSettings._iDisplayStart,
		"iEnd":           oSettings.fnDisplayEnd(),
		"iLength":        oSettings._iDisplayLength,
		"iTotal":         oSettings.fnRecordsTotal(),
		"iFilteredTotal": oSettings.fnRecordsDisplay(),
		"iPage":          oSettings._iDisplayLength === -1 ?
			0 : Math.ceil( oSettings._iDisplayStart / oSettings._iDisplayLength ),
		"iTotalPages":    oSettings._iDisplayLength === -1 ?
			0 : Math.ceil( oSettings.fnRecordsDisplay() / oSettings._iDisplayLength )
	};
};

/* Bootstrap style pagination control */
$.extend( $.fn.dataTableExt.oPagination, {
	"bootstrap": {
		"fnInit": function( oSettings, nPaging, fnDraw ) {
			var oLang = oSettings.oLanguage.oPaginate;
			var fnClickHandler = function ( e ) {
				e.preventDefault();
				if ( oSettings.oApi._fnPageChange(oSettings, e.data.action) ) {
					fnDraw( oSettings );
				}
			};

			$(nPaging).addClass('pagination').append(
				'<ul>'+
					'<li class="prev disabled"><a href="#"><i class="icon-chevron-left"></i></a></li>'+
					'<li class="next disabled"><a href="#"><i class="icon-chevron-right"></i></a></li>'+
				'</ul>'
			);
			var els = $('a', nPaging);
			$(els[0]).bind( 'click.DT', { action: "previous" }, fnClickHandler );
			$(els[1]).bind( 'click.DT', { action: "next" }, fnClickHandler );
		},

		"fnUpdate": function ( oSettings, fnDraw ) {
			var iListLength = 5;
			var oPaging = oSettings.oInstance.fnPagingInfo();
			var an = oSettings.aanFeatures.p;
			var i, ien, j, sClass, iStart, iEnd, iHalf=Math.floor(iListLength/2);

			if ( oPaging.iTotalPages < iListLength) {
				iStart = 1;
				iEnd = oPaging.iTotalPages;
			}
			else if ( oPaging.iPage <= iHalf ) {
				iStart = 1;
				iEnd = iListLength;
			} else if ( oPaging.iPage >= (oPaging.iTotalPages-iHalf) ) {
				iStart = oPaging.iTotalPages - iListLength + 1;
				iEnd = oPaging.iTotalPages;
			} else {
				iStart = oPaging.iPage - iHalf + 1;
				iEnd = iStart + iListLength - 1;
			}

			for ( i=0, ien=an.length ; i<ien ; i++ ) {
				// Remove the middle elements
				$('li:gt(0)', an[i]).filter(':not(:last)').remove();

				// Add the new list items and their event handlers
				for ( j=iStart ; j<=iEnd ; j++ ) {
					sClass = (j==oPaging.iPage+1) ? 'class="active"' : '';
					$('<li '+sClass+'><a href="#">'+j+'</a></li>')
						.insertBefore( $('li:last', an[i])[0] )
						.bind('click', function (e) {
							e.preventDefault();
							oSettings._iDisplayStart = (parseInt($('a', this).text(),10)-1) * oPaging.iLength;
							fnDraw( oSettings );
						} );
				}

				// Add / remove disabled classes from the static elements
				if ( oPaging.iPage === 0 ) {
					$('li:first', an[i]).addClass('disabled');
				} else {
					$('li:first', an[i]).removeClass('disabled');
				}

				if ( oPaging.iPage === oPaging.iTotalPages-1 || oPaging.iTotalPages === 0 ) {
					$('li:last', an[i]).addClass('disabled');
				} else {
					$('li:last', an[i]).removeClass('disabled');
				}
			}
		}
	}
} );


/*
 * TableTools Bootstrap compatibility
 * Required TableTools 2.1+
 */

	// Set the classes that TableTools uses to something suitable for Bootstrap
	$.extend( true, $.fn.DataTable.TableTools.classes, {
		"container": "DTTT ",
		"buttons": {
			"normal": "btn btn-white",
			"disabled": "disabled"
		},
		"collection": {
			"container": "DTTT_dropdown dropdown-menu",
			"buttons": {
				"normal": "",
				"disabled": "disabled"
			}
		},
		"print": {
			"info": "DTTT_print_info modal"
		},
		"select": {
			"row": "active"
		}
	} );

	// Have the collection use a bootstrap compatible dropdown
	$.extend( true, $.fn.DataTable.TableTools.DEFAULTS.oTags, {
		"collection": {
			"container": "ul",
			"button": "li",
			"liner": "a"
		}
	} );
