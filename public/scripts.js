$(document).ready(function(){

	$("#pick-title").chosen({no_results_text: "No results matched"}).change(function(){
		var opts = $('#pick_title_chzn ul li span');
		$.each(opts,function(k,v){
			console.log(v);
		});
	});

	$(document).on('keyup','#title-search',function(e){
		liveSearch('title',e);
	});

	$(document).on('keyup','#content-search',function(e){
		liveSearch('content',e);
	});

	function liveSearch(type,e){
		var value = $.trim($(e.target).val());
		var cell = $('#main-table tr td.'+type);
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