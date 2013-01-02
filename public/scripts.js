$(document).ready(function(){

	$("#pick-title").chosen({no_results_text: "No results matched"}).change(function(){

		var el = $(this);
		var opts = el.parent().find('.chzn-results .result-selected');
		chooseTitle(opts);
	});

	// $(document).on('keyup','#title-search',function(e){
	// 	liveSearch('title',e);
	// });

	$(document).on('keyup','#content-search',function(e){
		liveSearch('content',e);
	});

	function chooseTitle(opts){
		var cell = $('#main-table tr td.title');
		var choice = [];
		$.each(opts,function(k,v){
			choice.push($(v).text());
		});

		if(choice.length == 0){
			$('#main-table tr').show();
			$('#main-table tr td').removeClass('not-show');
			return false;
		}

		$.each(cell,function(k,el){
			el = $(el);
			var row = el.parent();
			if($.inArray(el.text(),choice) != -1){
				row.find('td').removeClass('not-show');
				row.show();
			}else{
				row.find('td').addClass('not-show');
				row.hide();
			}
		});
	}

	function liveSearch(type,e){
		var value = $.trim($(e.target).val());
		var cell = $('#main-table tr td.'+type+':not(.not-show)');
		$.each(cell,function(k,el){
			el = $(el);
			var row = el.parent();
			if(value.length > 2){
				var m = el.text().toLowerCase().match(new RegExp(value,'gi'));
				if(!m){
					row.hide();
				}else{
					row.show();
					row.unhighlight();
					row.highlight(value);
				}
			}else{
				row.show();
				row.unhighlight();
			}
		});
	}

});