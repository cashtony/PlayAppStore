var currentPlatform = null;
var appsPage = 0;

function switchPlatform(platform) {
	if (currentPlatform != platform) {
		currentPlatform = platform
		appsPage = 0;
		$('.platform_wrapper').children('li').remove();
		loadApps();
	}
}

function loadApps(){
	appsPage++;
	$.ajax({
		url:"/records/"+currentPlatform,
		success: function(data){
			if (data.error) {
				return;
			}
			var moreButton = $('.app_wrapper .moreAppButton');
			moreButton.hide();
			var wrapper = $('.platform_wrapper');
			$.each(data, function(index, val) {
				var item =
				'<li>'+
					'<div class="app_info">'+
						'<img src="'+val.icon+'" alt="">'+
						'<div class="info_box">'+
							'<span class="app_name">'+val.name+
							'</span><span class="version_number">'+val.version+'</span><br>'+
							'<span>更新:</span>'+
							'<span class="update_time">'+val.createdAt+'</span>'+
							'<br><span class="changelog">'+(val.changelog ? val.changelog : "")+'</span>'+
						'</div>'+
						// '<a class="down_btn" href="'+val.url+'">下载</a>'+
					'</div>'+
					'<ul class="all_version" bundleID="'+val.bundleId+'" nextPage="1"></ul>'+
				'</li>';
				wrapper.append(item);
			});
			if (data.length > 0) {
				// moreButton.remove();
				// wrapper.append(moreButton);
				// moreButton.show();
			}
		}
	});
}

function loadMoreVersion(el) {
	var thisVersionInfo = null;
	if ($(el).hasClass("info_box")) {
		thisVersionInfo = $(el).parent('.app_info').siblings('.all_version');
		thisVersionInfo.toggleClass('show_version');
		if(thisVersionInfo.children().length > 1) {
			return;
		}
	} else {
		thisVersionInfo = $(el).parent('.all_version');
		$(el).remove();
	}
	var bundleID = thisVersionInfo.attr('bundleId');
	var page = thisVersionInfo.attr('nextPage');
	$.ajax({
		url:"/apps/"+currentPlatform+"/"+bundleID,
		data: { page: page},
		success: function(version){
			if (version.error) {
				return;
			}
			$.each(version,function(index,val){
				var versionLists = 
				'<li data="'+val.manifest+'" >'+
					'<img src="'+val.icon+'" alt="">'+
					'<p><span class="app_name">'+val.name+'</span><span class="version_number">'+val.version+'  '+val.build+'</span></p><p><span>更新：</span><span class="update_time">'+val.updatedAt+'</span></p><p><span class="changelog">'+(val.changelog ? val.changelog : "")+'</span></p>'+
					'<a class="down_btn" href="'+val.manifest+'">下载</a>'+
				'</li>';
				thisVersionInfo.append(versionLists);
			});
			thisVersionInfo.attr('nextPage', parseInt(page)+1);
			if (version.length > 0) {
				var moreButton = 
				'<li id="moreButton">'+
					'<span>加载更多</span>'+
				'</li>';
				thisVersionInfo.append(moreButton);
			}
		}
	});
}

$(function(){
	$('.platform_title').on('click',function(){
		$(this).siblings().removeClass('selected_title');
		$(this).addClass('selected_title');
		switchPlatform($(this).text().toLowerCase());
	});
	//点击展开二维码
	$('.qrcode_btn').on('click',function(){ 
		$('.qrcode_box').toggleClass('qrcode_box_show');
		$(this).toggleClass('open');
	});
	//点击加载更多APP
	$('.app_wrapper .moreAppButton').on('click',function() {
		loadApps();
	});
	//点击展开版本内容
	$('.platform_wrapper').on('click','.info_box',function() {
		loadMoreVersion(this);
	});
	
	//版本选择
	$('.platform_wrapper').on('click','.all_version li',function(){ 
		if ($(this).attr("id") == 'moreButton') {
			loadMoreVersion(this);
			return;
		}
		
		// if(!$(this).hasClass('select') ){ 
		// 	$(this).siblings('li').removeClass('select');
		// 	$(this).addClass('select');
		// 	$(this).parent().siblings().children('.down_btn').attr('href',$(this).attr('data'));
		// 	var app_infoNode = $(this).parent().siblings().children('.info_box');
		// 	app_infoNode.find('.app_name').text($(this).find('.app_name').text())
		// 	app_infoNode.find('.version_number').text($(this).find('.version_number').text())
		// 	app_infoNode.find('.update_time').text($(this).find('.update_time').text())
		// 	app_infoNode.find('.changelog').text($(this).find('.changelog').text())
		// }
	});
	
	// 二维码
	$('.qrcode_pic').attr('src',"https://pan.baidu.com/share/qrcode?w=150&h=150&url="+location.href);
	switchPlatform('ios');
});