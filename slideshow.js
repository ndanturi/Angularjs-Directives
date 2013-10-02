app.directive('slideShow', ['$compile', function ($compile){
	var requestData = null;
	var domElement = null;
	var elementStackId = null;

	var galleryType = {
		slideshow : {
			template :'<script src="/builder//scripts/jquery.build.js"></script><script src="slideShowHelper.js"></script> <style type="text/css">#slideshow{margin: 80px auto; position: relative; width: 340px;} #slideshow > div {position: absolute; top: 10px; left: 10px; right: 10px; bottom: 10px;}</style> <div id="slideshow">{#images} <div><img style="width: 340px; height: 340px;" src="{src}"></div>{/images} </div>'
		},
		grid : {
			template :'<script src="/builder/scripts/jquery.build.js"></script> <link rel="stylesheet" type="text/css" href="/builder/styles/gallery.css"> <style type="text/css"> body, html{height: 100%;} </style> <div crex-builder-item="editSlideShow"> <ul class="gallery">{#images} <li class="gallery"><a href="#" class="image"><img src="{src}"></a></li>{/images}</ul></div>'
		}
	};

	var buildAndSendInsertHtml = function(scope, imgData){
		var galleryTypeData = galleryType[imgData.gallery];
		dust.loadSource(dust.compile(galleryTypeData.template, 'slideShow_changes'));
		dust.render('slideShow_changes', imgData, function(err, out) {
			if( out ){
				scope.sendRequest( 'slideShow_insert', {html:out, elementStackId:elementStackId} );
			}
			if( err ){
				CREX.debug.error('dust error, rendering form:',err.message);
			}
		});
	};			

	return {
		restrict: 'E',
		scope: false,
		replace: true,
		templateUrl: 'partials/slideShow.html',
		link: function(scope, element, attrs){	
			domElement = element;
						
			scope.slideShow = {
				gallery :'grid',
				images : [				
				{ src : 'http://farm6.static.flickr.com/5224/5658667829_2bb7d42a9c_m.jpg' },
				{ src : 'http://farm6.static.flickr.com/5224/5658667829_2bb7d42a9c_m.jpg' },
				{ src : 'http://images.nationalgeographic.com/wpf/media-live/photos/000/252/cache/autumn-landscape-colorful-leaves_25289_990x742.jpg'},
				{ src : 'http://images.nationalgeographic.com/wpf/media-live/photos/000/252/cache/dust-tornado-djibouti-africa_25296_990x742.jpg'}				
				],
				pop : function(indx){
					scope.slideShow.images.splice(indx,1);
				},
				set : function(opts){
					angular.extend(scope.slideShow, opts);
				}
			};
			

			scope.$on('dropZoneFileUploaded', function(eventScope, data){
				scope.slideShow.images.push({ src : data});				
			});		

			var stackId;
			scope.$on('editSlideShow', function(event, templateData){
				jQuery("#modal_slideShowEditor").modal();
				elementStackId = templateData.elementStackId;
			});

			element.find('.btn-insert').click(function(event){
				buildAndSendInsertHtml( scope, scope.slideShow );
			});

			element.find('[data-dismiss]:not(.btn-insert)').click(function(event){
				scope.sendRequest('editModal_cancel', {elementStackId:requestData.elementStackId} );
			});

			element.find('[data-toggle="popover"]').popover({
				trigger:'click',
				content: function(){
					var html = "<image-picker-helper></image-picker-helper>";
					var link = $compile(html)( scope );
					scope.$apply();
					return link;
				}
			});			
			
			/*element.find('#launch_popover').on("click", function(event){
				options = {
                content: 'this is a popover',
                    html: true,
                    placement: 'left',
                    trigger: 'focus'
                }
				$("#launch_popover").popover(options);
				$("#launch_popover").popover('show');
			}); */

		}
	};
}]);
